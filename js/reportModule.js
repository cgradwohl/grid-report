/***    *   *   *   *   *   *  ***/
/***    @name EVENT MEDIATOR   ***/
/***    *   *   *   *   *   *  ***/
const events = {
    events: {},

    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },

    off: function(eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            };
        }
    },

    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
    }
};


/***    *   *   *   *   *   *   ***/
/***    @name GRID MODULE       ***/
/***    *   *   *   *   *   *   ***/
(function() {
    let map                  = ['','five', 'four', 'three', 'two', 'one'];
    let header_template      = '<div class ="header col {{size}}"><strong>{{name}}</strong></div>';
    let last_header_template = '<div class ="header col {{size}}"><strong>{{name}}</strong><div class="dropdown" ><a class="dropbtn"><div class="arrow-down"></div></a><form id="dropdown-module" class="dropdown-content"><h3>Selected Fields</h3><button type="button" class="dropdown-btn" name="button" onclick="events.emit("dropdownFormClick")">Apply</button></form></div></div>';
    let body_template        = '<div class ="body col {{col.size}}">{{col.value}}<div class="hideMe"></div></div>';
    let nested_body_template = '<div class ="body col {{col.size}}"><div>{{col.value1}}</div><div class="hideMe">{{col.value2}}</div></div>';

    // cacheDOM
    let $grid = $('#grid-module');


    // bind events
    events.on('selectorChange', show);
    events.on('updateGrid', updateGrid);

    // request data
    let gridData = new Promise( (resolve, reject) => {
        $.ajax({
            url     : 'data/data.json',
            dataType: 'json',
            success : response => resolve(response),
            error   : err => reject(err)
        });
    });
    gridData.then(data => init(data));


    function init(data) {

        let headers        = Object.keys(data[0]);
        let tooManyHeaders = Object.keys(data[0]).length >= 5;
        let index          = 0;
        let names          = [];

        events.emit('renderDropdown', headers);

        if( tooManyHeaders ) {
            names = headers.slice(0,5);
            index = 5;
        } else {
            names = headers;
            index = names.length;
        }

        // renders Grid Header
        names.map(name => {
            $grid.append(Mustache.render(header_template,
                {name: name.toUpperCase(), size: map[index]}
            ));
        });

        // renders Grid Body
        data.map(obj => {
            for (let key in obj) {
                if( names.includes(key) ) {
                    $grid.append(Mustache.render(body_template,
                        {col:{value: obj[key], size: map[index]}}
                    ));
                }
            }
        });

    }

    function updateGrid(indexArr) {

        // removes old templates
        $grid.empty();

        gridData.then( data => {
            let headers = Object.keys(data[0]);
            let names   = [];

            indexArr.map(index => names.push(headers[index]) );

            // renders Grid Header
            names.map(name => {
                $grid.append(Mustache.render(header_template,
                    {name: name.toUpperCase(), size: map[names.length]}
                ));
            });

            // renders Grid Body
            data.map(obj => {
                for (let key in obj) {
                    if( names.includes(key) ){
                        if( typeof(obj[key])==='object' ){
                            // ADD LISTED TEMPLATE
                            $grid.append(Mustache.render(nested_body_template,
                                {col:{value1: obj[key][0], value2: obj[key][1], size: map[names.length]}}
                            ));
                        }else {
                            $grid.append(Mustache.render(body_template,
                                {col:{value: obj[key], size: map[names.length]}}
                            ));
                        }
                    }
                }
            });
        });
    }

    function show(bool) {

        let $hiddenTags = $('.hideMe');

        if( bool ) $hiddenTags.show();
        else $hiddenTags.hide();
    }

})();


/***    *   *   *   *   *   *   ***/
/***    @name DROPDOWN MODULE   ***/
/***    *   *   *   *   *   *   ***/
(function() {

    // cacheDOM
    let $dropdown = $('#dropdown-module');
    let checkbox_template = '<input class="fields" type="checkbox" name="" value="{{value}}">{{name}}<br>';

    // bind events
    events.on('renderDropdown', render);
    events.on('dropdownFormClick', getSelected);

    // gets the index of the selected fields
    // makes an extra DOM query :(
    function getSelected(){

        let numbers = [];
        let $fields = $('.fields').toArray().map(field => {
            if(field['checked']) numbers.push(field['value']);
        });

        if( numbers.length>5 ) alert("PLEASE SELECT ONLY FIVE FIELDS!")
        else events.emit('updateGrid', numbers);
    }

    function render(data) {

        let i = 0;
        data.map(name => {
            $dropdown.append(Mustache.render(checkbox_template,
                {name: name.toUpperCase(), value: i}
            ));
            i ++;
        });
    }

})();
