var React = require('react');
var debounce = require('debounce');
var Display = require('./helpers/Display.react');
var _ = require('underscore');
var GSAP = require('react-gsap-enhancer').default;
var $ = require('../vendor/jquery-1.11.3.min');

var TimelineMax = require('../vendor/greensock-js/src/uncompressed/TimelineMax');
var TweenLite = require('../vendor/greensock-js/src/uncompressed/TweenLite');
var CSSPlugin = require('../vendor/greensock-js/src/uncompressed/plugins/CSSPlugin');
require('../vendor/greensock-js/src/uncompressed/easing/EasePack');

var QuestionDisplay = GSAP()(React.createClass({

  cRefs: {},

  getInitialState: function () {
    return {
      imgs: null,
      questionWrapperStyle: {}
    }
  },

  componentWillMount: function () {
    
    // this.manageQuestionStateChange(null, this.props.questionState);
    // window.tl = tl;

  },

  componentWillUpdate: function (nextProps, nextState) {
    
  },

  manageQuestionStateChange: function (newQuestionState) {
    // console.log(newQuestionState);

    // No animation required if target is false.
    if (newQuestionState.target === false) return;

    // If target is already current then return here.
    if (newQuestionState.target === newQuestionState.current) return;

    var that = this;

    // console.log('change target to: ', newQuestionState.target);

    // We need to trigger animations here.

    var animationCompleteCallback = function (animation) {

      if (animation === 'end') {
        that.playAnimation('reset');

        that.props.emit('questionStateCallback', false);
        that.props.emit('questionState', false);
        that.props.emit('retryTransition');
      }
      else {
        if (animation === 'ready' ||
          animation === 'question' ||
          animation === 'answer') {
          that.props.emit('questionStateCallback', animation);
        }
      }
    };

    if (newQuestionState.target === 'ready') {
      this.playAnimation('ready', animationCompleteCallback);
    }
    if (newQuestionState.target === 'answer') {
      this.playAnimation('answer', animationCompleteCallback);
    }
    if (newQuestionState.target === 'question') {
      this.playAnimation('question', animationCompleteCallback);
    }
    if (newQuestionState.target === 'end') {
      this.playAnimation('end', animationCompleteCallback);
    }
    if (newQuestionState.target === 'reset') {
      this.playAnimation('reset', animationCompleteCallback);
    }
  },

  updateQuestionState: function (nextState) {

  },

  handleResize: function(e) {
    this.calculateBestImgs();
    this.updateWrapperWidth();
  },

  debouncedResize: null,

  animations: {},

  currentAnimation: null,

  playAnimation: function (animation, callback) {

    var callback = callback || function () {};

    if (this.currentAnimation) {
      this.currentAnimation.pause();
    }

    this.currentAnimation = this.addAnimation(this.returnAnimation(animation, callback));
    this.currentAnimation.play();
  },

  stopAllAnimations: function () {
    if (this.currentAnimation) {
      this.currentAnimation.pause();
    }
  },

  returnAnimationSteps: function (animation, tl) {
    
    var layout = this.props.layout;
    var animationTime = 0.75;
    var refs = this.cRefs;

    if (animation === 'ready') {
      var animationSettings = {};
      animationSettings.abWrapperPos = 0;
      animationSettings.aPos = 0;
      animationSettings.bPos = 0;
      animationSettings.questionOpacity = 0;
      animationSettings.mobileQuestionOpacity = 0;
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
      if (layout === 'mobile') animationSettings.questionOpacity = 0;
      else animationSettings.questionOpacity = 1;
      animationSettings.mobileQuestionOpacity = 1;
      animationSettings.answerOpacity = 0;
      animationSettings.fadeOn = 'start';
      animationSettings.fadeTime = animationTime;
      animationSettings.animationTime = animationTime;
    }
    if (animation === 'answer') {
      var animationSettings = {};
      animationSettings.abWrapperPos = 0;
      if (layout === 'mobile') {
        animationSettings.aPos = 0;
        animationSettings.bPos = 0;
        animationSettings.fadeOn = 'start';
        animationSettings.questionOpacity = 0;
      }
      else {
        animationSettings.aPos = -50;
        animationSettings.bPos = 50;
        animationSettings.fadeOn = 'reveal';
        animationSettings.questionOpacity = 1;
      }
      animationSettings.mobileQuestionOpacity = 1;
      animationSettings.answerOpacity = 1;
      animationSettings.fadeTime = animationTime * 2;
      animationSettings.animationTime = animationTime;
    }
    if (animation === 'end') {
      var animationSettings = {};
      animationSettings.abWrapperPos = 150;
      animationSettings.aPos = 0;
      animationSettings.bPos = 0;
      animationSettings.questionOpacity = 0;
      animationSettings.mobileQuestionOpacity = 0;
      animationSettings.answerOpacity = 1;
      if (layout === 'mobile') animationSettings.fadeOn = 'start';
      else animationSettings.fadeOn = 'reveal';
      animationSettings.fadeTime = 0;
      animationSettings.animationTime = animationTime;
    }

    if (!animationSettings) {
      if (animation === 'reset') {
        tl.set(refs.abWrapper, {clearProps:"all"})
          .set(refs.aWrapper, {clearProps:"all"})
          .set(refs.bWrapper, {clearProps:"all"})
          .set(refs.imgA, {clearProps:"all"})
          .set(refs.imgB, {clearProps:"all"})
          .set(refs.imgAMix, {clearProps:"all"})
          .set(refs.imgBMix, {clearProps:"all"})
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
      }, 'start')

    tl.add('reveal');

    if (refs.imgMix && refs.imgMix.clientWidth) {
      tl.set(refs.imgMix, {
          opacity: $(refs.imgMix).css('opacity')
        }, 'start')
        .to(refs.imgMix, animationSettings.fadeTime, {
          opacity: animationSettings.mobileQuestionOpacity,
          ease: Power2.easeInOut
        }, animationSettings.fadeOn);
    }

    tl.set(refs.imgA, {
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

    var that = this;
    var endCallback = endCallback || function () {};

    var callback = function () {
      endCallback(animation);
    };

    return function () {

      var tl = new TimelineMax({
        paused: true,
        onComplete: callback,
        overwrite: true
      });

      var refs = that.cRefs;

      tl = that.returnAnimationSteps(animation, tl);

      return tl;
    }
  },

  setupAnimations: function () {
    
  },

  componentDidMount: function() {
    this.updateWrapperWidth();
    this.debouncedResize = debounce(this.handleResize, 200);
    window.addEventListener('resize', this.debouncedResize);
  },

  componentWillReceiveProps: function (nextProps) {
    // console.log('componentWillReceiveProps', nextProps, this.props);
    this.calculateBestImgs(nextProps.question);
    this.manageQuestionStateChange(nextProps.questionState);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.debouncedResize);

    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }
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

    if (!el) return '';
    if (!el.clientWidth) return '';

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
    // this.props.emit('questionState', 'reset');

    this.playAnimation('reset');
  },

  updateWrapperWidth: function () {
    var question = this.props.question;
    var questionWrapperStyle = this.returnWrapperStyles(question.imgs.mix.aspectRatio);
    
    if (questionWrapperStyle) {
      this.setState({
        questionWrapperStyle: questionWrapperStyle
      });
    }
    else {
      this.setState({
        questionWrapperStyle: {}
      });
    }
  },

  returnWrapperStyles: function (imgAspect) {

    if (this.props.layout !== 'desktop') return null;

    var that = this;

    // imgAspect is the percentage that the height of the image is of the width.
    // For example, an image that is 1h x 2w is half as tall as it is wide,
    // therefore the imgAspect would be 0.5.

    // When calculating the width we need to take into account the padding.

    // We need to calculate the width of the wrapper based on the aspect ratio
    // of the images.
    // We want the images to take up no more than 100% the height minus the
    // header and button areas.

    var $wrapper = $(that.cRefs.questionWrapper);
    var availableWidth = $wrapper.parent().outerWidth();

    // We need the aspect for two images side by side, so half the imgAspect.
    var imgAspect = imgAspect / 2;

    var headerAreaHeight = $wrapper.offset().top;
    var buttonAreaHeight = 100; // [placeholder]
    var heightCompensation = 00;

    var windowHeight = $(window).outerHeight();

    var availableHeight = windowHeight - 
                            headerAreaHeight -
                            buttonAreaHeight -
                            heightCompensation;

    var widthToAchieveHeightAtAspect = availableHeight / imgAspect;

    var questionStateWidth = Math.floor((widthToAchieveHeightAtAspect / availableWidth) * 100);
    if (questionStateWidth > 100) questionStateWidth = 100;
    var questionStateMarginLeft = (100 - questionStateWidth) / 2;

    return {
      width: questionStateWidth + '%',
      marginLeft: questionStateMarginLeft + '%'
    }
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

    var wrapperStyle = {paddingBottom: (question.imgs.mix.aspectRatio * 100) + '%'};

    if (this.props.layout !== 'mobile') {
      this.cRefs.imgMix = null;
    }

    return (
      <div>
        <div className="title-wrapper">
          <h2>Question {question.humanId}</h2>
        </div>
        <div className={"question-wrapper question-state-" + this.props.questionState.current} ref={function (el) {that.cRefs.questionWrapper = el}} style={this.state.questionWrapperStyle}>

          <div className="a-b-wrapper" ref={function (el) {that.cRefs.abWrapper = el}}>
            <Display className="mobile-question-only-wrapper-outer" if={this.props.layout === 'mobile'}>
              <div className="mobile-question-only-wrapper" style={wrapperStyle} ref={function (el) {that.cRefs.imgMix = el}}>
                <Display if={imgs}><img src={imgMix} /></Display>
              </div>
            </Display>

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
        </div>

        <nav className="navigation-wrapper">
          <Display 
            className="button-wrapper"
            if={this.props.questionState.target === 'ready' ||
                this.props.questionState.target === 'answer'}>
            <button onClick={this.showQuestion}>Question</button>
          </Display>
          
          <Display 
            className="button-wrapper"
            if={this.props.questionState.target === 'question'}>
            <button onClick={this.showAnswer}>Answer</button>
          </Display>          
        </nav>
      </div>
    );
  }
}));

module.exports = QuestionDisplay;