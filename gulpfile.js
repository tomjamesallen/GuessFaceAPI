var gulp = require('gulp');

var q = require('q');

// Gulp needs to perform the following tasks.
// * Create image variants
// * Output JSON API with image data and answers.
// * Compile front end assets - JS / CSS (requires watch)
// * Set up live reload
// 
// Directory structure is as follows:
// - src/
//    - questions/
//      - question-name/
//        - a.jpg
//        - b.jpg
//        - mix.jpg
//        - index.json
//    - scss/
//    - js/
// - dist/
//    - index.html
//    - api/
//      - index.json
//      - imgs/
//        - 1280/
//          - question-name.1280.jpg
//          - question-name-2.1280.jpg
//    - css/
//    - js/
//    - imgs/
//      - logo.png
// 
// We need to look at the rounds meta data for the order of the questions and
// then looks in the questions directory for the matching folder name. We then
// load up the meta data from the question and check for the neccessary images.
// Images variant can then be created and placed in the dist/api directory. The
// image paths are saved and added to the data to be saved to api/index.json.

gulp.task('default', function () {
  console.log('running');
});

gulp.task('build-api', function () {
  buildApiMaster();
});

var questionsData = {};

var buildApiMaster = function () {
  var questionsData = require('./src/questions/index.json');
  questionsData.forEach(function (roundData, i) {
    processRound(roundData, i);
  });

  // console.log(questionsData);

  var apiData = {
    rounds: questionsData
  };

  saveJsonApi(apiData);
};

var saveJsonApi = function (data) {
  var jsonfile = require('jsonfile');
  var file = './dist/api/index.json';
  jsonfile.writeFileSync(file, data, {spaces: 2});
};

var processRound = function (roundData, i) {
  roundData.roundId = i;
  roundData.questionsData = [];

  var questionId = 0;

  roundData.questions.forEach(function (questionDir, i) {
    var questionData;
    if (questionData = getQuestionData(questionDir)) {
      questionData.questionId = questionId ++;
      createQuestionsImages(questionDir, questionData, roundData);
      roundData.questionsData.push(questionData);
    }
  });
  delete roundData.questions;
};

var getQuestionData = function (questionDir) {
  var questionData = null;
  try {
    questionData = require('./src/questions/' + questionDir + '/index.json');
  }
  catch (e) {
    console.log(e);
  }
  return questionData;
};

var createQuestionsImages = function (questionDir, questionData, roundData) {
  // Check for and then create variants for each of the three images: a, b, mix.
  // Any of the images could be JPGs or PNGs so exclude the extension from the
  // imgPath.
  var distDir = 'round' + roundData.roundId + '-question' + questionData.questionId;
  distDir = './dist/api/imgs/' + distDir;
  var questionDir = './src/questions/' + questionDir;
  ['a', 'b', 'mix'].forEach(function (imgName) {
    var path = questionDir + '/' + imgName;
    var imgData = createImageVariants(path, distDir);
  });

  // console.log(questionDir, questionData, roundData);
  // var aPath = 
  // var a = createImageVariants(aPath);
};


var createImageVariants = function (imgPath, distDir) {
  // Dependencies.
  var im = require('imagemagick');
  var fs = require('fs');

  console.log(imgPath, distDir);

  // We need to check for the both JPG and PNGs that match the file path.
  try {
    im.identify(imgPath + '.png', function(err, metadata){
      console.log('metadata', metadata);
      if (typeof metadata !== 'undefined') {

      }
    });
  }
  catch (e) {
    console.log(e);
  }
  
  
  // im.resize({
  //   srcData: fs.readFileSync('kittens.jpg', 'binary'),
  //   width:   256
  // }, function(err, stdout, stderr){
  //   if (err) throw err
  //   fs.writeFileSync('kittens-resized.jpg', stdout, 'binary');
  //   console.log('resized kittens.jpg to fit within 256x256px')
  // });

  // console.log('after error');
};







