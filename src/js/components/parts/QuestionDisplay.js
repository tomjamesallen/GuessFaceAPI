var React = require('react');
var debounce = require('debounce');
var Display = require('./Display');
var _ = require('underscore');
// var gsap = require('gsap');
var GSAP = require('react-gsap-enhancer').default;
var TimelineLite = require('../../../../node_modules/gsap/src/uncompressed/TimelineLite');

var QuestionDisplay = GSAP()(React.createClass({

  cRefs: {},

  getInitialState: function () {
    return {
      imgs: null,
      questionState: 'start' // start/question/answer
    }
  },

  componentWillMount: function () {
    

    // window.tl = tl;

  },

  componentWillUpdate: function (nextProps, nextState) {
    if (this.state.questionState !== nextState.questionState) {
      this.updateQuestionState(nextState);
    }
  },

  updateQuestionState: function (nextState) {
    // console.log(nextState.questionState);
    // console.log(this.refs);
    // console.log(this.state.tl);

    

    // this.state.tl.play();
  },

  handleResize: function(e) {
    this.calculateBestImgs();
  },

  debouncedResize: null,

  componentDidMount: function() {
    this.debouncedResize = debounce(this.handleResize, 200);
    window.addEventListener('resize', this.debouncedResize);

    // window.imgAMix = this.refs.imgAMix;

    // We have to call calculateBestImgs after component has mounted because we
    // need to get the width of the wrapper elements.
    this.calculateBestImgs();

    // Timeline Tests
    this.tl = this.addAnimation(createAnimation);

    console.log('did mount.', this);

    // this.tl.fromTo(this.cRefs.imgA, 0.5, {opacity:"0"});
    // this.tl.fromTo(this.cRefs.imgB, 0.5, {opacity:"0"});
    // this.tl.fromTo(this.cRefs.imgAMix, 0.5, {opacity:"0"});
    // this.tl.fromTo(this.cRefs.imgBMix, 0.5, {opacity:"0"});
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
    var el = this.cRefs[ref];

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
        imgBMix: this.getBestImg('mix','imgBMix', question),
        imgMix: this.getBestImg('mix','imgMix', question),
      }
    });
  },

  showQuestion: function () {
    this.setState({
      questionState: 'question'
    });
  },

  showAnswer: function () {
    this.setState({
      questionState: 'answer'
    });
  },

  render: function () {
    console.log('render');
    var question = this.props.question;
    var imgs = this.state.imgs;
    var that = this;

    if (imgs) {
      var imgA = this.state.imgs.imgA;
      var imgB = this.state.imgs.imgB;
      var imgAMix = this.state.imgs.imgAMix;
      var imgBMix = this.state.imgs.imgBMix;
      var imgMix = this.state.imgs.imgMix;
    }

    var wrapperStyle = {paddingBottom: (question.imgs.mix.aspectRatio*100) + "%"};

    return (
      <div className={"question-wrapper question-state-" + this.state.questionState}>
        <div className="title-wrapper">
          <h2>Question {question.humanId}</h2>
        </div>

        <div className="a-b-wrapper">
          <div className="mobile-question-only-wrapper" style={wrapperStyle} ref={function (el) {that.cRefs.imgMix = el}}>
            <Display if={imgs}><img src={imgMix} /></Display>
          </div>

          <div className="a-wrapper" ref={function (el) {that.cRefs.aWrapper = el}}>
            <div className="imgs-wrapper" style={wrapperStyle}>
              <div className="img-wrapper img-wrapper-question" ref={function (el) {that.cRefs.imgA = el}}>
                <Display if={imgs}><img src={imgAMix} /></Display>
              </div>
              <div className="img-wrapper img-wrapper-answer" ref={function (el) {that.cRefs.imgAMix = el}}>
                <Display if={imgs}><img src={imgA} /></Display>
              </div>
            </div>
          </div>

          <div className="b-wrapper" ref={function (el) {that.cRefs.bWrapper = el}}>
            <div className="imgs-wrapper" style={wrapperStyle}>
              <div className="img-wrapper img-wrapper-question" ref={function (el) {that.cRefs.imgB = el}}>
                <Display if={imgs}><img src={imgBMix} /></Display>
              </div>
              <div className="img-wrapper img-wrapper-answer" ref={function (el) {that.cRefs.imgBMix = el}}>
                <Display if={imgs}><img src={imgB} /></Display>
              </div>
            </div>
          </div>
        </div>

        <nav className="navigation-wrapper">
          <button onClick={this.showQuestion}>Question</button>
          <button onClick={this.showAnswer}>Answer</button>
        </nav>
      </div>
    );
  }
}));

module.exports = QuestionDisplay;