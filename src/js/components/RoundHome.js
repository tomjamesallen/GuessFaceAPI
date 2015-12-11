var React = require('react');
var Link = require('react-router').Link;

var RoundHome = React.createClass({
  render: function () {
    return (
      <div>
        <h1>Round Something</h1>
        <div>{this.props.children}</div>
      </div>
    );
  }
});

module.exports = RoundHome;