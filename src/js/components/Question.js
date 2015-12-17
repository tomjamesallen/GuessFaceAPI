var React = require('react');
var Link = require('react-router').Link;
var QuestionDisplay = require('./parts/QuestionDisplay');

var Question = React.createClass({

  contextTypes: {
    history: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      question: null,
    }
  },

  componentWillMount: function () {
    // Check that question exists, if not, redirect to round's home.
    // Check that round exists, if not, redirect to home.
    var roundId = this.props.params.roundId;
    var machineRoundId = roundId -1;
    var questionId = this.props.params.questionId;
    var machineQuestionId = questionId -1;

    var data = this.props.state.data;

    var roundFound = false;
    var questionFound = false;

    if (typeof data.rounds[machineRoundId] === 'object') {
      roundFound = true;

      if (typeof data.rounds[machineRoundId].questionsData[machineQuestionId] === 'object') {
        questionFound = true;
      }
    }

    if (!roundFound) {
      this.context.history.pushState(null, '/');
    }
    else if(!questionFound) {
      this.context.history.pushState(null, '/round/' + roundId);
    }

    if (roundFound && questionFound) {
      var question = data.rounds[machineRoundId].questionsData[machineQuestionId];
      question.humanId = question.questionId + 1;

      this.setState({
        question: question
      });

    }
  },

  componentDidMount: function () {
    // var router = this.context.router;
  },

  emit: function () {

  },

  render: function () {
    if (!this.state.question) return null;
    var question = this.state.question;
    return (
      <QuestionDisplay question={question} />
    );
  }
});

module.exports = Question;