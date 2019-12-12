/*
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
* * * * * ==============================
========================================
========================================
========================================
----------------------------------------
USWDS SASS GULPFILE
----------------------------------------
*/

var autoprefixer  = require('autoprefixer');
var autoprefixerOptions = require('./node_modules/uswds-gulp/config/browsers');
var cssnano       = require('cssnano');
var gulp          = require('gulp');
var mqpacker      = require('css-mqpacker');
var notify        = require('gulp-notify');
var path          = require('path');
var pkg           = require('./node_modules/uswds/package.json');
var postcss       = require('gulp-postcss');
var rename        = require('gulp-rename');
var replace       = require('gulp-replace');
var sass          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var uswds         = require('./node_modules/uswds-gulp/config/uswds');
// var uglify        = require('gulp-uglify'),
//     concat        = require("gulp-concat"),
//     jshint        = require("gulp-jshint");

/*
----------------------------------------
PATHS
----------------------------------------
- All paths are relative to the
  project root
- Don't use a trailing `/` for path
  names
----------------------------------------
*/

// Project Sass source directory
const PROJECT_SASS_SRC = './assets/sass';

// Images destination
const IMG_DEST = './assets/img';

// Fonts destination
const FONTS_DEST = './assets/fonts';

// Javascript destination
const PROJECT_JS_DEST = './assets/js/dist';

// Javascript source
const PROJECT_JS_SRC = './assets/js/src';

// Compiled CSS destination
const CSS_DEST = './assets/css';
const CSS_DEST2 = './_site/assets/css';

/*
----------------------------------------
TASKS
----------------------------------------
*/

gulp.task('copy-uswds-setup', () => {
  return gulp.src(`${uswds}/scss/theme/**/**`)
  .pipe(gulp.dest(`${PROJECT_SASS_SRC}`));
});

gulp.task('copy-uswds-fonts', () => {
  return gulp.src(`${uswds}/fonts/**/**`)
  .pipe(gulp.dest(`${FONTS_DEST}`));
});

gulp.task('copy-uswds-images', () => {
  return gulp.src(`${uswds}/img/**/**`)
  .pipe(gulp.dest(`${IMG_DEST}`));
});

gulp.task('copy-uswds-js', () => {
  return gulp.src(`${uswds}/js/**/**`)
  .pipe(gulp.dest(`${PROJECT_JS_DEST}`));
});

gulp.task('build-sass', function(done) {
  var plugins = [
    // Autoprefix
    autoprefixer(autoprefixerOptions),
    // Pack media queries
    mqpacker({ sort: true }),
    // Minify
    cssnano(({ autoprefixer: { browsers: autoprefixerOptions }}))
  ];
  return gulp.src([
      `${PROJECT_SASS_SRC}/*.scss`
    ])
    .pipe(replace(
      /\buswds @version\b/g,
      'uswds v' + pkg.version
    ))
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(sass({
        includePaths: [
          `${PROJECT_SASS_SRC}`,
          `${uswds}/scss`,
          `${uswds}/scss/packages`,
        ]
      }))
    .pipe(postcss(plugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(`${CSS_DEST}`))
    .pipe(gulp.dest(`${CSS_DEST2}`))
    .pipe(notify({
      "sound": "Pop" // case sensitive
    }));
});

gulp.task('init', gulp.series(
  'copy-uswds-setup',
  'copy-uswds-fonts',
  'copy-uswds-images',
  'copy-uswds-js',
  'build-sass',
));


gulp.task('compile', function (done) {
  return gulp.src(`${PROJECT_JS_SRC}/**/*.js`) // path to your files
  // .pipe(jshint())
  // .pipe(jshint.reporter()) // Dump results
  // .pipe(uglify())
  .pipe(concat('base.js'))
  .pipe(gulp.dest(`${PROJECT_JS_DEST}`));
});

gulp.task('watch-code', function () {
  gulp.watch(`${PROJECT_SASS_SRC}/**/*.scss`, gulp.series('build-sass'));
  // gulp.watch(`${PROJECT_JS_SRC}/**/*.js`, gulp.series('compile'));
});

gulp.task('watch', gulp.series('build-sass', 'watch-code'));

gulp.task('default', gulp.series('watch'));
