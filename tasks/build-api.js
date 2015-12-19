// Require modules.
var gulp = require('gulp');
var Q = require('q');
var extend = require('extend');
var im = require('imagemagick');
var fs = require('fs');
var _ = require('underscore');

// FS Helpers.
fs.mkdirParent = require('./helpers/mkdirParent');
fs.deleteFolderRecursive = require('./helpers/deleteFolderRecursive');

// Var defaults object.
var defaults = {
  imageOutputDir : "dist/api/imgs",
  imgSizes: [320, 640, 960],
  imgFormat: 'jpg'
};

// Get extend defaults with config in build-api-config.json.
var config = extend({}, defaults, require('../build-api-config.json'));

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
  fs.deleteFolderRecursive('./' + config.imageOutputDir, 'force');

  // Cycle over rounds in questionsData.
  questionsData.forEach(function (roundDataTemp, i) {
    
    // Promise returned by processRound.
    var roundReturned = processRound(roundDataTemp, i);

    // When roundReturned promise resolves save round data to API's rounds 
    // propery.
    roundReturned.then(function (roundData) {
      // Save round data to rounds object, keyed by roundId.
      apiData.rounds[roundData.roundId] = roundData;
    });

    // Add the promise returned from processRound to the roundPromises array.
    roundPromises.push(roundReturned);
  });

  // Wait for all roundPromises to be settled, then save API data to output
  // JSON file.
  Q.allSettled(roundPromises).then(function () {
    saveJsonApi(apiData);
    console.log('JSON saved to API.');
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

  var forEachQuestion = function (questionDir, i, array, isExample) {

    // Set default 'isExample'.
    if (typeof isExample === 'undefined') isExample = false;

    // Declare questionData var here.
    var questionDataTemp;

    // Check for and set question data.
    if (questionDataTemp = getQuestionData(questionDir)) {

      if (!isExample) {
        // Set questionId property on questionData.
        questionDataTemp.questionId = questionId ++;
      }
      else {
        // For example questions set question id to 'e'.
        questionDataTemp.questionId = 'e';
      }

      // Save round data to question.
      questionDataTemp.roundData = {
        roundId: roundData.roundId,
        title: roundData.title
      };

      // Call createQuestionsImages and save promise.
      var questionDataReturnedPromise = createQuestionsImages(questionDir, questionDataTemp);

      // Save question data on data returned promise returning.
      questionDataReturnedPromise.then(function (questionData) {

        if (questionData.questionId !== 'e') {
          // Push question data to questionsData array on roundData.
          roundData.questionsData[questionData.questionId] = questionData;
        }
        else {
          // Save example data to roundData.
          roundData.exampleData = questionData;
        }
      });

      // Request and save promise for question images.
      questionPromises.push(questionDataReturnedPromise);
    }
  }

  // Cycle over questions in round.
  roundData.questions.forEach(forEachQuestion);

  // Get example question.
  if (roundData.example) {
    forEachQuestion(roundData.example, 0, null, true);
  }

  // Delete initial questions data as this should not be output.
  delete roundData.questions;

  // Delete initia example field as this should not be output.
  delete roundData.example;

  // Create new promise for roundReady.
  var roundReadyPromise = Q.defer();

  // When all questionPromises are settled, resolve the roundReadyPromise,
  // passing it the roundData.
  Q.allSettled(questionPromises).then(function () {
    roundReadyPromise.resolve(roundData);
  });
  
  // Return the allSettled promise.
  return roundReadyPromise.promise;
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
var createQuestionsImages = function (questionDir, questionDataTemp) {

  // Check for and then create variants for each of the three images: a, b, mix.
  // Any of the images could be JPGs or PNGs so exclude the extension from the
  // imgPath.

  // Clone the questionDataTemp input to un-link it form the original object,
  // this prevents previous object options being overriden.
  var questionDataTemp = _.clone(questionDataTemp);

  // The directory to save output images to.
  var distDir = './' + config.imageOutputDir;

  // Prepend src/questions path to the questionDir.
  var questionImgDir = './src/questions/' + questionDir;
  
  // Create empty array for imgPromises.
  var imgPromises = [];

  var imgKeys = ['a', 'b', 'mix'];

  var tempImgsData = {};

  // Repeat process for a, b and mix images.
  imgKeys.forEach(function (imgName) {

    // Create the image path.
    var path = questionImgDir + '/' + imgName;

    // Create an imgReady promise.
    var imgReadyPromise = Q.defer();

    // Call function to create image variants. When it returns save imgsData to
    // questionData.
    createImageVariants(path, distDir, imgName, questionDataTemp.roundData.roundId, questionDataTemp.questionId).then(function (imgVariantsData) {
      
      // Save the imgVariantData to tempImgsData, keyed by the imgName.
      tempImgsData[imgName] = imgVariantsData;
      // Resolve the imgReady promise.
      imgReadyPromise.resolve();
    })

    // Push the promise to the imgPromises array.
    imgPromises.push(imgReadyPromise.promise);
  });

  // Create promise for all img promises being settled.
  var allImgPromisesSettledPromise = Q.defer();

  // Save imgData back to questionDat once all img promises have been settled.
  Q.allSettled(imgPromises).then(function () {

    // Create object for imgs.
    questionDataTemp.imgs = {};
    
    // For each of the image key, save the data to the questionData.
    imgKeys.forEach(function (imgName) {
      if (typeof tempImgsData[imgName] !== 'undefined') {
        questionDataTemp.imgs[imgName] = tempImgsData[imgName];
      }
    });

    // Once all data is saved, resolve the promise.
    allImgPromisesSettledPromise.resolve(questionDataTemp);
  });


  // Return a promise for all imgPromises being settled.
  return allImgPromisesSettledPromise.promise;
};

/**
 * Create image variants
 * 
 * Returns a promise.
 * @return promise
 */
var createImageVariants = function (imgPath, distDir, imgName, roundId, questionId) {

  // Create promise.
  var imgProcessComplete = Q.defer();

  // We need to identify the source image by checking for both PNG and JPG and
  // then creating all of the image variants.

  // Create promises.
  var foundImgPromises = {
    png: Q.defer(),
    jpg: Q.defer()
  };

  // Build outputDir using roundId and questionId.
  var outputDir = distDir + '/' + 
      'round-' + roundId + '/' + 
      'question-' + questionId;

  // Create placeholder var for metadata.
  var imgFileData = {};

  // Repeat for both PNG and JPG.
  ['png', 'jpg'].forEach(function (imgType) {
    try {
      // Create full img path including extension.
      var imgFilePath = imgPath + '.' + imgType;

      // Use image magick to identify the file and return the metadata.
      im.identify(imgFilePath, function(err, metadata){

        // If metadata found then save and resolve promise.
        if (typeof metadata !== 'undefined') {
          
          // Save the data we'll need to the imgFileData object.
          imgFileData.metadata = metadata;
          imgFileData.path = imgFilePath;
          imgFileData.imgName = imgName;

          // Resolve the promise for this file type.
          foundImgPromises[imgType].resolve();
        }
        else {
          // If no metadata is found reject the promise.
          foundImgPromises[imgType].reject(new Error('No metadata'));
        }
      });
    }
    catch (e) {
      // If we have an error reject the promise.
      foundImgPromises[imgType].reject(new Error(e));
    }
  });

  // Create an empty object to store the image 
  var imgVariantsData = {
    srcs: {}
  };

  // On both PNG and JPG promises returning call function to create each of the
  // images variants.
  Q.allSettled([foundImgPromises['png'].promise, foundImgPromises['jpg'].promise]).then(function () {
    
    // Save useful metadata.
    if (imgFileData.metadata.height && imgFileData.metadata.width) {
      imgVariantsData.aspectRatio = imgFileData.metadata.height/imgFileData.metadata.width;
    }
    else {
      imgVariantsData.aspectRatio = null;
    }

    // Create empty array for imgVariantPromises.
    var imgVariantPromises = [];

    // For each img size in the config call the createImageVariant function.
    config.imgSizes.forEach(function (size) {

      // Save the promise returned by createImageVariant.
      var imageVariantPromise = createImageVariant(imgFileData, outputDir, size);
      
      // Save data on promise returning. 
      imageVariantPromise.then(function (fileName) {
        imgVariantsData.srcs[size] = fileName;
      });

      // Push promise to imgVariantPromises array.
      imgVariantPromises.push(imageVariantPromise);
    });

    // Once all imgVariant promises are settled, resolve the imgProcessComplete
    // promise, passing it the imgVariantsData.
    Q.allSettled(imgVariantPromises).then(function () {
      imgProcessComplete.resolve(imgVariantsData);
    });
  });

  // Return the imgProcessComplete promise.
  return imgProcessComplete.promise;
};

/**
 * Create a single image variant.
 * 
 * Returns a promise.
 * @return promise
 */
var createImageVariant = function (srcImg, outputDir, size) {
  
  // Create promise for variant.
  var variantProcessedPromise = Q.defer();
  
  // Get img data.
  var imgData = fs.readFileSync(srcImg.path, 'binary');

  // Build outputDir.
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
      
      // Reject promise if im.resize returns an error.
      if (err) {
        variantProcessedPromise.reject(new Error(err));
        return;
      }

      // Write output of im.resize to outputFileName.
      fs.writeFileSync(outputFileName, stdout, 'binary');

      // Get api file path.
      var apiFilePath = outputFileName.split('dist/');
      if (apiFilePath.length === 1) {
        // Get filepath after dist/.
        apiFilePath = apiFilePath[0];
      }
      else {
        apiFilePath = '/' + apiFilePath[1];
      }
      
      // Resolve variant processed promise.
      variantProcessedPromise.resolve(apiFilePath);
    });
  });

  // Return variant processed promise.
  return variantProcessedPromise.promise;
};

/**
 * Save data to JSON.
 */
var saveJsonApi = function (data) {
  var jsonfile = require('jsonfile');
  var file = './dist/api/index.json';
  jsonfile.writeFileSync(file, data, {spaces: 2});
};

/**
 * Gulp task.
 */
gulp.task('build-api', function () {
  buildApiMaster();
});

// Export function for re-use.
module.exports = buildApiMaster;
