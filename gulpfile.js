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
			html: [`./src/RFID_Monitoring/index.html`],
			css: [`./src/RFID_Monitoring/index.scss`],
			js: [`./src/app.js`],
			api: [`./src/RFID_Monitoring/api/api.js`],
			lure: ['./src/RFID_Monitoring/lure/lure.css',
				'./src/RFID_Monitoring/lure/lure.full.js',
				'./src/RFID_Monitoring/lure/lure.full.js.map',
				'./src/RFID_Monitoring/lure/lure.full.min.js',
				'./src/RFID_Monitoring/lure/lure.min.css'],
			img: [`./src/RFID_Monitoring/img/**/*`]
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

gulp.task(`app`, function() {
	browserify({
		entries: src.js,
		debug: true
	})
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

gulp.task(`default`, [`html`, `css`, `app`, `image`, `api`, `lure`, `watcher`]);