## personal.validate 校验组件
- personal.validate.check(params)
- personal.validate.checkSingleNode(params)
- personal.validate.initValidateById(params)
- personal.validate.initValidateByClass(params)

### personal.validate.check(params)
####  功能描述
- 校验父节点parentNode下所有的input输入框
- 同时支持同异步返回

#### 入参 params(object)
字段名称|是否必须|默认值|字段说明
---|---|---|---
parentNode|-1|$("body")|
callBack|-1||校验未通过的回调函数（一般为提示性的操作）

#### 同步返回值（bool 值）
- 全部校验通过 ：true
- 任何一个校验失败 ：false

#### 异步成功回调反参 data(object)
字段|返回值|字段说明
---|---|---
msg|校验成功|

#### 异步失败回调反参 data(object)
字段|返回值|字段说明
---|---|---
msg|校验成功|
node|dom节点|校验失败的dom节点
funcName||校验失败的方法名

#### demo
```javascript
    var _checkFlag = personal.validate.check({
        callback: validateCallback
    });
    if (!_checkFlag) {
        return;
    }
    function validateCallback(data, code, msg) {
        (code !== 100) && alert(msg);
    }
```

### personal.validate.checkSingleNode(params)
####  功能描述
- 校验节点node输入框
- 同时支持同异步返回

#### 入参 params(object)
字段名称|是否必须|默认值|字段说明
---|---|---|---
node|1||待校验的dom节点
callBack|-1||校验未通过的回调函数（一般为提示性的操作）

#### 同步返回值（bool 值）
- 校验通过 ：true
- 校验失败 ：false

#### 异步成功回调反参 data(object)
字段|返回值|字段说明
---|---|---
msg|校验成功|

#### 异步失败回调反参 data(object)
字段|返回值|字段说明
---|---|---
msg|校验成功|
node|dom节点|校验失败的dom节点
funcName||校验失败的方法名

#### demo
```javascript
    var _checkFlag = personal.validate.checkSingleNode({
        node:$("#node"),
        callback: validateCallback
    });
    if (!_checkFlag) {
        return;
    }
    function validateCallback(data, code, msg) {
        (code !== 100) && alert(msg);
    }
```

### personal.validate.initValidateById(params)
####  功能描述
- 初始化校验的方法名称和提示语

#### 入参 params(object)
字段名称|是否必须|默认值|字段说明
---|---|---|---
params.methods(key)|1||待校验的节点集合
node(name or phone ...)|1||需要校验的dom节点
params.methods.node(funcKey)|1||待校验的方法集合
required|1|required|node节点需要的校验方法
mobile|-1|mobile|node节点需要的校验方法（具体看业务需求）

#### demo
```javascript
    //you must be confused without demo
    //name phone 为需要校验的dom节点
    //required sensitivePassword mobile 为目前支持的校验方法
    var _form = {
        methods: {
            "name": {
                required: "required",
                sensitivePassword: {
                    equal: ["1104"]
                }
            },
            "phone": {
                required: "required",
                mobile: "mobile"
            }
        },
        errors: {
            "name": {
                required: "请输入您的邀请码！",
                sensitivePassword: "请核对您的邀请码！"
            },
            "phone": {
                required: "请输入您的手机号！",
                mobile: "请核对您的手机号！"
            }
        }
    };
    return personal.validate.initValidateById(_form);
```

### personal.validate.initValidateByClass(params)
####  功能描述
- 初始化校验的方法名称和提示语
- 参数和使用上同initValidateById（区别在于 通过初始化所有的类名称）

### 已实现的校验


