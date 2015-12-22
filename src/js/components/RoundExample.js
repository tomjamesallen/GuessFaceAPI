var React = require('react');
var QuestionsList = require('./parts/QuestionsList');
var QuestionDisplay = require('./parts/QuestionDisplay');
var Link = require('react-router').Link;
var Lifecycle = require('react-router').Lifecycle;
var QuestionRouterMixin = require('./mixins/QuestionRouterMixin');

var RoundExample = React.createClass({

  mixins: [ Lifecycle, QuestionRouterMixin ],

  contextTypes: {
    history: React.PropTypes.object.isRequired
  },

  componentWillMount: function () {
    // Check that round exists, if not, redirect to home.
    var roundId = this.props.params.roundId;
    var machineRoundId = roundId -1;

    var data = this.props.state.data;

    var exampleFound = false;

    if (typeof data.rounds[machineRoundId].exampleData === 'object') {
      exampleFound = true;
    }

    if (!exampleFound) {
      this.context.history.pushState(null, '/round/' + roundId);
    }
    else {
      var question = data.rounds[machineRoundId].exampleData;
      question.humanId = 'Example Question';
      
      this.setState({
        question: question,
        roundId: roundId,
        round: data.rounds[machineRoundId]
      });
    }
  },
  
  render: function () {
    if (!this.state.question) return null;
    var question = this.state.question;
    var round = this.state.round;
    var link = '/';

    if (typeof round.questionsData[0] !== 'undefined') {
      link = '/round/' + this.state.roundId + '/question/1';
    }
    
    return (
      <div>
        <QuestionDisplay question={question} questionState={this.props.state.questionState} emit={this.props.emit}/>
        <Link to={link}>Start Round</Link>
      </div>
    );
  }
});

module.exports = RoundExample;