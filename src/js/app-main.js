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

var APP = require('./components/App.react');

var HomeScreen = require('./components/HomeScreen.react');
var RoundHome = require('./components/RoundHome.react');
var Question = require('./components/Question.react');
var RoundIndex = require('./components/RoundIndex.react');
var RoundExample = require('./components/RoundExample.react');

ReactDOM.render((
  <Router>
    <Route path="/" component={APP}>
      <IndexRoute component={HomeScreen} />
      <Route path="round/:roundId" component={RoundHome}>
        <Route path="index" component={RoundIndex} />
        <Route path="example" component={RoundExample} />
        <Route path="question/:questionId" component={Question} />
      </Route> 
    </Route>
  </Router>
), document.getElementById('react-container'));