var React = require('react');
var _ = require('underscore');
var Link = require('react-router').Link;

var QuestionsList = React.createClass({

  renderQuestion: function (question, i) {
    var link = 
      '/round/' + 
      (question.roundData.roundId + 1) + 
      '/question/' +
      (question.questionId + 1);

    return (
      <li key={i}><Link to={link}>Question {question.questionId + 1}</Link></li>
    );
  },

  render: function () {
    return (
      <ul>
        {_.map(this.props.questions, this.renderQuestion)}
      </ul>
    );
  }
});

module.exports = QuestionsList;