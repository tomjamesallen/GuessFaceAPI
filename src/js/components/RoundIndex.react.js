var React = require('react');
var QuestionsList = require('./parts/QuestionsList');

var RoundIndex = React.createClass({
  
  render: function () {

    return (
      <QuestionsList questions={this.props.round.questionsData}/>
    );
  }
});

module.exports = RoundIndex;