# thriftNodejs
基于Nodejs 下的thrift 应用 ，测试与java 能进行互相调用


### 版本号 0.10.0 

#### 客户端


```


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




```


#### 服务端

```




var thrift = require("thrift");
var IThriftInfoTestService = require("./gen-nodejs/IThriftInfoTestService.js");
var IThriftInfoTestService_Types = require('./gen-nodejs/IThriftInfoTestService_Types');

var IThriftTestService = require("./gen-nodejs/IThriftTestService.js");
var	IThriftTestService_Types = require("./gen-nodejs/IThriftTestService_Types");

var data = {};

//实现方法
var thriftInfoTestService = new IThriftInfoTestService.Processor({
	'showInfoData' : function(name, b2, m2, callback){


		console.log('showInfoData....');


		callback(null,"i am node thriftInfoTestService !!! ");
	}
});

//实现方法
var thriftTestService = new IThriftTestService.Processor({
	'showThriftResult' : function(name, b2, m2, callback){

		console.log('showThriftResult....');



		callback(null,"i am node thriftTestService !!! ");
	}
});

//多服务注册
var processor  = new thrift.MultiplexedProcessor();
processor.registerProcessor('com.java.core.rpc.thrift.service.IThriftTestService',thriftTestService);
processor.registerProcessor('com.java.core.rpc.thrift.service.IThriftInfoTestService',thriftInfoTestService);


// var framedTransport = new thrift.TFramedTransport();
//TFramedTransport 一定要这个避免报错
var transport = thrift.TFramedTransport;
var protocol = thrift.TBinaryProtocol;

var options = {
  transport : transport,
  protocol : protocol
};

var server = thrift.createMultiplexServer(processor,options);


server.listen(29999);

console.log('start listening....');




```

