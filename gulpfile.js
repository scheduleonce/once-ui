var gulp = require('gulp');
var del = require('del');

gulp.task('copy', function() {
  return gulp.src(['./projects/ui/**/*.scss'], {}).pipe(gulp.dest('./dist/ui'));
});
gulp.task('copy-storybook-config', function() {
  return gulp.src(['./static.json'], {}).pipe(gulp.dest('./storybook-static'));
});
gulp.task('clean-storybook-build', function() {
  return del(['./storybook-static/**/*']);
});
