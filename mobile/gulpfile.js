/**
 * En el caso que tire error al ejecutar el script de gulp
 * verificar la version de Nodejs instalada, ya que las viejas versiones
 * no soportan es6, es7
 */

//Librería gulp
const gulp = require('gulp');
//Libreria para concatenar archivos
const concat = require('gulp-concat');
//Librería para minificar el CSS
const cleanCSS = require('gulp-clean-css');
//Librerìa para realizar el transpiler de ES6 a ES5
const babel = require('gulp-babel');
//Tareas default que usa ionic para hacer el build de la apk...
const sass = require('gulp-sass');
const minifyCss = require('gulp-minify-css');
const rename = require('gulp-rename');

//Path para la ubicación de los archivos
const PATH_FILES = {
  js: {
    src: ['./www/js/*.js', './www/js/**/*.js', './node_modules/angular-base64-upload/dist/angular-base64-upload.js'],
    output: './www/dist/js/'
  },
  css: {
    src: ['./www/css/*.css'],
    output: './www/dist/css/'
  }
};

//Task por default
gulp.task('default', ['js:watch', 'css:watch']);

//Task para producción, generar una release el bundle 
gulp.task('release', ['js', 'minify-css']);

//Task para generar el bundle final de los archivos JS, se hace un transpiler de los archivos a ES2015
gulp.task('js', () => {
  gulp.src(PATH_FILES.js.src)
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest(PATH_FILES.js.output))
});

//Task para minifcar el css 
gulp.task('minify-css', () => {
  return gulp.src(PATH_FILES.css.src)
    .pipe(cleanCSS())
    .pipe(gulp.dest(PATH_FILES.css.output));
});

//Task default para los archivos sass de ionic
gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

//Task para watchear los archivos cuando se modifican y corre la task 'js'
gulp.task('js:watch', ['js'], () => gulp.watch(PATH_FILES.js.src, ['js']));

//Task para watchear los archivos css, minifica el CSS
gulp.task('css:watch', ['minify-css'], () => gulp.watch(PATH_FILES.css.src, ['minify-css']));