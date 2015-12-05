'use strict';

// Require modules
var watchify = require('watchify'),
    browserify = require('browserify'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    assign = require('lodash.assign'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    path = require('path'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'),
    plumber = require('gulp-plumber'),
    ignore = require('gulp-ignore');

// Project variables & Watchify conf
var distFolder = '../dist',
    buildFolder = '../build',
    customOpts = {
      entries: [buildFolder + '/js/app.js'],
      debug: true
    },
    opts = assign({}, watchify.args, customOpts),
    b = watchify(browserify(opts)); 


// -- TASKS --

// JS Task
gulp.task('javascript', bundle); 
b.on('update', bundle); 
b.on('log', gutil.log); 

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('app.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest(distFolder+'/js'));
}

// Lint Task
gulp.task('lint', function() {
    return gulp.src(buildFolder + 'js/*.js')
        .pipe(ignore.exclude(/libs\.js/))
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .on('error', function(err) {
            console.log(err);
        });
});

// Compile Our Sass
gulp.task('compass', function() {
    return gulp.src(buildFolder + 'sass/*.sass')
        .pipe(plumber())
        .pipe(compass({
            css: distFolder + '/css',
            sass: buildFolder + '/sass',
            image: distFolder + '/img',
            generated_images_path: '/img/sprites'
        }))
        .pipe(gulp.dest(distFolder + 'css'))
        .pipe(livereload());
});

// Livereload on PHP/HTML file update
gulp.task('template-udpate', function() {
    return gulp.pipe(livereload());
});

// Watch Files For Changes
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(distFolder + '*.php', ['template-udpate']);
    gulp.watch(distFolder + '*.html', ['template-udpate']);
    gulp.watch(buildFolder + '/js/*.js', ['lint', 'javascript']);
    gulp.watch(buildFolder + '/sass/*.{sass,scss}', ['compass']);
    gulp.watch(buildFolder + '/sass/**/*.{sass,scss}', ['compass']);
});

// Default Task
gulp.task('default', ['lint', 'livereload', 'compass', 'javascript', 'watch']);