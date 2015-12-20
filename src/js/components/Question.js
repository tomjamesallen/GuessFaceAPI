var React = require('react');
var Link = require('react-router').Link;
var QuestionDisplay = require('./parts/QuestionDisplay');
var PrevNext = require('./parts/PrevNext');
var Lifecycle = require('react-router').Lifecycle;

var Question = React.createClass({

  // shouldTransition: false,

  mixins: [ Lifecycle ],

  contextTypes: {
    history: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      question: null,
    }
  },

  routerWillLeave: function (nextLocation) {
    var that = this;
    // console.log('nextLocation', nextLocation);

    // if (!this.shouldTransition) {
    //   console.log('cancelled transition');
    //   this.shouldTransition = true;
    //   setTimeout(function () {
    //     console.log('call pushstate');
    //     that.context.history.pushState(null, nextLocation.pathname);
    //   }, 1000);

    //   return false;
    // }
    // else {
    //   console.log('going to transition this time');
    // }
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
        question: question,
        round: data.rounds[machineRoundId]
      });
    }
  },

  componentWillUpdate: function (nextProps) {

  },

  componentWillReceiveProps: function (nextProps) {
    if (this.props.params.questionId !== nextProps.params.questionId) {
      this.updateQuestionAndRound(nextProps);
    }
  },

  updateQuestionAndRound: function (nextProps) {
    var roundId = nextProps.params.roundId;
    var machineRoundId = roundId -1;
    var questionId = nextProps.params.questionId;
    var machineQuestionId = questionId -1;

    var data = nextProps.state.data;

    var question = data.rounds[machineRoundId].questionsData[machineQuestionId];
    question.humanId = question.questionId + 1;

    this.setState({
      question: question,
      round: data.rounds[machineRoundId]
    });
  },

  componentDidMount: function () {
    
  },

  render: function () {
    if (!this.state.question) return null;
    var question = this.state.question;
    var round = this.state.round;

    return (
      <div>
        <QuestionDisplay question={question} questionState={this.props.state.questionState} emit={this.props.emit}/>
        <PrevNext question={question} round={round} />
      </div>
    );
  }
});

module.exports = Question;