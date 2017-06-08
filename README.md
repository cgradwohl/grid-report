## Grid Report
a business report application using a responsive data grid.

## Live Application
https://cgradwohl.github.io/grid-report/


## Application Design

#### Mustache Templating and jQuery
Since this challenge awarded bonus points for using vanilla javascript, I wanted to build the application without an MVC framework. I chose to use Mustache and jQuery since they are lightweight, familiar technologies and they are simpler than es6 template strings.

Mustache.js is a minimal template library that works well with jQuery. However, since it lacks data binding, it made rendering complex components challenging.

#### EVENT MEDIATOR
This Project uses a version of the publish/subscribe and mediator pattern to handle all events as well as state transfer in the application.

To learn more about about these patterns see:

(https://addyosmani.com/resources/essentialjsdesignpatterns/book/#mediatorpatternjavascript)

(https://github.com/addyosmani/pubsubz/blob/master/pubsubz.js)


#### GRID MODULE
The Grid Module is styled by a custom five column DIV layout, which is populated by JSON data and rendered via mustache templates. JSON is requested via an AJAX request, which I wrapped in a promise, so the module only makes one ajax request.

The Grid Module has three main operations: init(), updateGrid(), show() and transfers its state via the Event Mediator.


#### DROPDOWN MODULE
