var React = require('react');
var debounce = require('debounce');
var Display = require('./Display');
var _ = require('underscore');

var QuestionDisplay = React.createClass({

  getInitialState: function () {
    return {
      imgs: null
    }
  },

  componentWillMount: function () {
    
  },

  handleResize: function(e) {
    this.calculateBestImgs();
  },

  debouncedResize: null,

  componentDidMount: function() {
    this.debouncedResize = debounce(this.handleResize, 200);
    window.addEventListener('resize', this.debouncedResize);

    // We have to call calculateBestImgs after component has mounted because we
    // need to get the width of the wrapper elements.
    this.calculateBestImgs();
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.debouncedResize);
  },

  // Borrowed from Imager.js.
  getClosestValue: function (baseValue, candidates) {
    var i           = candidates.length,
      selectedWidth = candidates[i - 1];

    baseValue = parseFloat(baseValue);

    while (i--) {
      if (baseValue <= candidates[i]) {
        selectedWidth = candidates[i];
      }
    }

    return selectedWidth;
  },

  getBestImg: function (which, ref) {
    var question = this.props.question;
    var el = this.refs[ref];
    var elWidth = el.clientWidth;
    var imgsArray = question.imgs[which];
    var pixelRatio = window['devicePixelRatio'] || 1;
    elWidth = elWidth * pixelRatio;

    var widths = _.map(_.keys(imgsArray), function (key) {
      return parseInt(key);
    }).sort(function (a, b) {
      if (a > b) return 1;
      else return -1;
    });

    var bestImg = this.getClosestValue(elWidth, widths);
    return question.imgs[which][bestImg];
  },

  calculateBestImgs: function () {
    this.setState({
      imgs: {
        imgA: this.getBestImg('a','imgA'),
        imgB: this.getBestImg('b','imgB'),
        imgAMix: this.getBestImg('mix','imgAMix'),
        imgBMix: this.getBestImg('mix','imgBMix')
      }
    });
  },

  render: function () {
    var question = this.props.question;
    var imgs = this.state.imgs;

    if (imgs) {
      var imgA = this.state.imgs.imgA;
      var imgB = this.state.imgs.imgB;
      var imgAMix = this.state.imgs.imgAMix;
      var imgBMix = this.state.imgs.imgBMix;
    }

    return (
      <div className="question-wrapper">
        <h2>Question {question.humanId}</h2>
        <div className="a-wrapper">
          <div className="img-wrapper img-wrapper-question" ref="imgA">
            <Display if={imgs}><img src={imgA} /></Display>
          </div>
          <div className="img-wrapper img-wrapper-answer" ref="imgAMix" >
            <Display if={imgs}><img src={imgAMix} /></Display>
          </div>
        </div>

        <div className="b-wrapper">
          <div className="img-wrapper img-wrapper-question" ref="imgB">
            <Display if={imgs}><img src={imgB} /></Display>
          </div>
          <div className="img-wrapper img-wrapper-answer" ref="imgBMix">
            <Display if={imgs}><img src={imgBMix} /></Display>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = QuestionDisplay;