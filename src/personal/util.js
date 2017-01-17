/**
 * Created by xiaogang on 2016/8/12.
 * 该文件 生产上自己打包到 personal 文件中
 * 开发环境中需要单引
 */
"use strict";
window.personal = window.personal || {};
/**
 * up下的方法和属性
 * 单独 写出来只是 为了方便维护
 * 实际使用中会通过脚本打包到unionpay.js中去
 */
(function () {
    var _this = this;

    //无痕模式下创建自己的storage
    //this.sessionStorage = this.sessionStorage || {};
    /**
     * 判断是否支持无痕Local\sessionStroage
     */
    this.supportStroage = (function () {
        var flag = true;
        try {
            if (window.localStorage) {
                window.localStorage['test'] = "test";
                window.localStorage.removeItem("test");
            } else {
                alert("请关闭隐身模式");
                flag = false;
            }
        } catch (e) { //对于无痕模式下会出现异常
            flag = false;
        }
        return flag;
    })();
    /**
     * 判断当前浏览器是否支持webp图片格式
     */
    this.supportWebp = (function () {
        try {
            return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0);
        } catch (err) {
            return false;
        }
    })();
    /**
     *
     * @param str
     * @param splitChar
     */
    this.equalObj = function (str, splitChar) {

    };
    /**
     * 将URL查询参数转换为Object
     * @param str：可选参数，如果不传入默认解析当前页面查询参数
     * @returns {{object}}
     */
    this.urlQuery2Obj = function (str) {
        if (!str) {
            str = location.search;
        }

        if (str[0] === '?' || str[0] === '#') {
            str = str.substring(1);
        }
        var query = {};

        str.replace(/\b([^&=]*)=([^&=]*)/g, function (m, a, d) {
            if (typeof query[a] !== 'undefined') {
                query[a] += ',' + decodeURIComponent(d);
            } else {
                query[a] = decodeURIComponent(d);
            }
        });

        return query;
    };
    /**
     * 得到地址栏参数
     * @param names 参数名称
     * @param urls 从指定的urls获取参数
     * @returns string
     */
    this.getQueryString = function (names, urls) {
        urls = urls || window.location.href;
        if (urls && urls.indexOf("?") > -1) {
            urls = urls.substring(urls.indexOf("?") + 1);
        }
        var reg = new RegExp("(^|&)" + names + "=([^&]*)(&|$)", "i");
        var r = urls ? urls.match(reg) : window.location.search.substr(1).match(reg);
        if (r != null && r[2] != "") {
            var ms = r[2].match(/(\<)|(\>)|(%3C)|(%3E)/g);
            if (ms && ms.length >= 4) {
                //如果检测到有2对及以上开始和结束尖括号
                r[2] = r[2].replace(/(\<)|(%3C)/g, "");
            }
            return unescape(r[2]);
        }
        return null;
    };
    /**
     * 拼接 对象数据 函数
     * @param params
     * @param joinChar
     * @returns {string}
     */
    this.joinParams = function (params, joinChar) {
        var _urls = [];
        for (var key in params) {
            _urls.push(key + "=" + encodeURIComponent(params[key]));
        }
        return _urls.join(joinChar || "&");
    };
    /**
     * 普通的页面跳转
     * @param url 地址
     * @param params 参数
     */
    this.goPage = function (url, params) {
        params = params || {};
        //默认添加html后缀
        if (url && (!/\.html/.test(url))) {
            url = url + ".html?" + this.joinParams(params);
        } else {
            url = url + "?" + this.joinParams(params);
        }
        window.location.href = (url || params.url);
    };
    /**
     * 页面跳转
     * @param url 下一个页面地址
     * @param params 需要缓存起来的参数
     * @param page 返回页面
     * @param nextParams 需要传递到下一个页面参数
     */
    this.go = function (url, params, page, nextParams) {
        //默认返回页面： 获取当前页面
        page = page || location.pathname.split("/").pop();
        // 获取默认缓存参数
        params = params || this.urlQuery2Obj();
        //页面显示参数
        nextParams = this.extend(nextParams || {}, {page: page});
        //默认添加html后缀
        if (url && (!/\.html/.test(url))) {
            url = url + ".html?" + this.joinParams(nextParams);
        } else {
            url = url + "?" + this.joinParams(nextParams);
        }
        //利用页面缓存实现 参数保存
        var pageParams = this.joinParams(params);
        this.setSessionStorage('pageParams', pageParams);
        //利用history对象 实现 参数保存
        // history.replaceState(params, page, url);
        window.location.href = (url || params.url);
    };
    /**
     *
     * @param url :将要返回的页面
     * @param params ：需要携带的参数
     * defaultPage : 默认跳转页面
     */
    this.back = function (url, params, defaultPage) {
        //默认添加html后缀
        if (url && (!/\.html/.test(url))) {
            url = url + ".html";
        }
        //默认为空对象
        params = params || {};
        //默认跳转到首页
        if (defaultPage && (!/\.html/.test(defaultPage))) {
            defaultPage = defaultPage + ".html";
        } else {
            defaultPage = "index.html";
        }
        //获取页面参数
        var _urls = [], _params = this.getSessionStorage("pageParams");
        //利用页面缓存实现 参数保存
        _params && _urls.push(_params);
        //利用history对象 实现 参数保存
        // this.extend(params,history.state);

        for (var key in params) {
            _urls.push(key + "=" + encodeURIComponent(params[key]));
        }

        if (url) {
            window.location.href = url + "?" + _urls.join("&");
        } else {
            window.location.href = defaultPage;
        }
    };
    this.addState = function (key, value, data, title, url) {
        //获取当前参数对象
        var _urlObj = this.urlQuery2Obj(url);
        _urlObj[key] = value;//自动覆盖
        return location.origin + location.pathname + "?" + this.joinParams(_urlObj);
    };
    /**
     * setLocalStorage
     */
    this.setLocalStorage = function (key, value, isJson) {
        if (this.supportStroage) {
            try {
                window.localStorage[key] = isJson ? JSON.stringify(value) : value;
            } catch (e) {
                //处于无痕模式时，存放到cookie当中
                console.log("error:" + e);
                console.log("不支持无痕浏览!");
                return this.setPrivate(key, value, isJson);
            }
        } else {
            console.log("暂不支持无痕浏览!");
            return this.setPrivate(key, value, isJson);
        }
    };
    /**
     * getLocalStorage
     */
    this.getLocalStorage = function (key) {
        if (this.supportStroage) {
            // console.log(window.localStorage[key]);
            return window.localStorage[key];
        } else {
            console.log("暂不支持无痕浏览!");
            return this.getPrivate(key);
        }
    };
    /**
     * setLocalStorage
     */
    this.setSessionStorage = function (key, value, isJson) {
        // this.log(key + ':' + JSON.stringify(value));
        if (this.supportStroage) {
            try {
                window.sessionStorage[key] = isJson ? JSON.stringify(value) : value;
            } catch (e) {
                //处于无痕模式时，存放到cookie当中
                console.log("error:" + e);
                console.log("不支持无痕浏览!");
                return this.setPrivate(key, value, isJson);
            }
        } else {
            console.log("暂不支持无痕浏览!");
            return this.setPrivate(key, value, isJson);
        }
    };
    /**
     * getLocalStorage
     */
    this.getSessionStorage = function (key) {
        if (this.supportStroage) {
            // console.log(window.sessionStorage[key]);
            return window.sessionStorage[key];
        } else {
            console.log("暂不支持无痕浏览!");
            return this.getPrivate(key);
        }
    };
    /**
     * removeSessionStorage
     */
    this.removeSessionStorage = function (key) {
        if (this.supportStroage) {
            window.sessionStorage.removeItem(key);
        }
        else {
            console.log("当前浏览器不支持sessionStorage");
            return this.removePrivate(key);
        }
    };
    /**
     * removeLocalStorage
     */
    this.removeLocalStorage = function (key) {
        if (this.supportStroage) {
            window.localStorage.removeItem(key);
        }
        else {
            console.log("当前浏览器不支持sessionStorage");
            return this.removePrivate(key);
        }
    };

    this.setCookie = function (cookie_name, cookie_value, domain, isEncode, expTime) {
        var exp = new Date();
        var expires = "";
        if (expTime) {
            exp.setTime(exp.getTime() + expTime);
            expires = ";expires=" + exp.toGMTString();
        }
        if (!domain) {
            domain = document.domain;
            if (/^[a-z]/i.test(document.domain)) {
                domain = document.domain.substring(document.domain.indexOf("."));
            }
        }

        isEncode = typeof isEncode == 'undefined' ? true : isEncode;
        if (isEncode) {
            cookie_value = encodeURIComponent(cookie_value);
        }
        document.cookie = cookie_name + "=" + cookie_value + "; path=/; domain=" + domain + ";" + expires;
    };
    this.getCookie = function (cookie_name, decode) {
        decode = decode || true;
        var allCookies = document.cookie;
        var cookie_pos = allCookies.indexOf(cookie_name);

        var value = "";
        if (cookie_pos != -1) {
            cookie_pos += cookie_name.length + 1;
            var cookie_end = allCookies.indexOf(";", cookie_pos);
            if (cookie_end == -1) {
                cookie_end = allCookies.length;
            }
            value = allCookies.substring(cookie_pos, cookie_end);
            if (decode) {
                try {
                    value = decodeURIComponent(value);
                } catch (e) {
                    console.log(e);
                    return "";
                }
            }
        }
        return value;
    };
    /**
     * removeCookie
     */
    this.removeCookie = function (p) {
        var dp = {
            domain: "",
            key: "",
            path: "/"
        };
        if (typeof p === 'object') {
            //todo 单独封装一个deep copy 函数
            $.extend(dp, p);
        } else if (typeof p === 'string') {
            dp.key = p;
        }
        if (!dp.domain) {
            dp.domain = function () {
                if (/^\d/.test(document.domain)) {
                    return document.domain;
                } else if (/^[a-z]/i.test(document.domain)) {
                    return document.domain.substring(document.domain.indexOf("."));
                }
                return document.domain;
            }();
        }
        var exp = new Date("2000", "1", "1");
        var cval = this.getCookie(dp.key);
        if (cval != null) {
            document.cookie = dp.key + "=" + cval + ";domain=" + dp.domain + ";path=" + dp.path + ";expires=" + exp.toGMTString();
        } else {
            console.log("移除cookie值,不存在key为" + dp.key + "的cookie");
        }
    };
    this.setPrivate = function (key, value, isJson, encode) {
        encode = encode || true;
        this.setCookie(key, isJson ? JSON.stringify(value) : value, null, encode);
    };
    this.getPrivate = function (key, encode) {
        encode = encode || true;
        return this.getCookie(key);
    };
    this.removePrivate = function (key) {
        this.removeCookie({
            key: key
        });
    };
}).call(window.personal);
/**
 * 数据交互
 */
(function () {
    var _this = this;
    //ajax
    this.ajax = function (params) {
        var url = '';
        if (/^https?/.test(params.url)) {
            //绝对地址
            url = params.url;
        } else {
            //相对地址
            var prefix = location.origin + '/yourPath/';
            //本地请求地址 todo
            if ((/^http:\/\/localhost/i).test(location.href)) {
                prefix = 'yourPath';
            }
            url = prefix + params.url + '.json';
        }
        // 新增webp的图片格式判断
        params.data = params.data || {};
        params.data.webp = this.supportWebp;
        console.log(params.data);
        var _params = {
            type: params.type || "post",//默认post请求
            url: url,
            dataType: params.dataType || "json",//默认json返回
            contentType: "application/json",
            data: JSON.stringify(params.data || {}),
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
                    switch (xhr.status) {
                        case 403:
                            console.log("服务器禁止访问");
                            break;
                        case 404:
                            console.log("未找到服务器");
                            break;
                        case 500:
                            console.log("服务器未响应");
                            break;
                        case 503:
                            console.log("服务器不可用");
                            break;
                        case 504:
                            console.log("网关超时");
                            break;
                    }
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
        };
        (function () {
            if (params.loading) {
                _this.ui.loading();
            }
            $.ajax(_params);
        })();
    };
}).call(window.personal);
/**
 * personal.util
 */
(function () {
    var _this = this, _util = this.util = this.util || {};
    /**
     * 对HTML进行转义
     * @param html 待转义的HTML字符串
     * @returns {*}
     */
    _util.htmlEncode = function (html) {
        var temp = document.createElement("div");
        temp.textContent = html;
        var output = temp.innerHTML;
        temp = null;
        return output;
    };

    /**
     * 对HTML进行逆转义
     * @param html 待逆转义的HTML字符串
     * @returns {*}
     */
    _util.htmlDecode = function (html) {
        var temp = document.createElement("div");
        temp.innerHTML = html;
        var output = temp.textContent;
        temp = null;
        return output;
    };
    /**
     * 移植自underscore的模板
     * @param text 模板文本
     * @param data 数据（可选参数）
     * @returns {*}
     */
    _util.template = function (text, data) {
        var render;
        var settings = {
            evaluate: /<%([\s\S]+?)%>/g,
            interpolate: /<%=([\s\S]+?)%>/g,
            escape: /<%-([\s\S]+?)%>/g
        };
        var noMatch = /(.)^/;
        var matcher = new RegExp([
                (settings.escape || noMatch).source,
                (settings.interpolate || noMatch).source,
                (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');
        var escapes = {
            "'": "'",
            '\\': '\\',
            '\r': 'r',
            '\n': 'n',
            '\t': 't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };

        var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset)
                .replace(escaper, function (match) {
                    return '\\' + escapes[match];
                });

            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.htmlEncode(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";

        if (!settings.variable) {
            source = 'with(obj||{}){\n' + source + '}\n';
        }

        source = "var __t,__p='',__j=Array.prototype.join," +
            "print=function(){__p+=__j.call(arguments,'');};\n" +
            source + "return __p;\n";
        try {
            render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
            e.source = source;
            throw e;
        }

        if (data) {
            return render(data, _util);
        }
        var template = function (data) {
            return render.call(this, data, _util);
        };

        template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

        return template;
    };

}).call(window.personal);
/**
 * busi 项目业务逻辑相关的 函数封装
 * 通用性 不高
 */
(function () {
    var _this = this, _busi = this.busi = this.busi || {};
    /**
     * 主动定位 同时 存储起来,支持异步执行
     * 定位失败时，返回默认位置信息，但不进行存储
     * @param params
     * params.successStore ：true  定位成功时 是否存储 回调的位置信息
     * params.defaultStore：false 定位失败时 是否存储 默认位置信息
     * params.locationByApp：是否通过 客户端 定位 ()
     */
    _busi.setLocation = function (params, location) {
        var _location = location || {};//缓存中的位置信息
        //默认位置信息
        var defaultLocation = {
            longitude: 121.662709,//经度
            latitude: 31.23415,//维度
            timestamp: (new Date()).getTime()//时间戳
        };
        defaultLocation.cityInfo = _location.cityInfo ? _location.cityInfo : null;
        //参数预处理
        params = params || {};
        //默认存储成功 定位的位置数据
        params.successStore = params.successStore || true;
        params.locationByApp = params.locationByApp || _this.isRunApp;
        var _key = params.key || 'location';
        if (params.isAmap) {
            //使用高德定位
            _this.map.getLocation({
                longitude: params.longitude,
                latitude: params.latitude,
                callback: function (data, code, msg) {
                    if (100 === code) {
                        //更新 经纬度 和高德服务 信息
                        _this.extend(defaultLocation,data);
                        //成功 获取定位之后存储起来
                        (params.successStore) && _this.setLocalStorage(_key, defaultLocation, true);
                        _this.successCallback(params.callback, data, msg);
                    } else if (99 === code) {
                        //设置默认数据
                        data.amap = {
                            city: '上海市',
                            province: '上海市'
                        };
                        //更新 经纬度信息
                        _this.extend(defaultLocation,data);
                        //失败返回默认值，但不存储位置信息
                        (params.defaultStore) && _this.setLocalStorage(_key, defaultLocation, true);
                        _this.errorCallback(params.callback, defaultLocation, "defaultAmap", code);
                    } else {
                        //设置默认数据
                        defaultLocation.amap = {
                            city: '上海市',
                            province: '上海市'
                        };
                        //失败返回默认值，但不存储位置信息
                        (params.defaultStore) && _this.setLocalStorage(_key, defaultLocation, true);
                        _this.errorCallback(params.callback, defaultLocation, "defaultValue", -1);
                    }
                }
            });
        } else {
            //保存已经存在的amap和unionpay信息
            defaultLocation.amap = _location.amap ? _location.amap : null;
            //获取经纬度信息
            if (params.locationByApp) {
                personal.plugins.getPosition({
                    callback: function (data, code, msg) {
                        if (100 === code) {
                            //更新 经纬度信息
                            _this.extend(defaultLocation,data);

                            (params.successStore) && _this.setLocalStorage(_key, defaultLocation, true);
                            _this.successCallback(params.callback, data, msg);
                        } else {
                            //失败返回默认值，但不存储位置信息
                            (params.defaultStore) && _this.setLocalStorage(_key, defaultLocation, true);
                            _this.errorCallback(params.callback, defaultLocation, "defaultValue", -1);
                        }
                    }
                })
            } else {
                //location by browser navigator
                _this.map.location({
                    callback: function (data, code, msg) {
                        if (100 === code) {
                            //更新 经纬度信息
                            _this.extend(defaultLocation,data);
                            //成功 获取定位之后存储起来
                            (params.successStore) && _this.setLocalStorage(_key, defaultLocation, true);
                            _this.successCallback(params.callback, data, msg);
                        } else {
                            //失败返回默认值，但不存储位置信息
                            (params.defaultStore) && _this.setLocalStorage(_key, defaultLocation, true);
                            _this.errorCallback(params.callback, defaultLocation, "defaultValue", -1);
                        }
                    }
                });
            }
        }
    };
    /**
     * 获取 位置信息 （不存在则 主动定位 ）
     * @param params={
     *   key:
     *   isAmap:
 *       longitude:
 *       latitude:
 *       callback；function(){
 *       }
     * }
     */
    _busi.getLocation = function (params) {
        //参数预处理
        params = params || {};
        //获取 缓存位置信息
        var _key = params.key || 'location', location = _this.getLocalStorage(_key), _locationObj;
        try {
            _locationObj = JSON.parse(location || '{}');
        } catch (e) {
            //位置信息格式错误。清除信息
            _this.removeLocalStorage(_key);
        }
        //位置信息缓存 15 分钟
        if (_locationObj.timestamp) {
            var _timestamp = (new Date()).getTime() - parseInt(_locationObj.timestamp);
            if (_timestamp > 1000 * 60 * 60 * 6) {
                //大于 6小时
                _locationObj = null;
                _this.removeLocalStorage(_key);
            } else if (0 && _timestamp > 1000 * 60 * 60 * 1) {
                // // 1个小时 清除amap
                // _locationObj.amap = null;
                // _this.setLocalStorage(_key, _locationObj, true);
            } else if (_timestamp > 1000 * 60 * 60 * 0.25) {
                //15分钟 ,清除[amap  ??] 和 经纬度
                _locationObj = _this.extend({}, {
                    // amap: _locationObj.amap,
                    cityInfo: _locationObj.cityInfo
                });
                _this.setLocalStorage(_key, _locationObj, true);
            }
        }else{
            _locationObj = null;
            _this.removeLocalStorage(_key);
        }

        //定位信息存在
        if (_locationObj) {
            if (params.isAmap) {
                if (_locationObj.amap) {
                    //需要获取高德位置数据
                    _this.successCallback(params.callback, _locationObj);
                } else {
                    //不存在amap对象
                    _this.busi.setLocation(params, _locationObj);
                }
            } else {
                if (_locationObj.longitude && _locationObj.latitude) {
                    _this.successCallback(params.callback, _locationObj);
                } else {
                    _this.busi.setLocation(params, _locationObj);
                }
            }
        } else {
            //不存在。或者空对象
            _this.busi.setLocation(params, _locationObj);
        }
    };
}).call(window.personal);