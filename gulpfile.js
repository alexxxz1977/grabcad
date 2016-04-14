var gulp = require('gulp');
var connect = require('gulp-connect');
var nodemon = require('gulp-nodemon');

gulp.task('client', function () {
    connect.server({
        root: "./client/",
        livereload: false,
        port: 3000
    });
});


gulp.task('server', function () {
    nodemon({
        script: './server/server.js'
        , ext: 'js html'
        , env: {'NODE_ENV': 'development'}
    })
});