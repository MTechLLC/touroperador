const promise      = require('es6-promise');
const gulp         = require('gulp');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const runSequence  = require('run-sequence');
const clean        = require('gulp-clean');

const drupalLibraries = '../../../libraries';
const node_modules = 'node_modules';
const bootstrap = 'bootstrap';
const style_sass = './assets/sass/style.scss';
const style_css = './css';
const path = './';

promise.polyfill();

gulp.task('prod', ['node', 'assets'], function () {
  return gulp
    .src(style_sass)
    .pipe(sass({
      errLogToConsole: true,
      style_cssStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(gulp.dest(style_css))
});

gulp.task('dev', ['node', 'assets'], function () {
  return gulp
    .src(style_sass)
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true,
      style_cssStyle: 'nested'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(style_css))
});

gulp.task('watch', function () {
  return gulp
    .watch(style_sass, ['dev'])
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('assets', function(callback) {
  runSequence(
    ['clean-images', 'clean-javascript'],
    callback
  );
});

gulp.task('node', function(callback) {
  runSequence(
    ['clean-pl-css', 'clean-drupal-css', 'clean-drupal-libraries', 'clean-drupal-bootstrap'],
    ['bootstrap', 'jquery', 'dropzone', 'imagesloaded', 'jquery-colorbox', 'masonry', 'matchHeight'],
    callback
  );
});

// Move around some files from the bower folder into proper destinations.
gulp.task('bootstrap', function() {
  return gulp.src(node_modules + '/bootstrap-sass/**/*.*', { base: node_modules + '/bootstrap-sass' })
    .pipe(gulp.dest(path + bootstrap));
});

gulp.task('dropzone', function() {
  return gulp.src(node_modules + '/dropzone/**/*.*', { base: node_modules })
    .pipe(gulp.dest(drupalLibraries));
});

gulp.task('imagesloaded', function() {
  return gulp.src(node_modules + '/imagesloaded/**/*.*', { base: node_modules })
    .pipe(gulp.dest(drupalLibraries));
});

gulp.task('jquery-colorbox', function() {
  return gulp.src(node_modules + '/jquery-colorbox/**/*.*', { base: node_modules + '/jquery-colorbox' })
    .pipe(gulp.dest(drupalLibraries + '/colorbox'));
});

gulp.task('masonry', function() {
  return gulp.src(node_modules + '/masonry/**/*.*', { base: node_modules })
    .pipe(gulp.dest(drupalLibraries));
});

gulp.task('matchHeight', function() {
  return gulp.src(node_modules + '/matchHeight/**/*.*', { base: node_modules })
    .pipe(gulp.dest(drupalLibraries));
});

gulp.task('jquery', function() {
  return gulp.src(node_modules + '/jquery/**/*.*', { base: node_modules })
    .pipe(gulp.dest(drupalLibraries));
});

// Move assets.
gulp.task('images', function() {
  return gulp.src(source + 'images/**/*.*')
    .pipe(gulp.dest(path + 'images'));
});

gulp.task('javascript', function() {
  return gulp.src(source + 'js/**/*.*')
    .pipe(gulp.dest(path + 'js'));
});

// Clean destinations.
gulp.task('clean-pl-css', function() {
  return gulp.src(style_css + 'style.css', {read: false})
    .pipe(clean());
});

gulp.task('clean-drupal-css', function() {
  return gulp.src(path + 'css/style.css', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-drupal-libraries', function() {
  return gulp.src(drupalLibraries, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-drupal-bootstrap', function() {
  return gulp.src(path + bootstrap, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-images', function() {
  return gulp.src(path + bootstrap, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('clean-javascript', function() {
  return gulp.src(path + bootstrap, {read: false})
    .pipe(clean({force: true}));
});

gulp.task('default', ['prod']);
