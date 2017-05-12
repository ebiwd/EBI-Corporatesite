var gulp = require('gulp');
var gutil = require('gulp-util');
var inlineImages = require('gulp-inline-images');
var critical = require('critical').stream;
var minifyInline = require('gulp-minify-inline');
var through = require('through2');

// Translate any src images to base64
gulp.task('inline-images', function(cb){
    return gulp.src(['src/*.html','src/**/*.html'])
      .pipe(inlineImages({/* options */}))
      .pipe(gulp.dest('dist/'));
});

// Generate & Inline Critical-path CSS
// https://github.com/addyosmani/critical
// https://github.com/addyosmani/critical-path-css-demo
gulp.task('critical', ['inline-images'], function (cb) {
  return gulp.src(['dist/*.html','dist/**/*.html'])
    // .pipe(critical({base: 'src/', inline: true, css: ['']}))
    .pipe(critical({base: 'dist/', inline: true, width: 900, height: 2200, minify: true, ignore: [/icon-/,/.svg/,'@font-face']}))
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
  gulp.src(['dist/*.html','dist/**/*.html'])
    .pipe(minifyInline(optionsminify))
    .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
    .pipe(gulp.dest('dist/'));
});

// Write a partial apache config
// https://github.com/ebiwd/EBI-Corporatesite/issues/1
var pipeFunction = () => {
  return through.obj((file, enc, cb) => {
    console.log(file.path);
    return cb(null, file);
  });
}
gulp.task('apache-config', ['critical'], function(cb) {
  var fileName = 'dist/.htaccess';
  var endOfLine = '\r\n';
  require('fs').writeFileSync(fileName, '# Static page mappings built with gulp');
  require('fs').appendFile(fileName, endOfLine); // new line
  require('fs').appendFile(fileName, 'RewriteCond %{QUERY_STRING} !(^|&)q=shib_login');
  gulp.src(['dist/*.html','dist/**/*.html'])
    // .pipe(pipeFunction());
  .pipe(through.obj(function (file, enc, cb) {
    var localFilePath = file.path.split('/dist/')[1];
    console.log('Mapping: ',localFilePath);
    require('fs').appendFile(fileName, endOfLine); // new line
    require('fs').appendFile(fileName, 'RewriteRule ^/'+localFilePath.split('index.htm')[0]+'?$ /staticpages/'+localFilePath+' [L]');
    cb(null, file)
  }));
});

// Build it all
gulp.task('default', ['inline-images','critical','minify-inline','apache-config']);
