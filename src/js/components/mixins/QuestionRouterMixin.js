module.exports = {
  routerWillLeave: function (nextLocation) {
    var that = this;

    var questionState = this.props.state.questionState;

    if (questionState.target === false && questionState.current === false) {
      return true;
    }

    this.props.emit('storeTransition', nextLocation);
    this.props.emit('questionState', 'end');

    return false;
  },

  componentDidMount: function () {
    // Here we update the target question state to 'ready'.
    this.props.emit('questionState', 'ready');
  },
};