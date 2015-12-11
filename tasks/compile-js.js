var gulp = require('gulp');
var config = require('../gulp-config.json').js;
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var livereload = require('gulp-livereload');

gulp.task('compile:js', function () {

  return browserify(config.src)
    .transform(reactify)
    .bundle()
    .pipe(source(config.outputFileName))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest(config.outputDir))
    .pipe(livereload());
});

gulp.task('watch:js', function () {
  livereload.listen();
  gulp.start('compile:js');
  gulp.watch(config.toWatch, ['compile:js']);
});