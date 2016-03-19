const gulp = require('gulp');
const del = require('del');
const typescript = require('gulp-typescript');
const tscConfig = require('./tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const tslint = require('gulp-tslint');
const browserSync = require('browser-sync').create();
const fs = require('fs');
const runSequence = require('run-sequence');
const rename = require('gulp-rename');
const historyApiFallback = require('connect-history-api-fallback');
const gulpremote = require('gulp-remote-src');

// Command `clean`
// clean the contents of the distribution directory
gulp.task('clean', function (cb) {
    del('dist/**/*').then(paths = cb());
});
// clean only the app directory (containing compiled .ts app files)
gulp.task('clean:app', function (cb) {
    del('dist/app/*').then(paths = cb());
});

// Command `copy:assets`
// copy static assets - i.e. non TypeScript compiled source
gulp.task('copy:assets', function(cb) {
    gulp.src([
        'src/app/**/*',
        'src/index.html',
        'src/.htaccess',
        'src/assets/**',
        'src/deezer-channel-jsonp.html',
        '!src/app/**/*.ts'], {base: "src"})
        .pipe(gulp.dest('dist'))
        .on('end', cb);
});

// Command `copy:libs`
// copy dependencies
gulp.task('copy:libs', function(cb) {
    // download from URL the Deezer JS SDK
    gulpremote(['dz.js'], {base: 'http://e-cdn-files.deezer.com/js/min/'})
        .pipe(gulp.dest('dist/lib'));
    /* nested-property module special load & requirements */
    gulp.src(['node_modules/util/**/*.js'])
        .pipe(gulp.dest('dist/lib/util')); // for nested-property (Unix MAX OS loading)
    gulp.src(['node_modules/assert/node_modules/util/**/*.js'])
        .pipe(gulp.dest('dist/lib/util')); // for nested-property (Windows loading)

    gulp.src(['node_modules/nested-property/index.js'])
        .pipe(rename('nested-property.js'))
        .pipe(gulp.dest('dist/lib'));
    /* end of nested-property module load */

    gulp.src([
            'node_modules/es6-shim/es6-shim.min.js',
            'node_modules/es6-shim/es6-shim.map', // required since upgrade to angular2-beta7
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system-polyfills.js.map', // required since upgrade to angular2-beta7
            'node_modules/angular2/bundles/angular2-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',
            'node_modules/rxjs/bundles/Rx.js',
            'node_modules/angular2/bundles/angular2.dev.js',
            'node_modules/angular2/bundles/router.dev.js',
            'node_modules/angular2/bundles/http.dev.js',
            'node_modules/moment/moment.js',
            'node_modules/ng2-bootstrap/bundles/ng2-bootstrap.js',
            'node_modules/assert/assert.js', // for nested-property
            'node_modules/inherits/inherits_browser.js', // for nested-property UNIX MAC OS loading
            'node_modules/assert/node_modules/util/node_modules/inherits/inherits_browser.js' // for nested-property Windows loading
        ])
        .pipe(gulp.dest('dist/lib'))
        .on('end', cb);
});

// Command `compile`
// TypeScript compile app/ directory files
gulp.task('compile', function (cb) {
    // prepare and write the app configuration file (per environment)
    var configJson = fs.readFileSync('src/config/local.json');
    fs.writeFileSync('dist/config.js',
        'exports = ' +
        configJson +
        ';'
    );

    gulp.src('**/*.ts', {cwd: 'src'},{base : '.'})
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
        .on('end', cb);
});

// copy content in build/ directory to the dist/ directory
gulp.task('deploy',function(cb){
    gulp.src('build/src/**/*')
        .pipe(gulp.dest('dist'))
        .on('end', cb);
});

// Command `tslint`
// linting code within app/ directory
gulp.task('tslint', function(cb) {
    gulp.src('src/app/**/*.ts')
        .pipe(tslint())
        .pipe(tslint.report('verbose'))
        .on('end', cb);
});

gulp.task('browsersync', function() {
    return browserSync.init({
        server: "./dist",
        middleware: [ historyApiFallback() ]
        // proxy: "deezer-dl.local" // proxify to the deezer-dl.local URL instead of serving static server
    });
});

gulp.task('watch', function() {
    gulp.watch(['src/index.html', "src/app/**/*.{html,htm,css,js}"], function() {
        browserSync.active ? runSequence('copy:assets', browserSync.reload) : gulp.run('copy:assets');
    })
    gulp.watch(['src/**/*.ts'], function() {
        browserSync.active ?
            runSequence('compile', 'deploy', browserSync.reload) :
            runSequence('compile', 'deploy');
    });
});


gulp.task('build', function(callback) {
    runSequence('compile', 'deploy', 'copy:assets', callback);
});

gulp.task('fullbuild', ['clean', 'tslint'], function(callback) {
    runSequence('copy:libs', 'build', callback);
});

gulp.task('serve', function(callback) {
    runSequence('fullbuild', 'browsersync', 'watch', callback);
});

gulp.task('default', function(callback) {
    runSequence('fullbuild', 'watch', callback);
});
