var React = require('react');
var Router = require('react-router');
var $ = require('../vendor/jquery-1.11.3.min.js');
var Display = require('./parts/Display');
var Link = require('react-router').Link;

var APP = React.createClass({

  contextTypes: {
    history: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
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
    }
  },

  componentWillUpdate: function (nextProps, nextState) {
    // Watch for data loading.
    if (!this.state.data && nextState.data) {
      console.log('data loaded');
    }
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
        console.log('retryTransition', this.state.storedTransiton);
        this.context.history.pushState(null, this.state.storedTransiton.pathname);
        this.setState({
          storedTransiton: null,
        });
      }
    }

    // console.log('new state', this.state);
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
    // console.log('APP', this);

    return (
      <div>
        <Display if={this.state.error}>
          <h1>Error: {this.state.error}</h1>
        </Display>
        <Display if={!this.state.data && !this.state.error}>
          <h1>Data loading</h1>
        </Display>
        <Link to="/">Home</Link>
        {this.state.data ? React.cloneElement(this.props.children, {state: this.state, emit: this.emit}) : null}
      </div>
    );
  }
});

module.exports = APP;