// объявление переменных
// -------------------------------------
const gulp = require('gulp'),
    less = require('gulp-less'), //less заменить на gulp-less
    del = require('del'),

    patch = {//создаем константу после создания файлов и папок
        styles: {
            src: 'src/styles/**/*.less',
            dest: 'dist/css/'
        },
        scripts: {
            src: 'src/scripts/**/*.js',
            dest: 'dist/js/'
        },

        // НОВАЯ ЗАПИСЬ!!!!+ СОЗДАТЬ ПАПКУ ДЛЯ КАРТИНОК ВНУТРИ КАТАЛОГА SRC
        images: {
            src: 'src/images/*',
            dest: 'dist/images'
        }
    },
    rename = require('gulp-rename'),
    cleane_css = require('gulp-clean-css'),

    // ДОБАВИЛИ НОВУЮ КОНСТАНТУ ДЛЯ ВЫЗОВА ПЛАГИНА
    imagemin = require('gulp-imagemin');


// очистка калага dist
// -----------------------------------
function clean() {//очистка каталога (ЗАПУСТИТЬ ПЕРВОЙ)
    return del(['dist'])
}


//обработка стилей
// ----------------------------------------------

function styles() {//обрабтка стилей
    return gulp.src(patch.styles.src)
        //выполнение различных действий
        .pipe(less())// компиляция и преобразовыние в css
        .pipe(cleane_css())//выполнит минификацию кода (удалит пробелы, ненужные знаки )
        .pipe(rename({
            basename: 'style', //передаем название файла
            suffix: '.min',
        }))
        .pipe(gulp.dest(patch.styles.dest))
}

// обработка скриптов
// -----------------
const babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');
function scripts() {
    return gulp.src(patch.scripts.src, {
        // передаем объект
        sourcemaps: true,
    })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('index.min.js'))
        .pipe(gulp.dest(patch.scripts.dest))//куда будет записываться файл
}


// НОВАЯ ФУНКЦИЯ!!!!!!!!!!

// обработка ИЗОБРАЖЕНИЙ
// -----------------
function image() {
    return gulp.src(patch.images.src)//изначальный путь
        .pipe(imagemin())
        .pipe(gulp.dest(patch.images.dest));//путь наначения
}


//отслеживание изменений в файллах и запуск функций в зависимости от измененного файла
// --------------------------------------------
function watch() {
    gulp.watch(patch.styles.src, styles)
    gulp.watch(patch.scripts.src, scripts)
}



// экпорт задач
// --------------------------------------------
exports.clean = clean; //задача из функции 
exports.styles = styles; //на данном этапе будет ошибка TypeError: less is not a function
exports.watch = watch;
exports.build = gulp.series(clean, gulp.parallel(styles, scripts, image), watch);//сработает если написать gulp build  ДОБАВИЛИ ЗАПУСК СЖАТИЯ ИЗОБРАЖЕНИЙ
exports.default = gulp.series(clean, gulp.parallel(styles, scripts, image), watch);
exports.scripts = scripts;


// КАРТИНКИ
exports.image = image;
