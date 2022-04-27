var gulp = require('gulp');

gulp.task('copy', function () {
  return gulp.src(['./projects/ui/**/*.scss'], {}).pipe(gulp.dest('./dist/ui'));
});
