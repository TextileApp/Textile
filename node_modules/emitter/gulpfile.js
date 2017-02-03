var gulp = require('gulp')
var babel = require('gulp-babel')
var sourcemaps = require('gulp-sourcemaps')

gulp.task('babel-compile', function() {
  return gulp.src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      modules: 'umd'
    }))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest('dist/'))
})

gulp.task('default', ['babel-compile'])