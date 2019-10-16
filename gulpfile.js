const gulp = require('gulp');
const validator = require('gulp-html');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const sourcemaps = require('gulp-sourcemaps');
const inject = require('gulp-inject');

let sass = require('gulp-sass');
const sassGlob  = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
sass.compiler = require('node-sass');

var ts = require('gulp-typescript');
var merge = require('merge2');
var tsProject = ts.createProject('tsconfig.json');

const node_modules = [
    './node_modules/normalize.css/normalize.css'
];

const html = () => {
    var target = gulp.src('./src/**/*.html');
    var sources = gulp.src(['./dist/**/*.js', './dist/**/*.css'], {read: false});
    return target.pipe(inject(sources, {
            ignorePath: ['dist']
        }))
        .pipe(validator())
        .pipe(gulp.dest('./dist'));
};
gulp.task('html', html);

const styles = () => {
    return gulp.src('./src/**/*.scss')
        .pipe(sassGlob())
        .pipe(sass({includePaths: ['node_modules']}).on('error', sass.logError))
        .pipe(autoprefixer({cascade: false}))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./dist'));
};
gulp.task('styles', styles);

const nodeModules = () => {
    return gulp.src(node_modules)
        .pipe(gulp.dest('./dist/node_modules'));
};
gulp.task('node_modules', nodeModules);

const img = () => {
    return gulp.src('./src/**/*.{jpg,png,svg,gif}')
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ]))
        .pipe(gulp.dest('./dist'));
}
gulp.task('img', img);

const imgwebp = () => {
    return gulp.src('./src/**/*.{jpg,png}')
        .pipe(webp())
        .pipe(gulp.dest('./dist'));
};
gulp.task('imgwebp', imgwebp);

const scripts = () => {
    var tsResult = gulp.src('./src/ts/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject());
 
    return merge([
        tsResult.dts.pipe(gulp.dest('./dist/types')),
        tsResult.js.pipe(sourcemaps.init()).pipe(gulp.dest('./dist/js'))
    ]);
};
gulp.task('scripts', scripts);

gulp.task('watchHtml', () => gulp.watch(['./src/**/*.html'], html));
gulp.task('watchStyles', () => gulp.watch(['./src/**/*.scss'], styles));
gulp.task('watchImg', () => gulp.watch(['./src/**/*.{jpg,png,svg,gif}'], img));
gulp.task('watchWebp', () => gulp.watch(['./src/**/*.{jpg,png}'], imgwebp));
gulp.task('watchScripts', () => gulp.watch(['./src/**/*.ts'], scripts));


exports.serve = gulp.series(gulp.parallel('styles', 'img', 'imgwebp', 'scripts', 'node_modules'), 'html', gulp.parallel('watchHtml', 'watchStyles', 'watchImg', 'watchWebp', 'watchScripts'));
exports.default = gulp.series(gulp.parallel('styles', 'img', 'imgwebp', 'scripts', 'node_modules'), 'html');