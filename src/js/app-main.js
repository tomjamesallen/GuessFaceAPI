var Q = require('q');

var React = require('react');
var ReactDOM = require('react-dom');

var Router = require('react-router').Router;
var Route = require('react-router').Route;

// var createBrowserHistory = require('history/lib/createBrowserHistory');
// var history = createBrowserHistory();

var IndexRoute = require('react-router').IndexRoute;
// var DefaultRoute = require('react-router').DefaultRoute;
// var NotFoundRoute = require('react-router').NotFoundRoute;

var APP = require('./components/APP');

var HomeScreen = require('./components/HomeScreen');
var RoundHome = require('./components/RoundHome');
var Question = require('./components/Question');
var RoundIndex = require('./components/RoundIndex');

ReactDOM.render((
  <Router>
    <Route path="/" component={APP}>
      <IndexRoute component={HomeScreen} />
      <Route path="round/:roundId" component={RoundHome}>
        <Route path="index" component={RoundIndex} />
        <Route path="question/:questionId" component={Question} />
      </Route> 
    </Route>
  </Router>
), document.getElementById('react-container'));