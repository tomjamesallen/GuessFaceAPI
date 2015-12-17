var React = require('react');
var Router = require('react-router');
var $ = require('../vendor/jquery-1.11.3.min.js');
var Display = require('./parts/Display');

var APP = React.createClass({

  getInitialState: function () {
    return {
      data: null,
      error: false
    }
  },

  componentWillUpdate: function (nextProps, nextState) {
    // Watch for data loading.
    if (!this.state.data && nextState.data) {
      console.log('data loaded');
    }
  },

  emit: function (type, data) {

  },

  componentDidMount: function () {
    var that = this;
    $.getJSON('/api/index.json', function (data){
      if (that.isMounted()) {
        that.setState({
          data: data
        });
      }
    })
    .fail(function() {
      that.setState({
        error: 'Unable to load questions.'
      })
    });
  },

  render: function () {
    return (
      <div>
        <Display if={this.state.error}>
          <h1>Error: {this.state.error}</h1>
        </Display>
        <Display if={!this.state.data && !this.state.error}>
          <h1>Data loading</h1>
        </Display>
        {this.state.data ? React.cloneElement(this.props.children, {state: this.state, emit: this.emit}) : null}
      </div>
    );
  }
});

module.exports = APP;