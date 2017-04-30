const gulp = require('gulp');
const jasmineGulp = require('gulp-jasmine-node');
const istanbulReporterGulp = require('gulp-istanbul-report');

const jasmineGulpOptions = {
  timeout: 10000,
  includeStackTrace: false,
  color: true
};

const coverageFile = './coverage/coverage.json';

gulp.task('run-test', () => {
  gulp.src(['tests/*.js']).pipe(jasmineGulp(jasmineGulpOptions));
});

// this part is not working yet
gulp.task('coverage', ['run-test'], () => {
  gulp.src(coverageFile)
    .pipe(istanbulReporterGulp({
      reporters: [
        'text-summary',
        {
          name: 'json',
          file: 'cov.json',
          dir: './coverage'
        }
      ]
    }));
});
