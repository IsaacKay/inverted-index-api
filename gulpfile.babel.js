import gulp from 'gulp';
import istanbul from 'gulp-istanbul';
import istanbulReport from 'gulp-istanbul-report';
import jasmine from 'gulp-jasmine-node';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';
import minify from 'gulp-babel-minify';
import coveralls from 'gulp-coveralls';

gulp.task('compile-sources', () => {
  const stream = gulp.src(['./src/*.js'])
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
gulp.task('pre-test', () => {
  const stream = gulp.src(['./src/inverted-index.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
  return stream;
});

gulp.task('run-test', ['pre-test'], () => {
  const stream = gulp.src(['tests/inverted-index-tests.js'])
    .pipe(jasmine({ includeStackTrace: true }))
    .pipe(istanbul.writeReports({ dir: './coverage' }));
  return stream;
});
gulp.task('coverage', ['run-test'], () => {
  const stream = gulp.src('test/coverage/**/lcov.info')
    .pipe(coveralls())
    .pipe(istanbulReport());
  return stream;
});
