import gulp from 'gulp';
import babel from 'gulp-babel';
import watch from 'gulp-watch';
import plumber from 'gulp-plumber'

let srcDir = './src/**/*.js'

gulp.task('build', () => {
  return gulp.src(srcDir)
    .pipe(plumber())
    .pipe(babel({blacklist: ['regenerator']}))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('watch', () => {
  watch([srcDir], () => {
    gulp.start('build')
  });
});

gulp.task('default', ['build', 'watch']);
