(function() {
  'use strict';

  var gulp = require('gulp');

  gulp.task('build', ['uglify', 'doc', 'test']);

})();
