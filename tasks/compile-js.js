var gulp = require('gulp');
var config = require('../gulp-config.json').jsConfig;
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

gulp.task('build:js', function () {
  var bundler = browserify(config.jsSrc, {

  });
  bundler.transform(reactify);
  // bundler.plugin('minifyify', {map: 'bundle.map.json'});
  
  var stream = bundler.bundle();
  return stream
    .pipe(source(config.outputFileName))
    .pipe(gulp.dest(config.outputDir));
});

gulp.task('watch:js', function () {
  gulp.start('build:js');
  gulp.watch(config.jsToWatch, ['build:js']);
});