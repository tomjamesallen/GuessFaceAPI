var React = require('react');
var _ = require('underscore');
var Link = require('react-router').Link;

var RoundsList = React.createClass({

  renderRound: function (round, i) {
    var link = 
      '/round/' + 
      (round.roundId + 1);

    console.log(round);

    return (
      <li key={i}><Link to={link}>Round {round.roundId + 1}: {round.title}</Link></li>
    );
  },

  render: function () {
    return (
      <ul>
        {_.map(this.props.rounds, this.renderRound)}
      </ul>
    );
  }
});

module.exports = RoundsList;