# personal 异步模块化文档

------
### 通用规范
#### location结构
```javascript
location={
    //浏览器返回的基本参数
    timestamp:1233344,//时间戳
    latitude:121,
    longitude:31,
    altitude:0,
    accuracy:30,
    altitudeAccuracy:null,
    heading:0,
    speed:0,
    amap:{
        //通过高德返回的参数
    },
    cityInfo:{
        //cityInfo自有城市数据
    }
}
```
#### callback(data,code,msg)
- 统一回调函数回参格式 

##### successCallback
- data : 默认 {}
- code ： 100 (无法修改)
- msg ：默认 'success'
```javascript
   personal.module.func({
      callback:function(data,code,msg){
              if(100===code){
                  //dosomething
              }else{
                  alert(msg||'请求失败');
              }
         }
  })
```

##### errorCallback
- data : 默认 {}
- code ： 默认 0
- msg ：默认 'success'
```javascript
   personal.module.func({
       callback:function(data,code,msg){
               if(100===code){
                   //dosomething
               }else{
                   alert(msg||'请求失败');
               }
          }
   })
```

### personal基本信息类
#### personal.prop
```javascript
this.version = "1.0.0";

//cordova加载是否完成 （第一版暂时没有cordova 功能）
this.cordovaComplete = false;

//require加载是否完成
this.requireComplete = false;

//app中运行
this.isRunApp=false;

this.moduleUrl //personal.js 所在的文件夹路径


```
#### personal.func
- personal.extend(des,src)
- personal.isArray(o)
- personal.isFunction(o)
- personal.urlQuery2Obj(url)
- personal.getQueryString(url)
- personal.setLocalStorage(key, value, isJson)
- personal.getLocalStorage(key)
- personal.removeLocalStorage(key)
- personal.setSessionStorage(key, value, isJson)
- personal.getSessionStorage(key)
- personal.removeSessionStorage(key)
- personal.ajax(params)

#### personal.extend(des,src)
- 浅覆盖
```javascript
    var out=personal.extend({a:"a1",c:"c"},{a:"a2",b:"b"});
    //输出
    out={
        a:"a2",
        b:"b",
        c:"c"
    }
```

#### personal.isArray(o)
- 判断数组
```javascript
    var arr=[]; 
    personal.isArray(arr);//true
    //out
    true
```

#### personal.isFunction(o)
- 判断函数
```javascript
    function func(){
        //dosomething
    }
    personal.isFunction(func)//true
```

#### personal.successCallback(callback,data,msg)
- 源码：this.isFunction(callback) && callback(data ||{}, 100, msg || "success");
- 统一用户回调 callback(data ||{}, 100, msg || "success")

#### personal.errorCallback(callback,data,msg,code)
- 源码：this.isFunction(callback) && callback(data || {}, code || 0, msg || "error");
- 统一用户回调 callback(data || {}, code || 0, msg || "error")
- 备注：不建议直接在功能模块中去执行用户的入参的回调函数，而是通过调用personal下的函数进行统一处理

##### 统一回调 demo
```javascript
   //功能模块内部使用 demo
   function moduleFunc(){
       //dosomething
       if(true){
          personal.successCallback(params.callback,data,msg);
       }else {
           personal.errorCallback(params.callback,data,msg,code);
       }
   }
   //bad
   function moduleFuncBad(){
      //dosomething
      if(true){
          $.isFunction(callback)&&params.callback(data,100,"请求成功");
      }else {
          $.isFunction(callback)&&params.callback(data,0,"请求失败");
      }
  }
```
#### personal.loadJsCssFile(params)
- 功能：实现动态的加载引用文件，同时执行回调函数（协助requireJs管理样式文件）
```javascript
    this.loadJsCssFile({
        fileName: this.moduleUrl + "component/_module/_module.css",
        callback: function (data) {
            //加载完成之后直接挂载到personal下,下次使用再需要加载模块
            _this._module=_module;
            _this._module[funcName](params)
            //会导致每次require、load模块
            //_module[funcName].call(_this, params);
        }
    });
```

#### personal.ajax(params)
- 功能：后台交互接口（基于zepto的ajax方法进行二次封装）。

```javascript
$.ajax({
       type: params.type || "post",//默认post请求
       url: params.url,
       dataType: params.dataType || "json",//默认json返回
       contentType: "application/json",
       data: params.data || {},
       success: function (data) {
           // _this.ui && _this.ui.hideLoading();
           if (data && data.code == 1000) {
               _this.successCallback(params.callback, data);
           } else {
               _this.errorCallback(params.callback, data || {
                       "success": false,
                       "code": 0,
                       "message": "没有返回值",
                       "result": {}
                   }, "没有返回值", 99);
           }
       },
       error: function (xhr, errorType, error) {
           if (errorType === "abort") { //无网络
               console.log("网络已断开");
           } else if (errorType === "timeout") { //超时
               console.log("系统连接超时");
           } else if (errorType === "error") { //服务器或者客户端错误
               _this.errorCallback(params.callback, {
                   xhr: xhr,
                   errorType: errorType,
                   error: error
               }, error, xhr && xhr.status || -1);
           } else {
               _this.errorCallback(params.callback, {
                   xhr: xhr,
                   errorType: errorType,
                   error: error
               });
           }
       }
   })
```

------
### 常用工具模块(通过打包脚本合并到personal)
- [personal.util](./util.md)
- [personal.busi](./busi.md)

-----------
### 组件模块（通过requireJs管理维护）
- [personal.map](./map.md)
- [personal.lazyLoad](./lazyLoad.md)
- [personal.validate](./validate.md)

-----
## todo
- 根据反馈和项目需要新增模块或者优化相应的模块代码


