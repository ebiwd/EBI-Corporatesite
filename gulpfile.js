const gulp = require('gulp');
const gutil = require('gulp-util');
const replace = require('gulp-replace');
const inlineImages = require('gulp-inline-images');
const critical = require('critical').stream;
const minifyInline = require('gulp-minify-inline');
const through = require('through2');
const del = require('del');

// Ensure dist folder is reset
gulp.task('purge', function(cb){
  return del([
    'dist/*'
  ]);
});

// Translate any src images to base64
gulp.task('inline-images', function(cb){
  return gulp.src(['src/*.html','src/**/*.html'])
    .pipe(inlineImages({/* options */}))
    .pipe(gulp.dest('dist/'))
    .on('error', function(err) {
      gutil.log(gutil.colors.red(err.message));
      process.exit(1);
    });
});

// Generate & Inline Critical-path CSS
// https://github.com/addyosmani/critical
// https://github.com/addyosmani/critical-path-css-demo
gulp.task('critical', function (cb) {
  return gulp.src(['dist/*.html','dist/**/*.html','!dist/security.txt/*.html'])
    .pipe(replace('\'//www.ebi', '\'https://www.ebi')) // make all protical relative //ebi.ac.uk to https://
    .pipe(replace('"//www.ebi', '"https://www.ebi')) // for double quote
    .pipe(critical({base: 'dist/', inline: true,
      dimensions: [{
          height: 600,
          width: 400
      }, {
          height: 900,
          width: 1500
      }],
      minify: true, ignore: [/icon-/,/.svg/,'@font-face']
    }))
    .on('success', function(err) {
      gutil.log(err)
    })
    .on('error', function(err) {
      gutil.log(gutil.colors.red(err.message));
      gutil.log(err)
      process.exit(1);
    })
    .pipe(gulp.dest('dist'));
});

// Minify any inline css/js
// https://www.npmjs.com/package/gulp-minify-inline
let optionsminify = {
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

gulp.task('minify-inline', function(cb) {
  return gulp.src(['dist/*.html','dist/**/*.html'])
    .pipe(replace(/('|")http(s)?\:\/\/www.ebi/g, '$1//www.ebi')) // make all http/s ebi urls //
    .pipe(minifyInline(optionsminify))
    .on('error', function(err) {
      gutil.log(gutil.colors.red(err.message));
      process.exit(1);
    })
    .pipe(gulp.dest('dist/'));
});

// Write a partial apache config
// https://github.com/ebiwd/EBI-Corporatesite/issues/1
let pipeFunction = () => {
  return through.obj((file, enc, cb) => {
    console.log(file.path);
    return cb(null, file);
  });
};
gulp.task('apache-config', function(cb) {
  let fileName = 'dist/.htaccess';
  let endOfLine = '\r\n';
  require('fs').writeFileSync(fileName, '# Static page mappings built with gulp');
  require('fs').appendFileSync(fileName, endOfLine); // new line
  require('fs').appendFileSync(fileName, 'AddOutputFilterByType DEFLATE text/html');
  require('fs').appendFileSync(fileName, endOfLine); // new line
  require('fs').appendFileSync(fileName, 'RewriteCond %{QUERY_STRING} !(^|&)q=');
  return gulp.src(['dist/*.html','dist/**/*.html'])
    .pipe(through.obj(function (file, enc, cb) {
      let localFilePath = file.path.split('/dist/')[1];
      gutil.log(gutil.colors.green('Mapping: ',localFilePath));
      require('fs').appendFileSync(fileName, endOfLine); // new line
      require('fs').appendFileSync(fileName, 'RewriteRule ^/'+localFilePath.split('index.htm')[0]+'?$ /staticpages/'+localFilePath+' [L]');
      cb(null, file);
      })
      .on('finish', function (status) {
        gutil.log(gutil.colors.green('Finished writing .htaccess'));
      })
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.message));
        process.exit(1);
      })
    );
});

// Build it all
gulp.task('default', gulp.series(
  'purge','inline-images','critical','minify-inline','apache-config'
));

// Alias for default
gulp.task('dev', gulp.series(
  'default'
));
