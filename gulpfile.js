const {src, dest, series, watch, parallel} = require('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const postcss = require('gulp-postcss')
const csso = require('gulp-csso')
const concat = require('gulp-concat')
const del = require('del')
const fileinclude = require('gulp-file-include')
const terser = require('gulp-terser')
const sync = require('browser-sync').create()

// HTML

const html = () => {
  return src('src/*.html')
    .pipe(fileinclude())
    .pipe(dest('docs'))
    .pipe(sync.stream())
}

exports.html = html

// Styles

const styles = () => {
  return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(postcss([
      require('postcss-import'),
      require('autoprefixer'),
    ]))
    .pipe(csso())
    .pipe(concat('index.css'))
    .pipe(dest('docs/css'))
    .pipe(sync.stream())
}

exports.styles = styles

// Styles libs

const stylesLibs = () => {
  return src([
	  'node_modules/slick-slider/slick/slick.css',
	  'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.css',
	  'node_modules/nouislider/distribute/nouislider.min.css',
	  'node_modules/air-datepicker/dist/css/datepicker.min.css',
    ])
    .pipe(concat('libs.css'))
    .pipe(dest('docs/css'))
    .pipe(sync.stream())
};

exports.stylesLibs = stylesLibs

// Scripts libs

const scriptsLibs = () => {
  return src([
	  'node_modules/jquery/dist/jquery.min.js',
	  'node_modules/slick-slider/slick/slick.min.js',
	  'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
	  'node_modules/wnumb/wNumb.min.js',
	  'node_modules/nouislider/distribute/nouislider.min.js',
	  'node_modules/in-view/dist/in-view.min.js',
	  'node_modules/dragscroll/dragscroll.js',
    ])
    .pipe(concat('libs.js'))
    .pipe(dest('docs/js'))
    .pipe(sync.stream())
};

exports.scriptsLibs = scriptsLibs

// Scripts libsDatepicker

/*const scriptsLibsDatepicker = () => {
	return src([
		'node_modules/air-datepicker/dist/js/datepicker.min.js',
	  ])
	  .pipe(concat('libsDatepicker.js'))
	  .pipe(dest('docs/js'))
	  .pipe(sync.stream())
  };

  exports.scriptsLibsDatepicker = scriptsLibsDatepicker*/

// Scripts

const scripts = () => {
  return src('src/js/*.js')
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(concat('index.js'))
    .pipe(terser())
    .pipe(dest('docs/js'))
    .pipe(sync.stream())
};

exports.scripts = scripts

// Copy

const copy = () => {
  return src(['src/fonts/**/*', 'src/img/**/*', 'src/video/**/*', 'src/js/pace/**/*'], { base: 'src' })
    .pipe(dest('docs'))
    .pipe(sync.stream({ once: true }))
};

exports.copy = copy

// Server

const server = () => {
  sync.init({
    ui: false,
    notify: false,
    server: {
      baseDir: 'docs'
    }
  });
};

exports.server = server

// Clear

const clear = () => {
  return del('docs')
}

exports.clear = clear

// Watch

const watcher = () => {
  watch('src/*.html', series(html))
  watch('src/scss/**/*.scss', series(styles))
  watch('src/js/**/*.js', series(scripts))
  watch(['src/fonts/**/*', 'src/img/**/*',], series(copy))
};

exports.watcher = watcher

// Default

exports.default = series(
  clear,
  parallel(
    html,
    stylesLibs,
    styles,
    scriptsLibs,
    //scriptsLibsDatepicker,
    scripts,
    copy,
  ),
  parallel(
    watcher,
    server,
  ),
)
