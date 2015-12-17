var React = require('react');
var QuestionsList = require('./parts/QuestionsList');

var RoundExample = React.createClass({
  
  render: function () {

    console.log(this);

    return (
      <h1>Round example</h1>
    );
  }
});

module.exports = RoundExample;