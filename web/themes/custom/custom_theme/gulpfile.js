var promise = require('es6-promise');
var gulp         = require('gulp');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var sourcemaps   = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var bower        = require('gulp-bower');
var runSequence  = require('run-sequence');
var clean        = require('gulp-clean');
var chmod = require('gulp-chmod');

var input = './sass/**/*.scss';
var output = './css';
var autoprefixerOptions = {
    browsers: ['last 1 version']
};
var processors = [
    autoprefixer(autoprefixerOptions),
];
var bowerComponents = '../../../../bower_components';
var assetLibraries = '../../../libraries';
var shPLPostInstall = '../../../../scripts/drupalvm';
var patternLab = './pattern-lab';

promise.polyfill();

gulp.task('prod', ['bower'], function () {
    return gulp
        .src(input)
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest(output));
});

gulp.task('dev', ['bower'], function () {
    return gulp
        .src(input)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'nested'
        }).on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(output));
});

gulp.task('watch', function () {
    return gulp
        .watch(input, ['dev'])
        .on('change', function(event) {
            console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
});

gulp.task('bower', function(callback) {
    runSequence(
        'permission',
        'run-bower',
        ['clean-libraries', 'clean-theme-bootstrap', 'clean-theme-vendor'],
        ['bootstrap', 'dropzone', 'imagesloaded', 'jquery-colorbox', 'masonry', 'matchHeight', 'patternlab'],
        callback
    );
});

gulp.task('permission', function () {
    return gulp
        .src(shPLPostInstall + '/patternlab-postinstall.sh')
        .pipe(chmod({
            owner: {
                read: true,
                write: true,
                execute: true
            },
            group: {
                execute: true
            },
            others: {
                execute: true
            }
        }))
        .pipe(gulp.dest(shPLPostInstall));
});

gulp.task('run-bower', function() {
    return bower(bowerComponents);
});

// Move around some files from the bower folder into proper destinations.
gulp.task('bootstrap', function() {
    return gulp.src(bowerComponents + '/bootstrap-sass/**/*.*', { base: bowerComponents + '/bootstrap-sass' })
        .pipe(gulp.dest('./bootstrap'));
});
gulp.task('dropzone', function() {
    return gulp.src(bowerComponents + '/dropzone/**/*.*', { base: bowerComponents })
        .pipe(gulp.dest(assetLibraries));
});
gulp.task('imagesloaded', function() {
    return gulp.src(bowerComponents + '/imagesloaded/**/*.*', { base: bowerComponents })
        .pipe(gulp.dest(assetLibraries));
});
gulp.task('jquery-colorbox', function() {
    return gulp.src(bowerComponents + '/jquery-colorbox/**/*.*', { base: bowerComponents + '/jquery-colorbox' })
        .pipe(gulp.dest(assetLibraries + '/colorbox'));
});
gulp.task('masonry', function() {
    return gulp.src(bowerComponents + '/masonry/**/*.*', { base: bowerComponents })
        .pipe(gulp.dest(assetLibraries));
});
gulp.task('matchHeight', function() {
    return gulp.src(bowerComponents + '/matchHeight/**/*.*', { base: bowerComponents })
        .pipe(gulp.dest('./vendor'));
});
gulp.task('patternlab', function() {
    return gulp.src(bowerComponents + '/edition-php-drupal-standard/**/*', { base: bowerComponents + '/edition-php-drupal-standard'})
        .pipe(gulp.dest(patternLab));
});

// Clean destinations.
gulp.task('clean-libraries', function() {
    return gulp.src(assetLibraries, {read: false})
        .pipe(clean({force: true}));
});
gulp.task('clean-theme-bootstrap', function() {
    return gulp.src('./bootstrap', {read: false})
        .pipe(clean());
});
gulp.task('clean-theme-vendor', function() {
    return gulp.src('./vendor', {read: false})
        .pipe(clean());
});

gulp.task('default', ['prod']);
