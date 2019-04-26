const   gulp = require('gulp'),
	    clean = require('gulp-clean'),
	    gulpSequence = require('gulp-sequence'),
        uglify = require('gulp-uglify'), 
        concat = require('gulp-concat'),
        csso = require('gulp-csso'), 
        sass = require('gulp-sass'),
	    prefixer = require('gulp-autoprefixer'),
	    sourcemaps = require('gulp-sourcemaps'),
		rename = require('gulp-rename'),
		source = require('vinyl-source-stream'),
		browserify = require('browserify'),
		buffer = require('vinyl-buffer'),	
	    babel = require('gulp-babel'),
	    include = require("gulp-include"),
		watch = require('gulp-watch'),
		src = {
			html: [`./src/index.html`],
			css: [`./src/index.scss`],
			js: [`./src/app.js`],
			api: [`./src/api/api.js`]
		};

gulp.task(`html`, function() {
	gulp.src(src.html)
	.pipe(gulp.dest(`./dist`))
});

gulp.task(`css`, function() {
	gulp.src(src.css)
	.pipe(sass())
	.pipe(gulp.dest(`./dist`))
});

gulp.task(`app`, function() {
	browserify(src.js)
	.bundle()
		.on(`error`, function (e) {
			console.log(e.toString());
        })
	.pipe(source(`app.js`))
	.pipe(gulp.dest(`./dist`))
});

gulp.task(`api`, function() {
        gulp.src(src.api)
        .pipe(gulp.dest(`./dist`))
});

gulp.task(`watcher`, function() {
	gulp.watch(src.html, [`html`]);
	gulp.watch(`./src/**/*.scss`, [`css`]);
	gulp.watch(`./src/**/*.js`, [`app`]);
});

gulp.task(`default`, [`html`, `css`, `app`, `api`, `watcher`]);