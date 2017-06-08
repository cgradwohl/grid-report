


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
    let body_template        = '<div class ="body col {{col.size}}">{{col.value}}<div class="hideMe"></div></div>';
    let nested_body_template = '<div class ="body col {{col.size}}"><div>{{col.value1}}</div><div class="hideMe">{{col.value2}}</div></div>';

    // cacheDOM
    let $grid = $('#grid-module');

    // subscribe to events
    events.on('selectorChange', show);
    events.on('columnChange', updateGrid);

    // saves ajax success response as a resolved promise
    let gridData = new Promise( (resolve, reject) => {
        $.ajax({
            url     : 'data/data.json',
            dataType: 'json',
            success : response => resolve(response),
            error   : err => reject(err)
        });
    });


    // use's fufilled promise to initialize Grid
    gridData.then(data => init(data));


    /** @param {Array<JSON>} - initializes grid with 5 columns */
    function init(data) {

        // sends dropdown module all header names
        let headers = Object.keys(data[0]);
        let names   = headers.slice(0,5);
        let size    = 5;


        events.emit('renderDropdown', headers);

        // renders Grid Header
        names.map(name => {
            $grid.append(Mustache.render(header_template,
                {name: name.toUpperCase(), size: map[size]}
            ));
        });

        // renders Grid Body
        data.map(obj => {
            for (let key in obj) {
                if( names.includes(key) ) {
                    $grid.append(Mustache.render(body_template,
                        {col:{value: obj[key], size: map[size]}}
                    ));
                }
            }
        });

    }


    /** @param {Array<Number>} - updates Grid on 'columnChange' event */
    function updateGrid(selected) {

        // removes old templates
        $grid.empty();

        // use's fufilled promise
        gridData.then( data => {
            let headers = Object.keys(data[0]);
            let names   = [];

            // uses selected index to map to header names
            selected.map(index => names.push(headers[index]) );

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
                            // adds multi valued keys to the nested template
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


    /** @param {Boolean} - shows hidden Elements */
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

    // subscribe to events
    events.on('renderDropdown', init);
    events.on('dropdownFormClick', getSelected);

    /** @param {Array<String>} - initializes the dropdown with json key names */
    function init(data) {

        let i = 0;
        data.map(name => {
            $dropdown.append(Mustache.render(checkbox_template,
                {name: name.toUpperCase(), value: i}
            ));
            i ++;
        });
    }

    /** @param {None} - gets the index of the selected fields and sends to Grid Module */
    function getSelected() {

        let numbers = [];
        let $fields = $('.fields').toArray().map(field => {
            if(field['checked']) numbers.push(field['value']);
        });

        if( numbers.length>5 ) alert("PLEASE SELECT ONLY FIVE FIELDS!")

        else events.emit('columnChange', numbers);
    }

})();
