var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




module.exports = app;

// processor.registerProcessor('com.java.core.rpc.thrift.service.IThriftTestService',thriftTestService);
// processor.registerProcessor('com.java.core.rpc.thrift.service.IThriftInfoTestService',thriftInfoTestService);



var thrift = require('thrift');
var IThriftInfoTestService = require("./gen-nodejs/IThriftInfoTestService.js");
var IThriftInfoTestService_Types = require('./gen-nodejs/IThriftInfoTestService_Types');

var IThriftTestService = require("./gen-nodejs/IThriftTestService.js");
var IThriftTestService_Types = require("./gen-nodejs/IThriftTestService_Types");

var transport = thrift.TFramedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 29999, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
  assert(false, err);
});

// Create a Calculator client with the connection
// var client = thrift.createClient(IThriftInfoTestService, connection);

// 多方法 multiplexed_protocol 的调用
var multiplexer =new thrift.Multiplexer();

var map ={};
map.name = '我是庄杰森';
map.content = '我是node js!!!';


//服务一方法一调用
var thriftInfoTestServiceClient = multiplexer.createClient('com.java.core.rpc.thrift.service.IThriftInfoTestService',IThriftInfoTestService,connection);

thriftInfoTestServiceClient.showInfoData("我是从 nodejs 过来的！ showInfoData()方法！ 。。",true, map, function(err, response) {
  console.log("showInfoData : " + response);
});

var map2 ={};
map2.name = '我是庄杰森';
map2.content = '我是node js!!!showThriftResult() 方法！！。';


//服务二方法二调用
var thriftTestService = multiplexer.createClient('com.java.core.rpc.thrift.service.IThriftTestService',IThriftTestService,connection);

thriftTestService.showThriftResult("我是从 nodejs 过来的！ showThriftResult() 方法 ！。。。。",true, map2, function(err, response) {
  console.log("showThriftResult : " + response);



  //关闭连接
  connection.end();
});








