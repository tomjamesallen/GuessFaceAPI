var React = require('react');
var Link = require('react-router').Link;
var Display = require('./parts/Display');
var _ = require('underscore');

var RoundHome = React.createClass({

  contextTypes: {
    history: React.PropTypes.object.isRequired
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
  },

  componentDidMount: function () {
    console.log('RoundHome', this);
  },

  emit: function () {

  },

  render: function () {
    return (
      <div>
        <h1>Round Something</h1>

        

        <Display if={!this.props.children}>
          <h2>Round home</h2>
        </Display>

        {this.props.children ? React.cloneElement(this.props.children, {state: this.props.state, emit: this.emit}) : null}
      </div>
    );
  }
});

module.exports = RoundHome;