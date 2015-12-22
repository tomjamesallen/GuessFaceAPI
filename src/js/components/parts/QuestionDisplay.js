var React = require('react');
var debounce = require('debounce');
var Display = require('./Display');
var _ = require('underscore');
var GSAP = require('react-gsap-enhancer').default;
var $ = require('../../vendor/jquery-1.11.3.min');

var TimelineLite = require('../../vendor/greensock-js/src/uncompressed/TimelineLite');
var TweenLite = require('../../vendor/greensock-js/src/uncompressed/TweenLite');
var CSSPlugin = require('../../vendor/greensock-js/src/uncompressed/plugins/CSSPlugin');

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
    // console.log(nextState.questionState);
    // console.log(this.refs);
    // console.log(this.state.tl);

    

    // this.state.tl.play();
  },

  handleResize: function(e) {
    this.calculateBestImgs();
  },

  debouncedResize: null,

  animations: {},

  currentAnimation: null,

  playAnimation: function (animation) {
    // _.forEach(this.animations, function (thisAnimation, key) {
    //   thisAnimation.pause();
    // });
    // if (this.animations[animation]) {
    //   console.log('play', animation);
    //   this.animations[animation].restart();
    // }
    // if (animation === 'ready') {
    //   this.animations.ready.play();
    // }

    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }

    this.currentAnimation = this.returnAnimation(animation);
    this.currentAnimation.play();
  },

  stopAllAnimations: function () {
    // _.forEach(this.animations, function (thisAnimation, key) {
    //   thisAnimation.pause();
    // });

    if (this.currentAnimation) {
      this.currentAnimation.kill();
      this.currentAnimation = null;
    }
  },

  returnAnimationSteps: function (animation, tl) {

    // return tl;

    var animationSettings = {};
    var refs = this.cRefs;

    if (animation === 'ready') {
      animationSettings.abWrapperPos = 0;
      animationSettings.aPos = 0;
      animationSettings.bPos = 0;
      animationSettings.questionOpacity = 0.3;
      animationSettings.answerOpacity = 0;
    }
    if (animation === 'question') {
      animationSettings.abWrapperPos = 0;
      animationSettings.aPos = 0;
      animationSettings.bPos = 0;
      animationSettings.questionOpacity = 1;
      animationSettings.answerOpacity = 0;
    }
    if (animation === 'answer') {
      animationSettings.abWrapperPos = 0;
      animationSettings.aPos = -50;
      animationSettings.bPos = 50;
      animationSettings.questionOpacity = 1;
      animationSettings.answerOpacity = 1;
    }
    if (animation === 'end') {
      animationSettings.abWrapperPos = 100;
      animationSettings.aPos = -50;
      animationSettings.bPos = 50;
      animationSettings.questionOpacity = 0.3;
      animationSettings.answerOpacity = 1;
    }

    console.log('animationSettings', animationSettings);

    tl
      .add('start')
      
      // .set(refs.abWrapper, {
      //   transform: $(refs.abWrapper).css('transform')
      // }, 'start')
      .to(refs.abWrapper, 1, {
        transform: 'translateX(' + animationSettings.abWrapperPos + '%)',
      }, 'start')

      // .set(refs.aWrapper, {
      //   transform: $(refs.aWrapper).css('transform')
      // }, 'start')
      .from(refs.aWrapper, 1, {
        transform: 'translateX(' + animationSettings.aPos + '%)',
        // xPercent: animationSettings.aPos,
      }, 'start')
      
      // .set(refs.bWrapper, {
      //   transform: $(refs.bWrapper).css('transform')
      // }, 'start')
      .from(refs.bWrapper, 1, {
        transform: 'translateX(' + animationSettings.bPos + '%)',
        // xPercent: animationSettings.bPos,
      }, 'start')
      
      // .set(refs.imgAMix, {
      //   transform: $(refs.imgAMix).css('opacity')
      // }, 'start')
      // .to(refs.imgAMix, 1, {
      //   autoAlpha: 0,
      // }, 'start')

      // .set(refs.imgBMix, {
      //   transform: $(refs.imgBMix).css('opacity')
      // }, 'start')
      // .to(refs.imgBMix, 1, {
      //   autoAlpha: 0,
      // }, 'start');

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
    console.log(tl);

    // tl
    //   .add('start')
      
    //   .set(refs.abWrapper, {
    //     transform: $(refs.abWrapper).css('transform')
    //   }, 'start')
    //   .to(refs.abWrapper, 1, {
    //     transform: 'translateX(0%)',
    //   }, 'start')

    //   .set(refs.aWrapper, {
    //     transform: $(refs.aWrapper).css('transform')
    //   }, 'start')
    //   .to(refs.aWrapper, 1, {
    //     // transform: 'translateX(50%)',
    //     xPercent: 50
    //   }, 'start')
      
    //   .set(refs.bWrapper, {
    //     transform: $(refs.bWrapper).css('transform')
    //   }, 'start')
    //   .to(refs.bWrapper, 1, {
    //     // transform: 'translateX(50%)',
    //     xPercent: 50
    //   }, 'start')

    return tl;
  },

  setupAnimations: function () {
    // var refs = this.cRefs;

    // console.log('setup aimations', refs, this);

    // var animationEndCallback = function () {
    //   console.log('arguments', arguments);
    // };

    // this.animations.ready = this.addAnimation(function () {
    //   return new TimelineLite({
    //     paused: true,
    //     onComplete: animationEndCallback
    //   })
    //   .to(refs.abWrapper, 1, {
    //     xPercent: 100,
    //   });
    // });

    // this.animations.question = this.addAnimation(function () {
    //   return new TimelineLite({
    //     paused: true,
    //     onComplete: animationEndCallback
    //   })
    //   .add('start')
    //   .to(refs.abWrapper, 1, {
    //     xPercent: 100,
    //   }, 'start')
    //   .to(refs.aWrapper, 1, {
    //     xPercent: 0,
    //   }, 'start')
    //   .to(refs.bWrapper, 1, {
    //     xPercent: 0,
    //   }, 'start')
    //   .to(refs.imgAMix, 1, {
    //     opacity: 0,
    //   }, 'start')
    //   .to(refs.imgBMix, 1, {
    //     opacity: 0,
    //   }, 'start');
    // });

    // this.animations.answer = this.addAnimation(function () {
    //   return new TimelineLite({
    //     paused: true,
    //     onComplete: animationEndCallback
    //   })
    //   .add('start')
    //   .to(refs.abWrapper, 1, {
    //     xPercent: 100,
    //   }, 'start')
    //   .to(refs.aWrapper, 1, {
    //     xPercent: -50,
    //   }, 'start')
    //   .to(refs.bWrapper, 1, {
    //     xPercent: 50,
    //   }, 'start')
    //   .add('reveal')
    //   .to(refs.imgAMix, 1, {
    //     opacity: 1,
    //   }, 'reveal')
    //   .to(refs.imgBMix, 1, {
    //     opacity: 1,
    //   }, 'reveal');
    // });
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
        </nav>
      </div>
    );
  }
}));

module.exports = QuestionDisplay;