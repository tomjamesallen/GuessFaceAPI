var React = require('react');
var Router = require('react-router');

var APP = React.createClass({
  render: function () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = APP;