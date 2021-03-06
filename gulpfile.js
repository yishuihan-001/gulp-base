var gulp = require("gulp");
var gutil = require("gulp-util");
var uglify = require("gulp-uglify");
var watchPath = require("gulp-watch-path");
var combiner = require("stream-combiner2");
var sourcemaps = require("gulp-sourcemaps");
var minifycss = require("gulp-minify-css");
var autoprefixer = require('gulp-autoprefixer');
var less = require("gulp-less");
var imagemin = require("gulp-imagemin");
// var sass = require('gulp-ruby-sass')

// var handlebars = require('gulp-handlebars');
// var wrap = require('gulp-wrap');
// var declare = require('gulp-declare');


// 异常捕获
var handleError = function (err) {
    var colors = gutil.colors;
    console.log("\n");
    gutil.log(colors.red("Error!"));
    gutil.log("fileName: " + colors.red(err.fileName));
    gutil.log("lineNumber: " + colors.red(err.lineNumber));
    gutil.log("message: " + err.message);
    gutil.log("plugin: " + colors.yellow(err.plugin))
}
// 监听单一js文件改变并重新编译该文件
gulp.task("watchjs", function () {
    gulp.watch("src/js/**/*.js", function (event) {
        var paths = watchPath(event, "src/", "dist/");
        // paths{
        //     srcPath: "src/js/log.js",
        //     srcDir: "src/js/",
        //     distPath: "dist/js/log.js",
        //     distDir: "dist/js",
        //     srcFilename: "log.js",
        //     disFilename: "log.js"
        // }
        gutil.log(gutil.colors.green(event.type) + " " + paths.srcPath);
        gutil.log("Dist " + paths.distPath);
        // gutil.src(paths.srcPath)
        //     .pipe(uglify())
        //     .pipe(gulp.dest(paths.disDir))
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            uglify(),
            sourcemaps.write("./"),
            gulp.dest(paths.distDir)
        ]);
        combined.on("error", handleError)
    })
});
// 编译所有js文件
gulp.task("uglifyjs", function () {
    var combined = combiner.obj([
        gulp.src("src/js/**/*.js"),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write("./"),
        gulp.dest("dist/js/")
    ]);
    combined.on("error", handleError)
});

// 监听单一css文件改变并重新压缩该文件
gulp.task("watchcss", function () {
    gulp.watch("src/css/**/*.css", function (event) {
        var paths = watchPath(event, "src/", "dist/");
        gutil.log(gutil.colors.green(event.type) + " " + paths.srcPath);
        gutil.log("Dist " + paths.distPath);
        gulp.src(paths.srcPath)
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: "last 2 versions"
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest(paths.distDir))
    })
});
// 压缩所有css文件
gulp.task("minifycss", function () {
    gulp.src("src/css/**/*.css")
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: "last 2 versions"
        }))
        .pipe(minifycss())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist/css/"))
});

// 监听单一less文件改变并重新编译该文件
gulp.task("watchless", function () {
    gulp.watch("src/less/**/*.less", function (event) {
        var paths = watchPath(event, "src/less/", "dist/css/");
        gutil.log(gutil.colors.green(event.type) + " " + paths.srcPath);
        gutil.log("Dist " + paths.distPath);
        var combined = combiner.obj([
            gulp.src(paths.srcPath),
            sourcemaps.init(),
            autoprefixer({
                browsers: "last 2 versions"
            }),
            less(),
            minifycss(),
            sourcemaps.write("./"),
            gulp.dest(paths.distDir)
        ]);
        combined.on("error", handleError)
    })
});
// 编译所有less文件
gulp.task("lesscss", function () {
    var combined = combiner.obj([
        gulp.src("src/less/**/*.less"),
        sourcemaps.init(),
        autoprefixer({
            browsers: "last 2 versions"
        }),
        less(),
        minifycss(),
        sourcemaps.write("./"),
        gulp.dest("dist/css/")
    ]);
    combined.on("error", handleError)
});

// 监听单一image文件改变并重新编译该文件
gulp.task("watchimage", function () {
    gulp.watch("src/images/**/*", function (event) {
        var paths = watchPath(event, "src/", "dist/");
        gutil.log(gutil.colors.green(event.type) + " " + paths.srcPath);
        gutil.log("Dist " + paths.distPath);
        gulp.src(paths.srcPath)
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest(paths.distPath))
    })
});
// 编译所有image文件
gulp.task("image", function () {
    gulp.src("src/images/**/*")
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest("dist/images"))
});

// 配置监听单一文件复制任务
gulp.task("watchcopy", function () {
    gulp.watch("src/fonts/**/*", function (event) {
        var paths = watchPath(event);
        gutil.log(gutil.colors.green(event.type) + " " + paths.srcPath);
        gutil.log("Dist" + paths.distPath);
        gulp.src(paths.srcPath)
            .pipe(gulp.dest(paths.distDir))
    })
});
// 配置所有文件复制任务
gulp.task("copy", function () {
    gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts/"))
});

// 监听单一sass文件改变并重新编译该文件
// gulp.task('watchsass',function () {
//     gulp.watch('src/sass/**/*', function (event) {
//         var paths = watchPath(event, 'src/sass/', 'dist/css/')
//         gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
//         gutil.log('Dist ' + paths.distPath)
//         sass(paths.srcPath)
//             .on('error', function (err) {
//                 console.error('Error!', err.message);
//             })
//             .pipe(sourcemaps.init())
//             .pipe(minifycss())
//             .pipe(autoprefixer({
//               browsers: 'last 2 versions'
//             }))
//             .pipe(sourcemaps.write('./'))
//             .pipe(gulp.dest(paths.distDir))
//     })
// })
// 编译所有sass文件
// gulp.task('sasscss', function () {
//         sass('src/sass/')
//         .on('error', function (err) {
//             console.error('Error!', err.message);
//         })
//         .pipe(sourcemaps.init())
//         .pipe(minifycss())
//         .pipe(autoprefixer({
//           browsers: 'last 2 versions'
//         }))
//         .pipe(sourcemaps.write('./'))
//         .pipe(gulp.dest('dist/css'))
// })

// 监听单一模板文件改变并重新编译该文件
// gulp.task('watchtemplates', function () {
//     gulp.watch('src/templates/**/*', function (event) {
//         var paths = watchPath(event, 'src/', 'dist/')
//         gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
//         gutil.log('Dist ' + paths.distPath)
//         var combined = combiner.obj([
//             gulp.src(paths.srcPath),
//             handlebars({
//               // 3.0.1
//               handlebars: require('handlebars')
//             }),
//             wrap('Handlebars.template(<%= contents %>)'),
//             declare({
//               namespace: 'S.templates',
//               noRedeclare: true
//             }),
//             gulp.dest(paths.distDir)
//         ])
//         combined.on('error', handleError)
//     })
// })
// 编译所有模板文件
// gulp.task('templates', function () {
//         gulp.src('src/templates/**/*')
//         .pipe(handlebars({
//           // 3.0.1
//           handlebars: require('handlebars')
//         }))
//         .pipe(wrap('Handlebars.template(<%= contents %>)'))
//         .pipe(declare({
//           namespace: 'S.templates',
//           noRedeclare: true
//         }))
//         .pipe(gulp.dest('dist/templates'))
// })

gulp.task("default", [
    // build
    "uglifyjs", "minifycss", "lesscss", "image", "copy",
    // watch
    "watchjs", "watchcss", "watchless", "watchimage", "watchcopy"
])




