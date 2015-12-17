var React = require('react');
var Link = require('react-router').Link;
var _ = require('underscore');

var Display = require('./parts/Display');
var QuestionsList = require('./parts/QuestionsList');

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

  componentDidMount: function () {
    console.log('RoundHome', this);
  },

  emit: function () {

  },

  render: function () {
    if (!this.state.round) return null;
    var round = this.state.round;
    return (
      <div>
        <h1>Round {round.humanId}</h1>

        <Display if={!this.props.children}>
          <h2>Round home</h2>
          <QuestionsList questions={round.questionsData}/>
        </Display>

        {this.props.children ? React.cloneElement(this.props.children, {state: this.props.state, emit: this.emit}) : null}
      </div>
    );
  }
});

module.exports = RoundHome;