const gulp = require('gulp');
const jasmineGulp = require('gulp-jasmine-node');

gulp.task('run-test', () => {
  gulp.src(['tests/inverted-index-tests.js']).pipe(jasmineGulp({
    timeout: 10000,
    includeStackTrace: false,
    color: true
  }));
});

