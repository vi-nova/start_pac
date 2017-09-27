var gulp = require('gulp'),
minifyCss = require('gulp-clean-css'),
rename = require('gulp-rename'),
prefixer = require('gulp-autoprefixer'),
notify = require('gulp-notify'),
livereload = require('gulp-livereload'),
connect = require('gulp-connect'),
plumber = require('gulp-plumber'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
cssmin = require('gulp-clean-css'),
spritesmith = require('gulp.spritesmith'),
imagemin = require('gulp-imagemin'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
concatCss = require('gulp-concat-css');


// server connect
gulp.task('connect', function() {
  connect.server({
    root: './public',
    livereload: true
  });
});

// html
gulp.task('html', function() {
	gulp.src('./src/index.html')
	.pipe(plumber())
	.pipe(gulp.dest('./public'))
	.pipe(connect.reload());
})

// styles
gulp.task('style', function () {
    gulp.src('./src/styles/*.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(prefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(sourcemaps.init())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(connect.reload());
});
// js
gulp.task('js', function () {
    gulp.src('./src/js/*.js')
        .pipe(plumber())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js'))
        .pipe(connect.reload());
});

// sprites
gulp.task('sprite', function () {
    var spriteData = gulp.src('./src/image/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss'
        }));
    return spriteData.img.pipe(gulp.dest('./src/image'));
    
});

// image
gulp.task('image', function () {
    gulp.src('./src/image/**.*')
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest('./public/image'))
        .pipe(connect.reload());
});
// fonts
gulp.task('fonts', function() {
    gulp.src('./src./fonts')
        .pipe(plumber())
        .pipe(gulp.dest('./public/fonts'))
});
// build
gulp.task('build', [
    'html',
    'js',
    'style',
    'fonts',
    'image'
]);

// watch
gulp.task('watch', function(){
    gulp.watch('./src/**/*.html', function() {
        gulp.start('html');
    });
    gulp.watch('./src/styles/**/*.scss', function() {
        gulp.start('style');
    });
    gulp.watch('./src/js/**/*.js', function() {
        gulp.start('js');
    });
    gulp.watch('./src/image/**/*.*', function() {
        gulp.start('image');
    });
    gulp.watch('./src/fonts/**/*.*', function() {
        gulp.start('fonts');
    });
});


// default
gulp.task('default', ['build', 'connect', 'watch']);