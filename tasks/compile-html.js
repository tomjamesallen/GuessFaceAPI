var gulp = require('gulp');
var config = require('../gulp-config.json').html;
var minifyHTML = require('gulp-minify-html');
var livereload = require('gulp-livereload');

gulp.task('compile:html', function () {
  gulp.src(config.src)
    .pipe(minifyHTML({
      empty: true,
      cdata: true,
      conditionals: true,
      spare: true,
      quotes: true,
    }))
    .pipe(gulp.dest(config.outputDir))
    .pipe(livereload());
});

gulp.task('watch:html', function () {
  livereload.listen();
  gulp.start('compile:html');
  gulp.watch([config.src], ['compile:html']);
});