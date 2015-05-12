// Gulp
var gulp = require('gulp');

// Plugins
var autoprefix = require('gulp-autoprefixer');
var bowerFiles = require('main-bower-files');
var bower = require('gulp-bower');
var browserSync = require('browser-sync');
var concat = require('gulp-concat');
var cache = require('gulp-cache');
var cp = require('child_process');
var del = require('del');
var debug = require('gulp-debug');
var flatten = require('gulp-flatten');
var imagemin = require('gulp-imagemin');
var jshint = require('gulp-jshint');
var minifyCSS = require('gulp-minify-css');
var notify = require('gulp-notify'); // requires Growl on Windows
var path = require('path');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

// Define our paths
var paths = {
	scripts: 'js/**/*.js',
	styles: 'sass/**/*.scss',
	fonts: 'sass/fonts/**/*',
	images: 'images/**/*.{png,jpg,jpeg,gif,svg}',
	html: ['_posts/*.{html,md}', '_includes/*.{html,md}', '_layouts/*.{html,md}', '*.{html,md}'],
	bowerDir: './bower_components'
};

var destPaths = {
	scripts: '_site/build/js',
	styles: '_site/build/css',
	fonts: '_site/build/fonts',
	images: '_site/build/images'
};

// Error Handling
// Send error to notification center with gulp-notify
var handleErrors = function() {
	notify.onError({
		title: "Compile Error",
		message: "<%= error.message %>"
	}).apply(this, arguments);
	this.emit('end');
};

gulp.task('jekyll', function(done) {
	browserSync.notify('Compiling Jekyll');
	return cp.spawn('jekyll.bat', ['build'], {stdio:'inherit'})
		.on('close', done);
});

gulp.task('bower', function() {
	return bower()
		.pipe(gulp.dest(paths.bowerDir));
});

//Make any bower-installed css files scss to prevent extra requests
gulp.task('css-to-scss', function() {
	return bowerFiles('**/*.css').map(function(file) {
		gulp.src(file)
			.pipe(rename(function(path) {
				path.basename = '_'+path.basename;
				path.basename = path.basename.replace('.min', '');
				path.extname = '.scss';
			}))
			.pipe(gulp.dest(path.dirname(file)));
	});
});

// Compile our Sass
gulp.task('styles', function() {
	return gulp.src(paths.styles)
		.pipe(plumber())
		.pipe(sass({
			errLogToConsole:true,
			includePaths: bowerFiles('**/*.{scss,sass,css}').map(function(file) {
				return path.dirname(file);
			})
		}))
		.on('error', handleErrors)
		.pipe(autoprefix())
		.pipe(rename('style.css'))
		.pipe(gulp.dest(destPaths.styles))
		.pipe(notify('Styles task complete!'));
});

// Compile our Sass
gulp.task('build-styles', function() {
	return gulp.src(paths.styles)
		.pipe(plumber())
		.pipe(sass({
			errLogToConsole:true,
			includePaths:bowerFiles('**/*.{scss,sass,css}').map(function(file) {
				return path.dirname(file);
			})
		}))
		.pipe(autoprefix({cascade:false}))
		.pipe(minifyCSS())
		.pipe(rename('style.css'))
		.pipe(gulp.dest(destPaths.styles))
		.pipe(notify('Build styles task complete!'));
});


// Lint, minify, and concat our JS
gulp.task('scripts', function() {
	return gulp.src(bowerFiles(
			['**/*.js'], 
			{
				includeSelf:true
			}
		), {base: 'bower_components'})
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest(destPaths.scripts))
		.pipe(notify('Scripts tasks complete!'));
});

gulp.task('build-scripts', function() {
	return gulp.src(bowerFiles(
			['**/*.js'], 
			{
				includeSelf:true
			}
		), {base: 'bower_components'})
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(uglify())
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest(destPaths.scripts))
		.pipe(notify('Scripts tasks complete!'));
	});

/*gulp.task('clean-images', function(cb) {
	del([destPaths.images], cb);
});*/

// Compress Images
gulp.task('images', function() {
	return gulp.src(paths.images)
		.pipe(plumber())
		.pipe(gulp.dest(destPaths.images))
		.pipe(notify('Image optimized!'));
});

// Compress Images for Build
gulp.task('build-images', function() {
	return gulp.src(paths.images)
		.pipe(plumber())
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(destPaths.images))
		.pipe(notify('Image optimized!'));
});

// Watch for changes made to files
gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['styles']);
	gulp.watch(paths.images, ['images']);
	gulp.watch(paths.html, ['jekyll']);
});

// Browser Sync - autoreload the browser
// Additional Settings: http://www.browsersync.io/docs/options/
gulp.task('browser-sync', function () {
	var files = [
		'**/*'
	];
	browserSync.init(files, {
		server: {
			baseDir:'./_site'
		}
	});
});

gulp.task('clean', function(cb) {
	//return gulp.src('build').pipe(clean());
	del(['build'], cb);
});

gulp.task('clear-cache', function() {
	cache.clearAll();
});

gulp.task('move-fonts', function() {
	return gulp.src(bowerFiles(
			['**/*.eot', '**/*.woff', '**/*.woff2', '**/*.svg', '**/*.ttf'], 
			{
				includeSelf:true
			}
		), {base: 'bower_components'})
	.pipe(flatten())
	.pipe(gulp.dest(destPaths.fonts));
});

// Default Task
gulp.task('default', function(cb) {
	runSequence('jekyll', 'css-to-scss', 'clean', 'clear-cache' ,'images', 'scripts', 'styles', 'move-fonts', 'browser-sync', 'watch', cb);
});

// Build Task
gulp.task('build', function(cb) {
	runSequence('jekyll', 'css-to-scss', 'clean', 'clear-cache', 'build-images', 'build-scripts', 'build-styles', 'move-fonts', cb);
});
