var gulp = require('gulp'),
    less = require('gulp-less'),
    cssmin = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync').create(), //引入browser模块
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    options= {    //html压缩插件配置项，默认都是false
        collapseWhitespace:true,  
        //压缩HTML
        collapseBooleanAttributes:true,   
        //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeComments:true,
        //清除HTML注释
        removeEmptyAttributes:true,
        //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes:true,
        //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes:true,
        //删除<style>和<link>的type="text/css"
        minifyJS:true,
        //压缩页面JS
        minifyCSS: true
        //压缩页面CSS
    };
 //less编译并压缩任务
gulp.task('testLess', function () {
    //编译src目录下的所有less文件
    //除了reset.less和test.less（**匹配src/less的0个或多个子文件夹）
    gulp.src(['src/less/*.less', '!src/less/**/{reset,test}.less']) 
        .pipe(less())
        .pipe(cssmin({"compatibility":'ie7', //启用兼容模式兼用IE7以下次写法
        	          "keepSpectalComments":"*" //保留所有特殊前缀，不加这个参数，有可能将会删除你的部分前缀
        	      }))
        .pipe(gulp.dest('src/css'));
});
//合并所有css
gulp.task('concatcss', function() {
    return gulp.src('src/css/*.css')
        .pipe(concat('all.css'))    //合并所有css到main.css
        .pipe(gulp.dest('build'))   //输出main.css
});   
//压缩js任务
gulp.task('minifyjs', function() {
    return gulp.src('src/js/*.js')
        .pipe(uglify())    //压缩
        .pipe(gulp.dest('src/js/min'));  //输出
});
//合并所有js任务
gulp.task('concatjs', function() {
    return gulp.src('src/js/min/*.js')
        .pipe(concat('all.js'))    //合并所有js到main.js
        .pipe(gulp.dest('build'))    //输出main.js到文件夹
});
//压缩html任务
gulp.task('html',function(){
     return gulp.src('index.html')
            .pipe(htmlmin(options))     //压缩html
            .pipe(concat('text.html'))  //合并html,用来创建输出文件名
            .pipe(gulp.dest('build'));  //输出目录和原来文件同目录,压缩后不用修改其他文件路径          
});
//browser自动刷新任务
gulp.task('default', function () {
    browserSync.init({
        server: {
            baseDir:'./'
         }   //配置服务器，监控根目录
    });
    gulp.watch('src/**/*.less', ['testLess']); //当所有less文件发生改变时，调用testLess任务
    gulp.watch('src/**/*.css',['concatcss']);
    gulp.watch('src/**/*.js',['minifyjs']);
    gulp.watch('src/**/*.js',['concatjs']); 
    gulp.watch('./*.html',['html']); 
    gulp.watch('build/*.css',function() {   //自动刷新，各目录分开监控
        browserSync.reload();
    }); 
    gulp.watch('index.html',function() {
        browserSync.reload();
    }); 
    gulp.watch('build/*.js',function() {
        browserSync.reload();
    });  
});