import gulp from 'gulp';

gulp.task('copy', function () {
  return gulp.src(['./ui/**/*.scss'], {}).pipe(gulp.dest('./dist/ui'));
});
