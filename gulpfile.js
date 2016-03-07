'use strict';

require('dotenv').load();

//   Libraries
var argv = require('yargs').argv,
    fs = require('fs'),

    gulp = require('gulp'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    wrap = require('gulp-wrap'),
    gulpif = require('gulp-if'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    cssnano = require('gulp-cssnano'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps');

var env = process.env.NODE_ENV || 'development';
if (env == 'production') argv.minify = true;

//   Paths and configurations
var paths = {
    js : [
        'front/src/app.js',
        'front/src/**/*.module.js',
        'front/src/**/*.js'
    ],
    libs : [
        'front/vendor/jquery/dist/jquery.js',
        'front/vendor/jquery-ui/ui/jquery-ui.js',
        'front/vendor/underscore/underscore.js',
        'front/vendor/angular/angular.js',
        'front/vendor/bootstrap/dist/js/bootstrap.js',
        'front/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
        'front/vendor/angular-ui-router/release/angular-ui-router.js',
        'front/vendor/angular-permission/dist/angular-permission.js',
        'front/vendor/satellizer/satellizer.js',
        'front/vendor/angular-animate/angular-animate.js',
        'front/vendor/angular-toastr/dist/angular-toastr.tpls.js',
        'front/vendor/angular-loading-bar/build/loading-bar.js',
        'front/vendor/angular-ui-slider/src/slider.js',
        'front/vendor/Sortable/Sortable.js',
        'front/vendor/Sortable/ng-sortable.js'
    ],
    less : [
        'front/vendor/bootstrap/less/bootstrap.less',
        'front/vendor/angular-toastr/dist/angular-toastr.css',
        'front/vendor/angular-loading-bar/build/loading-bar.css',
        'front/vendor/ng-joyride/ng-joyride.css',
        'front/vendor/font-awesome/less/font-awesome.less'
    ],
    fonts : [
        'front/vendor/bootstrap/fonts/*.*',
        'front/vendor/font-awesome/fonts/*.*',
        'front/assets/fonts/*.*'
    ]
};

//
//   Layout
//
gulp.task('jade', function() {
    return gulp
        .src('front/src/**/*.jade')
        .pipe(jade({
            doctype : 'html',
            pretty : true,
            locals : {
                config : {
                    api_url : process.env.API_URL,
                    facebook_id : process.env.FACEBOOK_ID,
                    facebook_secret : process.env.FACEBOOK_SECRET
                }
            }
        }))
        .pipe(gulp.dest('front/dist'))
});

//
//   CSS related tasks
//
gulp.task('less-app', function() {
    return gulp
        .src('front/assets/styles/styles.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(gulpif(argv.minify, cssnano()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/dist/css'))
});

gulp.task('less-vendor', function() {
    return gulp
        .src(paths.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('vendor.css'))
        .pipe(gulpif(argv.minify, cssnano()))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('front/dist/css'))
});

gulp.task('less', ['less-app', 'less-vendor']);

//
//   JS related tasks
//
gulp.task('js-app', function() {
    return gulp
        .src(paths.js)
        .pipe(wrap("\n(function(){\n<%= contents %>\n})();"))
        .pipe(babel({}))
        .pipe(concat('all.js'))
        //.pipe(gulpif(argv.minify, uglify()))
        .pipe(gulp.dest('front/dist/js/'))
});

gulp.task('js-libs', function() {
    return gulp
        .src(paths.libs)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        //.pipe(gulpif(argv.minify, uglify()))
        .pipe(gulp.dest('front/dist/js/'));
});

gulp.task('js', ['js-app', 'js-libs']);

//
//   Common tasks
//
gulp.task('copy-images', function () {
    return gulp
        .src('front/assets/images/**/*.*')
        .pipe(gulp.dest('front/dist/images/'));
});

gulp.task('copy-css', function () {
    return gulp
        .src('front/assets/styles/style-css/**/*.*')
        .pipe(gulp.dest('front/dist/css/'));
});

gulp.task('copy-fonts', function() {
    return gulp
        .src(paths.fonts)
        .pipe(gulp.dest('front/dist/fonts/'))
});

gulp.task('install', [
    'copy-images',
    'copy-fonts',
    'js',
    'less',
    'jade',
    'copy-css'
]);

gulp.task('watch', function () {
    gulp.watch(['front/src/**/*.jade'], ['jade']);
    gulp.watch(['front/src/**/*.js'], ['js-app']);
    gulp.watch(['front/assets/styles/**/*.less'], ['less-app']);
    gulp.watch(['front/assets/images/**/*.*'], ['copy-images']);
});