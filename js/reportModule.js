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
/***    @name SELECTOR MODULE   ***/
/***    *   *   *   *   *   *   ***/
(function() {


    // cacheDOM

    // bind events

    // @TODO: applySelector() - events.emit('selectorChange', boolean)


})();



/***    *   *   *   *   *   *   ***/
/***    @name GRID MODULE       ***/
/***    *   *   *   *   *   *   ***/
(function() {
    let map      = ['','five', 'four', 'three', 'two', 'one'];

    // cacheDOM
    let $grid = $('#grid-module');
    let header_template = $('#grid-header').html();
    let body_template = $('#grid-body').html();

    // bind events
    /*events.on('selectorChange', show);
    events.on('columnChange', updateGrid);
    events.on('gridHeader', renderHeader);
    events.on('gridBody', renderBody);*/

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

        if( tooManyHeaders ) {
            names = headers.slice(0,5);
            index = 5;
        } else {
            names = data;
            index = data.length;
        }

        // renders Grid Header
        names.forEach(name => {
            $grid.append(Mustache.render(header_template,
                {name: name.toUpperCase(), size: map[index]}
            ));
        });

        // renders Grid Body


    }

    // @TODO: show(bool) - if(bool) render more else render less,

    // @TODO
    // takes as input an array of names
    /*function renderHeader(data) {

    }
    */



    // @TODO
    // events.on('promisetest', updateBody); <- use this bind the DROPDOWN update
    // we want this to take the full object array as input
    /*function renderBody(data) {
        console.log(data);
        // RENDER NEW GRID BODY
    }*/
})();


/***    *   *   *   *   *   *   ***/
/***    @name DROPDOWN MODULE   ***/
/***    *   *   *   *   *   *   ***/
(function() {


    // cacheDOM


    // bind events
    // events.on('columnNames', render);
    // OR
    // events.on('columnNames', setDropdown);

    events.on('gridHeader', render);


    function setDropdown(columnNames) {
        // use columnNames to render the dropdown-content
        // console.log(columnNames);

        // @TODO
        // USE THE PROMISE TO EMIT EVENT FROM DROPDOWN :)
        // USE THIS IN DROPDOWN
        /*gridData.then( data => {
            events.emit('promisetest', data);
        });*/
    }


    function render(data) {
        // console.log(data);
    }

    // @TODO: applyColumnChange() - events.emit('columnChange', newColumnNames)
})();
