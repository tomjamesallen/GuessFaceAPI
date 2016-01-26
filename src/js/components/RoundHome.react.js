var React = require('react');
var Link = require('react-router').Link;
var _ = require('underscore');

var Display = require('./helpers/Display.react');
var QuestionsList = require('./QuestionsList.react');
var QuestionDisplay = require('./QuestionDisplay.react');

var RoundHome = React.createClass({

  contextTypes: {
    history: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      round: null,
    }
  },

  componentWillMount: function () {
    // Check that round exists, if not, redirect to home.
    var roundId = this.props.params.roundId;
    var machineRoundId = roundId -1;

    var data = this.props.state.data;

    var roundFound = false;

    if (typeof data.rounds[machineRoundId] === 'object') {
      roundFound = true;
    }

    if (!roundFound) {
      this.context.history.pushState(null, '/');
    }

    if (roundFound) {
      var round = data.rounds[machineRoundId];
      round.humanId = round.roundId + 1;

      this.setState({
        round: round
      });
    }
  },

  render: function () {
    if (!this.state.round) return null;
    var round = this.state.round;
    var hasQuestionId = typeof this.props.params.questionId !== 'undefined';

    return (
      <div>
        <h1>Round {round.humanId}</h1>

        <Display if={!hasQuestionId}>
          <h2>Round home</h2>          
        </Display>

        {this.props.children ? React.cloneElement(this.props.children, {state: this.props.state, emit: this.props.emit, round: round}) : null}

        <div><Link to={'/round/' + round.humanId + '/index'}>Round Index</Link></div>
        <div><Link to={'/round/' + round.humanId + '/example'}>Round Example</Link></div>
        <Display if={!hasQuestionId}><Link to={'/round/' + round.humanId + '/question/1'}>Start Round</Link></Display>
      </div>
    );
  }
});

module.exports = RoundHome;