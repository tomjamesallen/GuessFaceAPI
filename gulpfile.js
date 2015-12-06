var gulp = require('gulp');

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
  console.log('running default');
});

gulp.task('build-api', function () {
  require('./tasks/build-api')();
});



