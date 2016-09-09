var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var foreach = require('gulp-foreach');
var htmlmin = require('gulp-htmlmin');
var notify = require("gulp-notify");
var preen = require('preen');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');
var del = require('del');

var paths = {
    sass: ['scss/**/*.scss'],
    index: 'app/index.html',
    scripts: ['app/js/app.js', 'app/js/**/*.js'],
    styles: 'app/scss/**/*.*',
    templates: 'app/templates/**/*.*',
    images: 'app/img/**/*.*',
    lib: 'www/lib/**/*.*',
    //Destination folders
    destImages: './www/img/',
    destTemplates: './www/templates/'
};

gulp.task('default', ['sass', 'index', 'scripts', 'styles', 'templates', 'images', 'lib']);

gulp.task('serve', function (done) {
    sh.exec('ionic serve', done);
});

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('index', function () {
    return gulp.src(paths.index)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("./www/"))
        .pipe(notify({ message: 'Index built' }));
});

gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat("app.js"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./www/build/"))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("./www/build/"))
        .pipe(notify({ message: 'Scripts built' }));
});

gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 version'))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./www/css/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifyCss())
        .pipe(gulp.dest('./www/css/'))
        .pipe(notify({ message: 'Styles built' }));
});

function MinifyTemplates(path, destPath) {
    return gulp.src(path)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(destPath || paths.destTemplates));
}

gulp.task('templates', ['clean-templates'], function () {
    return MinifyTemplates(paths.templates).on('end', function () {
        gulp.src('').pipe(notify({ message: 'Templates built' }))
    });
});

function MinifyImages(path, destPath) {
    return gulp.src(path)
        .pipe(imagemin({ optimizationLevel: 5 }))
        .pipe(gulp.dest(destPath || paths.destImages));
}

gulp.task('images', ['clean-images'], function () {
    return MinifyImages(paths.images).on('end', function () {
        gulp.src('').pipe(notify({ message: 'Images built' }))
    });
});

gulp.task('lib', function (done) {
    //https://forum.ionicframework.com/t/how-to-manage-bower-overweight/17997/10?u=jdnichollsc
    preen.preen({}, function () {
        gulp.src('').pipe(notify({ message: 'Lib built' }));
        done();
    });
});

gulp.task('clean-images', function () {
    return del(paths.destImages);
});

gulp.task('clean-templates', function () {
    return del(paths.destTemplates);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.index, ['index']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.templates, function (event) {
        var destPathFile = path.join('./www', path.relative(path.join(__dirname, './app'), event.path));
        if (event.type === "deleted") {
            del(destPathFile);
        } else {
            var pathFile = path.relative(__dirname, event.path);
            var destPath = path.dirname(destPathFile);
            MinifyTemplates(pathFile, destPath).on('end', function () {
                gulp.src('').pipe(notify({ message: 'Template built' }))
            });
        }
    });
    gulp.watch(paths.images, function (event) {
        var destPathFile = path.join('./www', path.relative(path.join(__dirname, './app'), event.path));
        if (event.type === "deleted") {
            del(destPathFile);
        } else {
            var pathFile = path.relative(__dirname, event.path);
            var destPath = path.dirname(destPathFile);
            MinifyImages(pathFile, destPath).on('end', function () {
                gulp.src('').pipe(notify({ message: 'Image built' }))
            });
        }
    });
    gulp.watch(paths.lib, ['lib']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

/* GitHub Page - http(s)://<username>.github.io/<projectname>
   TODO: Execute the following steps if you don't want to publish your code to GitHub Pages like a demo.
   - Uninstall the gulp plugins from package.json: 
        npm uninstall gulp-gh-pages --save-dev
        npm uninstall merge2 --save-dev 
   - Remove the folder './gh-pages'
   - Remove the code below
*/
var ghPages = require('gulp-gh-pages');
var merge2  = require('merge2');

gulp.task('deploy-files', function () {
    var sourcePath = [
        './www/**/*',
        '!./www/pre.db'
    ];
    return merge2(
        gulp.src('./gh-pages/**/*'),
        gulp.src(sourcePath, { base: './' })
    )
    .pipe(ghPages());
});

gulp.task('deploy', ['deploy-files'], function () {
    gulp.src('').pipe(notify({ message: 'GitHub Page updated' }));
});