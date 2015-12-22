var React = require('react');
var debounce = require('debounce');
var Display = require('./Display');
var _ = require('underscore');
var GSAP = require('react-gsap-enhancer').default;
var $ = require('../../vendor/jquery-1.11.3.min');

var TimelineLite = require('../../vendor/greensock-js/src/uncompressed/TimelineLite');
var TweenLite = require('../../vendor/greensock-js/src/uncompressed/TweenLite');
var CSSPlugin = require('../../vendor/greensock-js/src/uncompressed/plugins/CSSPlugin');
require('../../vendor/greensock-js/src/uncompressed/easing/EasePack');

var QuestionDisplay = GSAP()(React.createClass({

  cRefs: {},

  getInitialState: function () {
    return {
      imgs: null,
      // questionState: 'start' // start/question/answer
    }
  },

  componentWillMount: function () {
    
    // this.manageQuestionStateChange(null, this.props.questionState);
    // window.tl = tl;

  },

  componentWillUpdate: function (nextProps, nextState) {
    
  },

  manageQuestionStateChange: function (newQuestionState) {
    console.log(newQuestionState);

    // No animation required if target is false.
    if (newQuestionState.target === false) return;

    // If target is already current then return here.
    if (newQuestionState.target === newQuestionState.current) return;

    var that = this;

    console.log('change target to: ', newQuestionState.target);

    // We need to trigger animations here.

    if (newQuestionState.target === 'ready') {
      this.playAnimation('ready');
    }
    if (newQuestionState.target === 'answer') {
      this.playAnimation('answer');
    }
    if (newQuestionState.target === 'question') {
      this.playAnimation('question');
    }
    if (newQuestionState.target === 'end') {
      this.playAnimation('end');
    }
    if (newQuestionState.target === 'reset') {
      this.playAnimation('reset');
    }

    // setTimeout(function () {
    //   if (newQuestionState.target === 'end') {
    //     console.log('intended end');
    //     that.props.emit('questionStateCallback', false);
    //     that.props.emit('questionState', false);
    //     that.props.emit('retryTransition');
    //   }
    //   else {
    //     if (newQuestionState.target === 'ready' ||
    //       newQuestionState.target === 'question' ||
    //       newQuestionState.target === 'answer') {
    //       console.log('emit update to:', newQuestionState.target);
    //       that.props.emit('questionStateCallback', newQuestionState.target);
    //     }
    //   }
      
    // }, 1000);
  },

  updateQuestionState: function (nextState) {

  },

  handleResize: function(e) {
    this.calculateBestImgs();
  },

  debouncedResize: null,

  animations: {},

  currentAnimation: null,

  playAnimation: function (animation) {
    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }

    this.currentAnimation = this.returnAnimation(animation);
    this.currentAnimation.play();
  },

  stopAllAnimations: function () {
    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }
  },

  returnAnimationSteps: function (animation, tl) {

    var animationTime = 0.75;

    var refs = this.cRefs;

    if (animation === 'ready') {
      var animationSettings = {};
      animationSettings.abWrapperPos = 0;
      animationSettings.aPos = 0;
      animationSettings.bPos = 0;
      animationSettings.questionOpacity = 0.3;
      animationSettings.answerOpacity = 0;
      animationSettings.fadeOn = 'start';
      animationSettings.fadeTime = animationTime;
      animationSettings.animationTime = animationTime;
    }
    if (animation === 'question') {
      var animationSettings = {};
      animationSettings.abWrapperPos = 0;
      animationSettings.aPos = 0;
      animationSettings.bPos = 0;
      animationSettings.questionOpacity = 1;
      animationSettings.answerOpacity = 0;
      animationSettings.fadeOn = 'start';
      animationSettings.fadeTime = animationTime;
      animationSettings.animationTime = animationTime;
    }
    if (animation === 'answer') {
      var animationSettings = {};
      animationSettings.abWrapperPos = 0;
      animationSettings.aPos = -50;
      animationSettings.bPos = 50;
      animationSettings.questionOpacity = 1;
      animationSettings.answerOpacity = 1;
      animationSettings.fadeOn = 'reveal';
      animationSettings.fadeTime = animationTime * 2;
      animationSettings.animationTime = animationTime;
    }
    if (animation === 'end') {
      var animationSettings = {};
      animationSettings.abWrapperPos = 100;
      animationSettings.aPos = 0;
      animationSettings.bPos = 0;
      animationSettings.questionOpacity = 0.3;
      animationSettings.answerOpacity = 1;
      animationSettings.fadeOn = 'reveal';
      animationSettings.fadeTime = 0;
      animationSettings.animationTime = animationTime;
    }

    if (!animationSettings) {

      if (animation === 'reset') {
        tl.set(refs.abWrapper, {transform: null})
          .set(refs.aWrapper, {transform: null})
          .set(refs.bWrapper, {transform: null})
          .set(refs.imgA, {opacity: null})
          .set(refs.imgB, {opacity: null})
          .set(refs.imgAMix, {opacity: null})
          .set(refs.imgBMix, {opacity: null})
      }
      return tl;
    }

    tl.add('start')
      
      .set(refs.abWrapper, {
        transform: $(refs.abWrapper).css('transform'),
      }, 'start')
      .to(refs.abWrapper, animationSettings.animationTime, {
        x: animationSettings.abWrapperPos + '%',
        ease: Power2.easeInOut
      }, 'start')

      .set(refs.aWrapper, {
        transform: $(refs.aWrapper).css('transform'),
      }, 'start')
      .to(refs.aWrapper, animationSettings.animationTime, {
        x: animationSettings.aPos + '%',
        ease: Power2.easeInOut
      }, 'start')
      
      .set(refs.bWrapper, {
        transform: $(refs.bWrapper).css('transform'),
      }, 'start')
      .to(refs.bWrapper, animationSettings.animationTime, {
        x: animationSettings.bPos + '%',
        ease: Power2.easeInOut
      }, 'start');

      .add('reveal')

      .set(refs.imgA, {
        opacity: $(refs.imgA).css('opacity')
      }, 'start')
      .to(refs.imgA, animationSettings.fadeTime, {
        opacity: animationSettings.questionOpacity,
        ease: Power2.easeInOut
      }, animationSettings.fadeOn)

      .set(refs.imgB, {
        opacity: $(refs.imgB).css('opacity')
      }, 'start')
      .to(refs.imgB, animationSettings.fadeTime, {
        opacity: animationSettings.questionOpacity,
        ease: Power2.easeInOut
      }, animationSettings.fadeOn)
      
      .set(refs.imgAMix, {
        opacity: $(refs.imgAMix).css('opacity')
      }, 'start')
      .to(refs.imgAMix, animationSettings.fadeTime, {
        opacity: animationSettings.answerOpacity,
        ease: Power2.easeInOut
      }, animationSettings.fadeOn)

      .set(refs.imgBMix, {
        opacity: $(refs.imgBMix).css('opacity')
      }, 'start')
      .to(refs.imgBMix, animationSettings.fadeTime, {
        opacity: animationSettings.answerOpacity,
        ease: Power2.easeInOut
      }, animationSettings.fadeOn);

    return tl;
  },

  returnAnimation: function (animation, endCallback) {
    console.log('return animation', animation);
    var endCallback = endCallback || function () {};
    var tl = new TimelineLite({
      paused: true,
      onComplete: endCallback,
      overwrite: true
    });

    var refs = this.cRefs;

    tl = this.returnAnimationSteps(animation, tl);

    return tl;
  },

  setupAnimations: function () {
    
  },

  componentDidMount: function() {
    // console.log(this);
    this.debouncedResize = debounce(this.handleResize, 200);
    window.addEventListener('resize', this.debouncedResize);

    // this.setupAnimations();
  },

  componentWillReceiveProps: function (nextProps) {
    // console.log('componentWillReceiveProps', nextProps, this.props);
    this.calculateBestImgs(nextProps.question);
    this.manageQuestionStateChange(nextProps.questionState);
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
    this.props.emit('questionState', 'question');
  },

  showAnswer: function () {
    this.props.emit('questionState', 'answer');
  },

  resetToReady: function () {
    this.props.emit('questionState', 'ready');
  },

  endQuestion: function () {
    this.props.emit('questionState', 'end');
  },

  resetQuestion: function () {
    this.props.emit('questionState', 'reset');
  },

  render: function () {
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
      <div className={"question-wrapper question-state-"}>
        <div className="title-wrapper">
          <h2>Question {question.humanId}</h2>
        </div>

        <div className="a-b-wrapper" ref={function (el) {that.cRefs.abWrapper = el}}>
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
          <button onClick={this.resetToReady}>Ready</button>
          <button onClick={this.showQuestion}>Question</button>
          <button onClick={this.showAnswer}>Answer</button>
          <button onClick={this.stopAllAnimations}>stopAllAnimations</button>
          <button onClick={this.endQuestion}>endQuestion</button>
          <button onClick={this.resetQuestion}>resetQuestion</button>
        </nav>
      </div>
    );
  }
}));

module.exports = QuestionDisplay;