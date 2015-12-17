var React = require('react');
var QuestionsList = require('./parts/QuestionsList');
var QuestionDisplay = require('./parts/QuestionDisplay');

var RoundExample = React.createClass({

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
        question: question
      });
    }
  },
  
  render: function () {
    if (!this.state.question) return null;
    var question = this.state.question;
    return (
      <QuestionDisplay question={question} />
    );
  }
});

module.exports = RoundExample;