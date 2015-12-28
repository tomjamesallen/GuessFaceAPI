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
    this.setupLinks(question);
  },

  componentWillReceiveProps: function (nextProps) {
    this.setupLinks(nextProps.question);
  },

  setupLinks: function (question) {
    var questionId = question.questionId;
    var roundId = question.roundData.roundId;

    var questionIdHuman = parseInt(questionId) + 1;
    var numQuestions = _.toArray(this.props.round.questionsData).length;

    var first = null;
    var prev = null;
    var next = null;

    if (numQuestions && questionIdHuman !== 1) {
      first = '/round/' + (roundId + 1) + '/question/1';
    }

    if (questionIdHuman > 1) {
      prev = '/round/' + (roundId + 1) + '/question/' + (questionIdHuman - 1);
    }

    if (questionIdHuman < numQuestions) {
      next = '/round/' + (roundId + 1) + '/question/' + (questionIdHuman + 1);
    }

    this.setState({
      first: first,
      prev: prev,
      next: next
    });
  },

  render: function () {

    var first = this.state.first;
    var prev = this.state.prev;
    var next = this.state.next;

    return (
      <div className="prev-next">
        {first ? <Link to={first} className="button">First</Link> : <span className="button button-inactive">First</span>}
        {prev ? <Link to={prev} className="button">Prev</Link> : <span className="button button-inactive">Prev</span>}
        {next ? <Link to={next} className="button">Next</Link> : <span className="button button-inactive">Next</span>}
      </div>
    );
  }
});

module.exports = PrevNext;