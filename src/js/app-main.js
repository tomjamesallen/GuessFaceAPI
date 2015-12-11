var Q = require('q');
var _ = require('underscore');

var React = require('react');
var ReactDOM = require('react-dom');

var Router = require('react-router').Router;
var Route = require('react-router').Route;

var IndexRoute = require('react-router').IndexRoute;
// var DefaultRoute = require('react-router').DefaultRoute;
// var NotFoundRoute = require('react-router').NotFoundRoute;

var APP = require('./components/APP');

var HomeScreen = require('./components/HomeScreen');

ReactDOM.render((
  <Router>
    <Route path="/" component={APP}>
      <IndexRoute component={HomeScreen} />
    </Route>
  </Router>
), document.getElementById('react-container'));