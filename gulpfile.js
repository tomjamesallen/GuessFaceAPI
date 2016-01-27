var gulp = require('gulp');

var requireDir = require('require-dir');
requireDir('./tasks');

// Gulp needs to perform the following tasks.
// * Create image variants
// * Output JSON API with image data and answers.
// 
// Directory structure is as follows:
// - src/
//    - questions/
//      - question-name/
//        - a.jpg
//        - b.jpg
//        - mix.jpg
//        - index.json
// - dist/
//    - api/
//      - index.json
//      - imgs/
//        - 1280/
//          - question-name.1280.jpg
//          - question-name-2.1280.jpg
// 
// We need to look at the rounds meta data for the order of the questions and
// then looks in the questions directory for the matching folder name. We then
// load up the meta data from the question and check for the neccessary images.
// Images variant can then be created and placed in the dist/api directory. The
// image paths are saved and added to the data to be saved to api/index.json.

gulp.task('default', ['build-api']);
