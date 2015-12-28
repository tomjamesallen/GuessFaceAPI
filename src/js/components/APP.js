var React = require('react');
var Router = require('react-router');
var $ = require('../vendor/jquery-1.11.3.min.js');
var debounce = require('debounce');
var Display = require('./parts/Display');
var Link = require('react-router').Link;

var APP = React.createClass({

  contextTypes: {
    history: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    var layout = this.getCurrentLayout(true);
    return {
      data: null,
      error: false,
      // questionState: false // false / 'resting' / 'question' / 'answer'

      questionState: {
        current: false,
        // Use this state when updating state from anywhere except an animation
        // end callback.
        target: false
      },
      storedTransiton: null,
      layout: layout,
    }
  },

  getCurrentLayout: function (returnOnly) {
    var returnOnly = returnOnly || false;
    var $bpHelper = $('.bp-helper');
    if (!$bpHelper.length) return;
    var currentLayout = $bpHelper
      .css('content')
      .replace(/'/gi, '')
      .replace(/"/gi, '');

    if (returnOnly) {
      return currentLayout;
    }

    if (currentLayout !== this.state.layout) {
      this.setState({
        layout: currentLayout
      });
    }
  },

  handleResize: function(e) {
    this.getCurrentLayout();
  },

  debouncedResize: null,

  componentWillUpdate: function (nextProps, nextState) {
    // Watch for data loading.
    if (!this.state.data && nextState.data) {}
  },

  emit: function (type, data) {
    console.log('emit', type, data);

    if (type === 'questionState') {
      var questionState = this.state.questionState;
      questionState.target = data;

      if (this.state.questionState.target !== data.target) {
        this.setState({
          questionState: questionState
        });
      } 
    }

    if (type === 'questionStateCallback') {
      var questionState = this.state.questionState;
      questionState.current = data;
      this.setState({
        questionState: questionState
      });
    }

    if (type === 'storeTransition') {
      this.setState({
        storedTransiton: data
      })
    }

    if (type === 'retryTransition') {
      if (this.state.storedTransiton) {
        this.context.history.pushState(null, this.state.storedTransiton.pathname);
        this.setState({
          storedTransiton: null,
        });
      }
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
    })
    .fail(function() {
      that.setState({
        error: 'Unable to load questions.'
      })
    });

    this.debouncedResize = debounce(this.handleResize, 200);
    window.addEventListener('resize', this.debouncedResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.debouncedResize);
  },

  render: function () {
    return (
      <div className="app-wrapper-outer">
        <div className="app-wrapper">
          <Display if={this.state.error}>
            <h1>Error: {this.state.error}</h1>
          </Display>
          <Display if={!this.state.data && !this.state.error}>
            <h1>Loading...</h1>
          </Display>
          <Link to="/">Home</Link>
          {this.state.data ? React.cloneElement(this.props.children, {state: this.state, emit: this.emit}) : null}
        </div>
      </div>
    );
  }
});

module.exports = APP;