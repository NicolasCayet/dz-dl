const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const gulpremote = require('gulp-remote-src');
const tslint = require('gulp-tslint');

// clean the contents of the distribution directory
gulp.task('clean', function () {
    return del('dist/*');
});

// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', ['clean'], function() {
    return gulp.src(['src/**', '.htaccess', 'index.html', 'deezer-channel-jsonp.html', '!src/**/*.ts'])
        .pipe(gulp.dest('dist'))
});
// copy dependencies
gulp.task('copy:libs', ['clean'], function() {
    gulpremote(['dz.js'], {base: 'http://e-cdn-files.deezer.com/js/min/'})
        .pipe(gulp.dest('dist/lib'));
    return gulp.src([
        'node_modules/es6-shim/es6-shim.min.js',
        'node_modules/systemjs/dist/system-polyfills.js',
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/angular2/bundles/angular2.dev.js',
        'node_modules/angular2/bundles/router.dev.js',
        'node_modules/angular2/bundles/http.dev.js'
    ])
        .pipe(gulp.dest('dist/lib'));
});

// linting
gulp.task('tslint', function() {
    return gulp.src('src/app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

// TypeScript compile
gulp.task('compile', ['clean'], function () {
    return gulp
        .src('src/app/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/app'));
});

// re-build all the project when a .ts file change
// use this task for watching changes during development
gulp.task('watch', function() {
    gulp.watch(['src/**'], ['build']);
});

gulp.task('build', ['compile', 'copy:assets', 'copy:libs']);
gulp.task('fullbuild', ['tslint', 'build']);
gulp.task('default', ['fullbuild']);