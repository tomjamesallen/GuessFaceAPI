var gulp = require('gulp');
var Q = require('q');
var extend = require("extend");

var defaults = {
  imageOutputDir : "dist/api/imgs",
  imgSizes: [320, 640, 960, 1280, 1920]
};

var config = extend({}, defaults, require('../build-api-config.json'));

/**
 * Top level function for building API.
 * 
 * Generates JSON API and image variants.
 */
var buildApiMaster = function () {
  var questionsData = require('../src/questions/index.json');
  var roundPromises = [];
  questionsData.forEach(function (roundData, i) {
    roundPromises.push(processRound(roundData, i));
  });

  roundPromises.allSettled(function () {
    var apiData = {
      rounds: questionsData
    };

    saveJsonApi(apiData);
  });  
};

var processRound = function (roundData, i) {
  roundData.roundId = i;
  roundData.questionsData = [];

  var questionId = 0;

  roundData.questions.forEach(function (questionDir, i) {
    var questionData;
    if (questionData = getQuestionData(questionDir)) {
      questionData.questionId = questionId ++;
      createQuestionsImages(questionDir, questionData, roundData).then(function (response) {
        
      });
      roundData.questionsData.push(questionData);
    }
  });
  delete roundData.questions;
};

var getQuestionData = function (questionDir) {
  var questionData = null;
  try {
    questionData = require('../src/questions/' + questionDir + '/index.json');
  }
  catch (e) {
    // console.log(e);
  }
  return questionData;
};

var createQuestionsImages = function (questionDir, questionData, roundData) {
  // Check for and then create variants for each of the three images: a, b, mix.
  // Any of the images could be JPGs or PNGs so exclude the extension from the
  // imgPath.
  var distDir = 'round' + roundData.roundId + '-question' + questionData.questionId;
  distDir = '../' + config.imageOutputDir + '/' + distDir;
  var questionImgDir = './src/questions/' + questionDir;
  
  var promises = [];
  questionData.imgs = {};
  ['a', 'b', 'mix'].forEach(function (imgName) {
    var path = questionImgDir + '/' + imgName;
    promises.push(createImageVariants(path, distDir).then(function (metadata) {
      questionData.imgs[imgName] = metadata;
    }));
  });

  return Q.allSettled(promises);
};


var createImageVariants = function (imgPath, distDir) {
  var imageProcessComplete = Q.defer();

  // Dependencies.
  var im = require('imagemagick');
  var fs = require('fs');

  // We need to identify the source image by checking for both PNG and JPG and
  // then creating all of the image variants.
  // 
  // Create promises.
  var foundImg = {
    png: Q.defer(),
    jpg: Q.defer()
  };

  // Create placeholder var for metadata.
  var imgFileData = {

  };

  // Repeat for both PNG and JPG.
  ['png', 'jpg'].forEach(function (imgType) {
    try {
      var imgFilePath = imgPath + '.' + imgType;
      im.identify(imgFilePath, function(err, metadata){
        if (typeof metadata !== 'undefined') {
          foundImg[imgType].resolve(metadata);
          imgFileData.metadata = metadata;
          imgFileData.path = imgFilePath;
        }
        else {
          foundImg[imgType].reject(new Error('No metadata'));
        }
      });
    }
    catch (e) {
      foundImg[imgType].reject(new Error(e));
    }
  });

  Q.allSettled([foundImg['png'].promise, foundImg['jpg'].promise]).then(function () {
    // console.log('png and jpg returned', imgFileData);

    config.imgSize.forEach(function (size) {

    });

    imageProcessComplete.resolve({'all img data' : 'ahaha'});
  });

  return imageProcessComplete.promise;
};

var createImageVariant = function (srcImg, distDir, size) {
  // im.resize({
  //   srcData: fs.readFileSync('kittens.jpg', 'binary'),
  //   width:   256
  // }, function(err, stdout, stderr){
  //   if (err) throw err
  //   fs.writeFileSync('kittens-resized.jpg', stdout, 'binary');
  //   console.log('resized kittens.jpg to fit within 256x256px')
  // });
};

var saveJsonApi = function (data) {
  var jsonfile = require('jsonfile');
  var file = './dist/api/index.json';
  jsonfile.writeFileSync(file, data, {spaces: 2});
};

module.exports = buildApiMaster;
