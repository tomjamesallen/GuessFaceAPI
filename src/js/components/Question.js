var React = require('react');
var Link = require('react-router').Link;

var Question = React.createClass({

  contextTypes: {
    history: React.PropTypes.object.isRequired
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
  },

  componentDidMount: function () {
    // var router = this.context.router;
    console.log('Question', this);



    // this.context.history.pushState(null, '/round/2');

  },

  emit: function () {

  },

  render: function () {
    return <h2>Question</h2>;

    // return (
    //   <div>
    //     {[{title: 'something'}, {title: 'another title'}].map(function (object, i) {
    //       return <div>{object.title}</div>
    //     })}
    //   </div>
    // );
  }
});

module.exports = Question;