var gulp = require('gulp');
var path = require('path');
var connect = require('gulp-connect');
var cors = require('cors');

var corsOptions = {
  // origin: '*'
};

var portNumber = 8777;

gulp.task('dev-server', function () {
  connect.server({
    root: 'dist/api',
    port: portNumber,
    middleware: function() {
      return [cors(corsOptions)];
    }
  });
});
