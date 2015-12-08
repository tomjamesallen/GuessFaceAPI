var gulp = require('gulp');
var Q = require('q');
var extend = require('extend');

var im = require('imagemagick');
var fs = require('fs');

var defaults = {
  imageOutputDir : "dist/api/imgs",
  imgSizes: [320, 640, 960],
  imgFormat: 'jpg'
};

var config = extend({}, defaults, require('../build-api-config.json'));

// Helper (move to another file)
var path = require('path');
fs.mkdirParent = function(dirPath, mode, callback) {

  if (typeof mode === 'function') {
    callback = mode;
    mode = undefined;
  }

  //Call the standard fs.mkdir
  fs.mkdir(dirPath, mode, function(error) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === -2) {
      //Create all the parents recursively
      fs.mkdirParent(path.dirname(dirPath), mode, callback);
      //And then the directory
      fs.mkdirParent(dirPath, mode, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    callback && callback(error);
  });
};

// Another helper.
var fs = require('fs');
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

/**
 * Top level function for building API.
 * 
 * Generates JSON API and image variants.
 */
var buildApiMaster = function () {
  // Require master question data file from src.
  var questionsData = require('../src/questions/index.json');

  var apiData = {
    rounds: {}
  };
  
  // Create empty array to store promises for round data.
  var roundPromises = [];

  // Delete previous imgs folder.
  deleteFolderRecursive('./' + config.imageOutputDir, 'force');

  // Cycle over rounds in questionsData.
  questionsData.forEach(function (roundData, i) {
    // Add the promise returned from processRound to the roundPromises array.
    roundPromises.push(processRound(roundData, i));

    // Save round data to rounds object, keyed by roundId.
    apiData.rounds[roundData.roundId] = roundData;
  });

  // Wait for all roundPromises to be settled, then save API data to output
  // JSON file.
  Q.allSettled(roundPromises).then(function () {
    console.log('saving JSON');
    saveJsonApi(apiData);
  });  
};

/**
 * Process the data for a round.
 * 
 * Returns a promise.
 * @return promise
 */
var processRound = function (roundData, i) {
  // Create empty array for question promises.
  var questionPromises = [];

  // Add the roundId to the roundData.
  roundData.roundId = i;

  // Create an empty array for the questionsData.
  roundData.questionsData = {};

  // Set initial questionId.
  var questionId = 0;

  // Cycle over questions in round.
  roundData.questions.forEach(function (questionDir, i) {

    // Declare questionData var here.
    var questionData;

    // Check for and set question data.
    if (questionData = getQuestionData(questionDir)) {

      // Set questionId property on questionData.
      questionData.questionId = questionId ++;

      // Save round data to question.
      questionData.roundData = {
        roundId: roundData.roundId,
        title: roundData.title
      };

      // Push question data to questionsData arrday on roundData.
      roundData.questionsData[questionData.questionId] = questionData;

      // Request and save promise for question images.
      questionPromises.push(createQuestionsImages(questionDir, questionData, roundData));
    }
  });

  // Delete initial questions data as this should not be output.
  delete roundData.questions;
  
  // Return the allSettled promise.
  return Q.allSettled(questionPromises);
};

/**
 * Get inidividual question data.
 *
 * Returns object or null.
 * @return object
 */
var getQuestionData = function (questionDir) {
  // Set initial questionData var.
  var questionData = null;
  
  // Try a require and console.log any error.
  try {
    questionData = require('../src/questions/' + questionDir + '/index.json');
  }
  catch (e) {
    console.log(new Error(e));
  }
  return questionData;
};

/**
 * Create the images for a given question.
 * 
 * Returns a promise.
 * @return promise
 */
var createQuestionsImages = function (questionDir, questionData, roundData) {

  // Check for and then create variants for each of the three images: a, b, mix.
  // Any of the images could be JPGs or PNGs so exclude the extension from the
  // imgPath.

  // The directory to save output images to.
  var distDir = './' + config.imageOutputDir;

  // Prepend src/questions path to the questionDir.
  var questionImgDir = './src/questions/' + questionDir;
  
  // Create empty array for imgPromises.
  var imgPromises = [];
  
  // Create empty object for imgs question data.
  questionData.imgs = {};

  var imgKeys = ['a', 'b', 'mix'];

  var tempImgsData = {};

  // Repeat process for a, b and mix images.
  imgKeys.forEach(function (imgName) {

    // Create the image path.
    var path = questionImgDir + '/' + imgName;

    // Create an imgReady promise.
    var imgReady = Q.defer();

    // Push the promise to the imgPromises array.
    imgPromises.push(imgReady.promise);

    // Call function to create image variants. When it returns save imgsData to
    // questionData.
    createImageVariants(path, distDir, imgName, roundData, questionData).then(function (imageVariantsData) {
      tempImgsData[imgName] = imageVariantsData;
      imgReady.resolve(questionData);
    })
  });

  Q.allSettled(imgPromises).then(function () {
    imgKeys.forEach(function (imgName) {
      if (!tempImgsData[imgName]) return;
      questionData.imgs[imgName] = tempImgsData[imgName];
    });
  });


  // Return a promise for all imgPromises being settled.
  return Q.allSettled(imgPromises);
};

/**
 * Create image variants
 * 
 * Returns a promise.
 * @return promise
 */
var createImageVariants = function (imgPath, distDir, imgName, roundData, questionData) {

  // Create promise.
  var imageProcessComplete = Q.defer();

  // We need to identify the source image by checking for both PNG and JPG and
  // then creating all of the image variants.
  // 
  // Create promises.
  var foundImg = {
    png: Q.defer(),
    jpg: Q.defer()
  };

  var outputDir = distDir + '/' + 
      'round-' + roundData.roundId + '/' + 
      'question-' + questionData.questionId;

  // Create placeholder var for metadata.
  var imgFileData = {

  };

  // Repeat for both PNG and JPG.
  ['png', 'jpg'].forEach(function (imgType) {
    try {
      // Create full img path including extension.
      var imgFilePath = imgPath + '.' + imgType;

      // Use image magick to identify the file and return the metadata.
      im.identify(imgFilePath, function(err, metadata){

        // If metadata found then save and resolve promise.
        if (typeof metadata !== 'undefined') {
          foundImg[imgType].resolve();
          imgFileData.metadata = metadata;
          imgFileData.path = imgFilePath;
          imgFileData.imgName = imgName;
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

  var imageVariantsData = {};

  // On both PNG and JPG promises returning call function to create each of the
  // images variants.
  Q.allSettled([foundImg['png'].promise, foundImg['jpg'].promise]).then(function () {
    
    var imageVariantPromises = [];

    config.imgSizes.forEach(function (size) {
      var imageVariantPromise = createImageVariant(imgFileData, outputDir, size);
      imageVariantPromise.then(function (fileName) {
        imageVariantsData[size] = fileName;
      });
      imageVariantPromises.push(imageVariantPromise);
    });

    Q.allSettled(imageVariantPromises).then(function () {
      imageProcessComplete.resolve(imageVariantsData);
    });
  });

  // Return the imageProcessComplete promise.
  return imageProcessComplete.promise;
};

/**
 * Create a single image variant.
 * 
 * Returns a promise.
 * @return promise
 */
var createImageVariant = function (srcImg, outputDir, size) {
  // Create promise for variant.
  var variantProcessed = Q.defer();
  
  // Get img data.
  var imgData = fs.readFileSync(srcImg.path, 'binary');

  var outputDir = outputDir + '/' + srcImg.imgName;

  // Create specific directory.
  fs.mkdirParent(outputDir, function () {

    // Create output file name.
    var outputFileName = outputDir + '/' +
        srcImg.imgName + '_' + size +
        '.' + config.imgFormat;

    // Resize img to size.
    im.resize({
      srcData: imgData,
      width: size,
      format: config.imgFormat
    }, function(err, stdout, stderr) {
      
      if (err) {
        variantProcessed.reject(new Error(err));
        return;
      }

      fs.writeFileSync(outputFileName, stdout, 'binary');

      // Get api file path.
      var apiFilePath = outputFileName.split('dist/');
      if (apiFilePath.length === 1) {
        apiFilePath = apiFilePath[0];
      }
      else {
        apiFilePath = '/' + apiFilePath[1];
      }
      
      variantProcessed.resolve(apiFilePath);
    });
  });


  return variantProcessed.promise;
};

var saveJsonApi = function (data) {
  var jsonfile = require('jsonfile');
  var file = './dist/api/index.json';
  jsonfile.writeFileSync(file, data, {spaces: 2});
};

module.exports = buildApiMaster;
