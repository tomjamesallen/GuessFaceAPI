var React = require('react');

var Display = React.createClass({
  render: function () {
    console.log(this);
    return (this.props.if) ? <div className={this.props.className || null}>{this.props.children}</div> : null;
  }
});

module.exports = Display;