var React = require('react');
var Link = require('react-router').Link;
var RoundsList = require('./parts/RoundsList');

var HomeScreen = React.createClass({
  render: function () {
    var rounds = this.props.state.data.rounds;
    return (
      <div>
        <h1>Welcome to guessface</h1>
        <RoundsList rounds={rounds} />
      </div>
    );
  }
});

module.exports = HomeScreen;