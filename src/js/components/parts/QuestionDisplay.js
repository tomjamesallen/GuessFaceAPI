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

  componentWillReceiveProps: function (nextProps) {
    this.calculateBestImgs(nextProps.question);
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

  getBestImg: function (which, ref, question) {
    var question = question|| this.props.question;
    var el = this.refs[ref];
    var elWidth = el.clientWidth;
    var imgsArray = question.imgs[which].srcs;
    var pixelRatio = window['devicePixelRatio'] || 1;
    elWidth = elWidth * pixelRatio;

    var widths = _.map(_.keys(imgsArray), function (key) {
      return parseInt(key);
    }).sort(function (a, b) {
      if (a > b) return 1;
      else return -1;
    });

    var bestImg = this.getClosestValue(elWidth, widths);
    return question.imgs[which].srcs[bestImg];
  },

  calculateBestImgs: function (question) {
    var question = question || this.props.question;
    this.setState({
      imgs: {
        imgA: this.getBestImg('a','imgA', question),
        imgB: this.getBestImg('b','imgB', question),
        imgAMix: this.getBestImg('mix','imgAMix', question),
        imgBMix: this.getBestImg('mix','imgBMix', question)
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

    var wrapperStyle = {paddingBottom: (question.imgs.mix.aspectRatio*100) + "%"};

    return (
      <div className="question-wrapper">
        <h2>Question {question.humanId}</h2>
        <div className="a-wrapper">
          <div className="imgs-wrapper" style={wrapperStyle}>
            <div className="img-wrapper img-wrapper-question" ref="imgA">
              <Display if={imgs}><img src={imgA} /></Display>
            </div>
            <div className="img-wrapper img-wrapper-answer" ref="imgAMix">
              <Display if={imgs}><img src={imgAMix} /></Display>
            </div>
          </div>
        </div>

        <div className="b-wrapper">
          <div className="imgs-wrapper" style={wrapperStyle}>
            <div className="img-wrapper img-wrapper-question" ref="imgB">
              <Display if={imgs}><img src={imgB} /></Display>
            </div>
            <div className="img-wrapper img-wrapper-answer" ref="imgBMix">
              <Display if={imgs}><img src={imgBMix} /></Display>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = QuestionDisplay;