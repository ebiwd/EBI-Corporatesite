const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const through = require('through2');

// Pull in optional configuration from the package.json file, a la:
const {componentPath, componentDirectories, buildDestionation} = require('@visual-framework/vf-config');

// Tasks to build/run vf-core component system
require('./node_modules/\@visual-framework/vf-core/gulp-tasks/_gulp_rollup.js')(gulp, path, componentPath, componentDirectories, buildDestionation);
require('./node_modules/\@visual-framework/vf-extensions/gulp-tasks/_gulp_rollup.js')(gulp, path, componentPath, componentDirectories, buildDestionation);

// Watch folders for changes
gulp.task('watch', function() {
  // left for convince for local watch additions
  gulp.watch(['./build/css/styles.css'], gulp.series('eleventy:reload'));
});

gulp.task('apache-config', function(cb) {
  const fileName = 'build/.htaccess';
  const endOfLine = '\r\n';
  require('fs').writeFileSync(fileName, '# Static page mappings built with gulp');
  require('fs').appendFileSync(fileName, endOfLine); // new line
  require('fs').appendFileSync(fileName, 'AddOutputFilterByType DEFLATE text/html');
  require('fs').appendFileSync(fileName, endOfLine); // new line
  require('fs').appendFileSync(fileName, 'RewriteCond %{QUERY_STRING} !(^|&)q=');
  return gulp.src(['build/*.{html,jpg,png,gif,pdf,mp4}','build/**/*.{html,svg,jpg,png,gif,pdf,mp4}'])
    .pipe(through.obj(function (file, enc, cb) {
      const localFilePath = file.path.split('/build/')[1];
      gutil.log(gutil.colors.green('Mapping:',localFilePath));
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

// Let's build this sucker.
gulp.task('build', gulp.series(
  'vf-clean',
  gulp.parallel('vf-css','vf-scripts','vf-component-assets'),
  'vf-css:production', //optimise, prefix css
  'fractal:build',
  'fractal',
  'eleventy:init',
  'eleventy:build',
  'apache-config'
));

// Build and watch things during dev
gulp.task('dev', gulp.series(
  'vf-clean',
  gulp.parallel('vf-css','vf-scripts','vf-component-assets'),
  'fractal:development',
  'fractal',
  'eleventy:init',
  'eleventy:develop',
  gulp.parallel('watch','vf-watch')
));

// Build it all
gulp.task('default', gulp.series(
  'build'
));
