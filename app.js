var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var ueditor = require("ueditor");

/* 接口地址 */
var index = require('./routes/index');
var users = require('./routes/users');
var picture = require('./routes/picture');  /* 图片 */
var course = require('./routes/course');    /* 课程信息 */
var teacher = require('./routes/teacher');  /* 教师信息 */
var news = require('./routes/news');        /* 新闻动态信息 */
var school = require('./routes/school');     /* 学校信息 */
var courseType = require('./routes/courseType');    /* 课程类别信息 */

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser('session-common-id'));
app.use(session({
    name:'session-common-id',
    secret: 'session-common-id',
    store: new FileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
    cookie: {maxAge: 60 * 1000 * 30},  //设置maxAge失效过期
    resave: false,// 是否每次都重新保存会话，建议false
    saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

/* 路由划分 */
app.use('/', index);
app.use('/users', users);
app.use('/picture', picture);
app.use('/course', course);
app.use('/teacher', teacher);
app.use('/news', news);
app.use('/school', school);
app.use('/courseType', courseType)

app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    var imgDir = '/img/ueditor/' //默认上传地址为图片
    var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认上传地址为图片
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/file/ueditor/'; //附件保存地址
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/video/ueditor/'; //视频保存地址
        }
        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
    }
    //客户端发起图片列表请求
    else if (ActionType === 'listimage'){

        res.ue_list(imgDir);  // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/ueditor/nodejs/config.json')
    }
}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
    res.render('error');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
