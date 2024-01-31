// первая часть для демонстрации запуска

// function defaultTask(cb) {
//     // place code for your default task here
//     cb();
// }

// exports.default = defaultTask

const gulp = require('gulp'),
    less = require('gulp-less'), //less заменить на gulp-less
    del = require('del'),
    patch = {//создаем константу после создания файлов и папок
        styles: {
            src: 'src/styles/**/*.less',
            // /**/- любая вложенность документа

            dest: 'dist/css/' //каталог заполняется файлами после компиляции, постоянно будет очищаться и заполняться новыми файлами при компиляции 
        },
        scripts: {
            src: 'src/scripts/**/*.js',
            // /**/- любая вложенность документа

            dest: 'dist/js/' //каталог заполняется файлами после компиляции, постоянно будет очищаться и заполняться новыми файлами при компиляции 
        }
    },
    rename = require('gulp-rename'),
    cleane_css = require('gulp-clean-css');

function clean() {//очистка каталога (ЗАПУСТИТЬ ПЕРВОЙ)
    return del(['dist'])
}

// // сл.шаг добавить 2 каталога: dist(финальная версия кода, после компиляции) и src(ведется разработка)



// ----------------------------обработка стилей

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


// --------------------------------------------
// создаем функцию для автоатизации 
function watch() {
    gulp.watch(patch.styles.src, styles)//в скобках записываются файлы, которые необходимо отслеживаь, а еврнее их изменения
    gulp.watch(patch.scripts.src, scripts)//отслеживание изменения скриптов
}


exports.clean = clean; //задача из функции 
exports.styles = styles; //на данном этапе будет ошибка TypeError: less is not a function
// https://www.npmjs.com/package/gulp-less переустановка модуля
// "less": "^4.2.0" - удалить 
exports.watch = watch;
// запустить задачу и отследить изменения файла
// чтобы остановить задачу - ctrl + c
// gulp 

// const build = 
// series для любого кол-ва, созданных задач
// позволяет выполнять задачи последовательно
// parallal позволяет выполнять задачи пара-о

exports.build = gulp.series(clean, gulp.parallel(styles, scripts), watch);//сработает если написать gulp build


// exports.default = gulp.series(clean, styles, watch);//сработает если просто написать gulp

exports.default = gulp.series(clean, gulp.parallel(styles, scripts), watch);


// -----------------
// обработка скриптов

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

exports.scripts = scripts;
