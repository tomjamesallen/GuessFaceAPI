var React = require('react');
var Router = require('react-router');
var $ = require('../vendor/jquery-1.11.3.min.js');

var APP = React.createClass({

  getInitialState: function () {
    return {
      data: {}
    }
  },

  componentDidMount: function () {
    var that = this;
    $.getJSON('/api/index.json', function (data){
      if (that.isMounted()) {
        that.setState({
          data: data
        });
      }
    });
  },

  render: function () {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});

module.exports = APP;