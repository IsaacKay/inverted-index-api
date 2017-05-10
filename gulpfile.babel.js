import gulp from 'gulp';
import istanbul from 'gulp-babel-istanbul';
import jasmine from 'gulp-jasmine-node';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';
import minify from 'gulp-babel-minify';
import coveralls from 'gulp-coveralls';
import injectModules from 'gulp-inject-modules';
import exit from 'gulp-exit';

gulp.task('compile-sources', () => {
  const stream = gulp.src(['./src/**/*.js'])
    .pipe(babel())
    .pipe(minify())
    .pipe(gulp.dest('dist'));

  return stream;
});
gulp.task('serve', ['compile-sources'], () => {
  const stream = nodemon({
    script: 'dist/app.js',
    watch: 'src/',
  });
  return stream;
});
gulp.task('run-tests', () => {
  const stream = gulp.src(['tests/inverted-index-tests.js'])
    .pipe(babel())
    .pipe(injectModules())
    .pipe(jasmine({ includeStackTrace: true, color: true }))
    .pipe(exit());
  return stream;
});
gulp.task('coverage', () => {
  gulp.src(['src/**/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src('tests/inverted-index-tests.js')
      .pipe(babel())
      .pipe(injectModules())
      .pipe(jasmine())
      .pipe(istanbul.writeReports())
      .pipe(istanbul.enforceThresholds({ thresholds: { global: 30 } }))
      .on('end', () => {
        gulp.src('coverage/lcov.info')
        .pipe(coveralls());
      });
    });
});
