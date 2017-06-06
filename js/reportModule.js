/**
*
* EVENT AGGREGATION OBJECT
* based on the publish/subscribe and mediator pattern (https://addyosmani.com/resources/essentialjsdesignpatterns/book/#mediatorpatternjavascript)(https://github.com/addyosmani/pubsubz/blob/master/pubsubz.js)
*/
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



/**
*
* SELECTOR MODULE
*/
(function() {


    // cacheDOM

    // bind events

    // @TODO: applySelector() - events.emit('selectorChange', boolean)


})();



/**
*
* GRID MODULE
*/
(function() {
    let reportArray   = [];
    let reportColumns = [];


    // cacheDOM


    // bind events
    /*events.on('selectorChange', show);
    events.on('columnChange', updateGrid);*/

    init();

    function init() {
        // gets JSON and gets it ready to put into the grid template
        getGridData();

        // render();
    }


    function getGridData() {

        $.ajax({
            url: 'data/data.json',
            dataType: 'json',
            success: function(response) {
                reportArray   = response;
                reportColumns = Object.keys(reportArray[0]);

                events.emit('columnNames', reportColumns);
            }
        });
    }
    // @TODO: render() - renders the grid templates from json data

    // @TODO: show(bool) - if(bool) showMoreStuff else showLessStuff

    // @TODO: updateGrid(colNames) - renders grid based on colNames


})();



/**
*
* DROPDOWN MODULE
*/
(function() {


    // cacheDOM


    // bind events
    events.on('columnNames', setDropdown);


    function setDropdown(columnNames) {
        // use columnNames to render the dropdown-content
        console.log(columnNames);

        // render()
    }


    // @TODO: render()

    // @TODO: applyColumnChange() - events.emit('columnChange', newColumnNames)
})();
