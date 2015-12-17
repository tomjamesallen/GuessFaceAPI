var React = require('react');
var Link = require('react-router').Link;
var _ = require('underscore');

var PrevNext = React.createClass({

  getInitialState: function () {
    return {
      first: null,
      prev: null,
      next: null
    }
  },

  componentWillMount: function () {
    var question = this.props.question;
    var questionId = question.questionId;
    var roundId = question.roundData.roundId;

    var questionIdHuman = parseInt(questionId) + 1;
    var numQuestions = _.toArray(this.props.round.questionsData).length;

    var first = null;
    var prev = null;
    var next = null;

    if (numQuestions) {
      first = '/round/' + (roundId + 1) + '/question/1';
    }

    if (questionIdHuman > 1) {
      prev = '/round/' + (roundId + 1) + '/question/' + (questionIdHuman - 1);
    }

    if (questionIdHuman < numQuestions) {
      next = '/round/' + (roundId + 1) + '/question/' + (questionIdHuman + 1);
    }

    console.log({
      first: first,
      prev: prev,
      next: next
    });

    this.setState({
      first: first,
      prev: prev,
      next: next
    })
  },

  render: function () {

    var first = this.state.first;
    var prev = this.state.prev;
    var next = this.state.next;

    return (
      <div className="prev-next">
        {first ? <Link to={first}>First</Link> : null}
        {prev ? <Link to={prev}>Prev</Link> : null}
        {next ? <Link to={next}>Next</Link> : null}
      </div>
    );
  }
});

module.exports = PrevNext;