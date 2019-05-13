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
			js: [`./src/RFID_Monitoring.js`],
			api: [`./src/api/api.js`],
			lure: ['./src/lure/lure.css', './src/lure/lure.full.js', './src/lure/lure.full.js.map', './src/lure/lure.full.min.js', './src/lure/lure.min.css'],
			img: [`./src/img/**/*`]
		};

gulp.task(`lure`, function () {
	gulp.src(src.lure)
		.pipe(gulp.dest(`./dist/lure`))
});

gulp.task(`html`, function() {
	gulp.src(src.html)
	.pipe(gulp.dest(`./dist`))
});

gulp.task(`image`, function() {
    gulp.src(src.img)
        .pipe(gulp.dest(`./dist/img`))
});

gulp.task(`css`, function() {
	gulp.src(src.css)
	.pipe(sass())
	.pipe(gulp.dest(`./dist`))
});

gulp.task(`RFID_Monitoring`, function() {
	browserify(src.js)
	.bundle()
		.on(`error`, function (e) {
			console.log(e.toString());
        })
	.pipe(source(`RFID_Monitoring.js`))
	.pipe(gulp.dest(`./dist`))
});

gulp.task(`api`, function() {
        gulp.src(src.api)
        .pipe(gulp.dest(`./dist`))
});

gulp.task(`watcher`, function() {
	gulp.watch(src.html, [`html`]);
    gulp.watch(`./src/**/*.scss`, [`css`]);
    gulp.watch(`./src/**/*.js`, [`RFID_Monitoring`]);
});

gulp.task(`default`, [`html`, `css`, `RFID_Monitoring`, `image`, `api`, `lure`, `watcher`]);