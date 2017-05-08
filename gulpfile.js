var gulp = require('gulp');
var gutil = require('gulp-util');
var inlineImages = require('gulp-inline-images');
var critical = require('critical').stream;
var minifyInline = require('gulp-minify-inline');

// Translate any src images to base64
gulp.task('inline-images', function(cb){
    return gulp.src(['src/*.html','src/*/*.html'])
      .pipe(inlineImages({/* options */}))
      .pipe(gulp.dest('dist/'));
});

// Generate & Inline Critical-path CSS
// https://github.com/addyosmani/critical
// https://github.com/addyosmani/critical-path-css-demo
gulp.task('critical', ['inline-images'], function (cb) {
    return gulp.src(['dist/*.html','dist/*/*.html'])
        // .pipe(critical({base: 'src/', inline: true, css: ['']}))
        .pipe(critical({base: 'dist/', inline: true, width: 900, height: 2200, minify: true, ignore: [/icon-/,'@font-face']}))
        .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
        .pipe(gulp.dest('dist'));
});

// Minify any inline css/js
// https://www.npmjs.com/package/gulp-minify-inline
var optionsminify = {
  // js: {
  //   output: {
  //     comments: true
  //   }
  // },
  jsSelector: 'script[type!="text/x-handlebars-template"]',
  css: {
    keepSpecialComments: 1
  },
  cssSelector: 'style[data-do-not-minify!="true"]'
};

gulp.task('minify-inline', ['critical'], function(cb) {
  gulp.src(['dist/*.html','dist/*/*.html'])
    .pipe(minifyInline(optionsminify))
    .pipe(gulp.dest('dist/'))
});

// Build it all
gulp.task('default', ['inline-images','critical','minify-inline']);
