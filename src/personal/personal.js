/**
 * Created by xiaogang on 2016/8/11.
 * 1、代码不依赖zepto
 * 2、主要是管理纯js模块的异步加载和客户端交互模块
 */
// "use strict";
window.personal = window.personal || {};


(function () {
    //@formatter:off
    //this 指针的存储
    var _this = this,

        //等待执行的模块列表
        pendingModule = [],

        //当前文件名称
        coreFileName = "personal.js",

        //requireJs文件名:require.min.js 或者require.js
        requireFileName = "require.js";
    //@formatter:on
    this.version = "1.0.0";

    //cordova加载是否完成 （第一版暂时没有cordova 功能）
    this.cordovaComplete = false;

    //require加载是否完成
    this.requireComplete = false;

    this.isAndroidApp = false;
    this.isIosApp = false;
    //是否app中运行。 目前需要手动去设置
    this.isRunApp = (function () {
        var agent = navigator.userAgent.toLowerCase();
        this.isIos = new RegExp(/iphone|ipad|ipod/).test(agent);
        this.isAndroid = new RegExp(/android/).test(agent);
        this.isWX = /micromessenger/.test(agent);
        var _isApp = new RegExp(/(clientKey)/).test(agent) || new RegExp(/(clientKeyLick_personal_1104)/).test(agent);
        this.isAndroidApp = _isApp && this.isAndroid;
        this.isIosApp = _isApp && this.isIos;
        return _isApp;
    }).call(this);


    /**
     * 当前coreFileName 文件所在目录 //todo 待优化（找到即停止）
     */
    this.moduleUrl = function () {
        var srcUrl = "";
        [].forEach.call(document.getElementsByTagName("script"), function (dom) {
            if (dom.src.indexOf(coreFileName) > -1) {
                srcUrl = dom.src.match(new RegExp("(.*?)(" + coreFileName + ")", "i"))[1];
            }
        });
        return srcUrl;
    }();

    /**
     *  覆盖一级json对象（浅覆盖）
     */
    this.extend = function (des, src) {
        for (var i in src) {
            des[i] = src[i];
        }
        return des;
    };

    this.isArray = function (o) {
        return o !== null && typeof o === "object" && 'splice' in o && 'join' in o;
    };
    /**
     * 移植于zepto的实现
     * @param o
     * @returns {boolean}
     */
    this.isFunction = function (o) {
        return typeof o === "function" || toString.call(o) === "[object Function]";
    };
    /**
     * 规范回调函数的返回code
     * @param callback
     * @param data
     * @param msg
     */
    this.successCallback = function (callback, data, msg) {
        this.isFunction(callback) && callback(data || {}, 100, msg || "success");
    }
    /**
     * 规范回调函数的返回code
     * @param callback
     * @param data
     * @param code ：不建议修改
     * @param msg
     */
    this.errorCallback = function (callback, data, msg, code) {
        this.isFunction(callback) && callback(data || {}, code || 0, msg || "error");
    }
    /**
     * 检测js文件
     * @param filePath
     * @returns {boolean}
     */
    this.existJs = function (filePath) {
        //filePath 的相对路径处理
        filePath = filePath.replace(/^((\.)+\/)+/ig, "")
        var _flag = false, _links = document.getElementsByTagName("script");
        for (var i = 0; i < _links.length; i++) {
            console.log(_flag);
            if (_links[i].src.indexOf(filePath) > -1) {
                _flag = true;
                break;
            }
        }
        return _flag;
    };
    /**
     * 检测css文件
     * @param filePath
     * @returns {boolean}
     */
    this.existCss = function (filePath) {
        filePath = filePath.replace(/^((\.)+\/)+/ig, "")
        var _flag = false, _links = document.getElementsByTagName("link");
        for (var i = 0; i < _links.length; i++) {
            console.log(_flag);
            if (_links[i].href.indexOf(filePath) > -1) {
                _flag = true;
                break;
            }
        }
        return _flag;
    };
    /**
     * 检测页面是否引用了相关文件
     * @param fileName
     */
    this.hasFile = function (filePath) {
        var fileType = filePath.substring(filePath.lastIndexOf(".") + 1).toLowerCase();
        if (/^js/i.test(fileType)) {
            return this.existJs(filePath);
        } else if (/^css/i.test(fileType)) {
            return this.existCss(filePath);
        }
    }

    /** 动态加载js文件以及css文件
     * @param  {fileName} 文件名 String or Array 建议最好使用绝对路径
     * @param  {charset}  文件编码
     * @param  {callback(code)} 文件加载完成回调函数 code[success,error]
     * @demo
     */
    this.loadJsCssFile = function (params) {
        var dp = {
            fileName: null,//array in fileName[{fileName:'',media:'',charset:'',ftype:''}]
            charset: null,
            media: null,
            ftype: null,
            attributes: [],
            callback: function (code) {
            }
        }, _index = -1;

        this.extend(dp, params);

        function loadFile(fileName, charset, media, callback, ftype, attributes) {
            var fileref, src = fileName, filetype, checkFile = true;
            //数组格式加载文件时通过对象格式传递参数
            if (typeof fileName === 'object') {
                charset = fileName.charset || charset;
                media = fileName.media || media;
                src = fileName.fileName;
                ftype = fileName.ftype;
                attributes = fileName.attributes || attributes;
                checkFile = typeof fileName.checkFile === 'boolean' ? fileName.checkFile : true;
            }
            //获取文件路径字符串
            filetype = src;
            if (!filetype) {
                _this.isFunction(callback) && callback('success');
                return;
            } else {
                if (_this.hasFile(filetype)) {
                    return _this.isFunction(callback) && callback('success');
                }
            }
            //截取文件类型
            filetype = filetype.substring(filetype.lastIndexOf(".") + 1).toLowerCase();
            filetype = ftype || filetype;

            //createElement
            if (/^js/i.test(filetype)) {
                fileref = document.createElement('script');
                fileref.setAttribute("type", "text/javascript");
                fileref.setAttribute("src", src);
            } else if (/^css/i.test(filetype)) {
                fileref = document.createElement('link');
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", src);
            }
            else {//如果非此两种文件
                _this.isFunction(callback) && callback('error');
            }

            //event and callback bind
            if (typeof fileref !== "undefined") {
                //设置charset、media和其他自定义的属性attributes
                charset && fileref.setAttribute("charset", charset);
                media && fileref.setAttribute("media", media);
                if (attributes && attributes.length) {
                    attributes.forEach(function (o) {
                        fileref.setAttribute(o.key, o.value);
                    });
                }
                if (filetype === "css")//css 的onload不兼容所有浏览器
                {
                    _this.isFunction(callback) && callback('success');
                }
                else {

                    fileref.onload = fileref.onreadystatechange = function () {
                        if (!this.readyState ||
                            this.readyState === 'loaded' ||
                            this.readyState === 'complete') {
                            _this.isFunction(callback) && callback('success');
                        }
                    };
                }
                fileref.onerror = function () {
                    _this.isFunction(callback) && callback('error');
                };
                document.getElementsByTagName("head")[0].appendChild(fileref);
            }
        }

        function iterateFiles(status) {
            //加载失败 直接返回失败回调
            if (status === "error") {
                dp.callback('error');
                return;
            }
            //加载完成 返回成功回调
            if (++_index >= dp.fileName.length) {
                dp.callback('success');
                return;
            }
            loadFile(dp.fileName[_index], dp.charset, dp.media, iterateFiles, dp.ftype, dp.attributes);
        }

        if (this.isArray(dp.fileName)) {
            // (function (status) {
            //     if (status === "error") {
            //         dp.callback('error');
            //         return;
            //     }
            //     _index++;
            //     if (_index >= dp.fileName.length) {
            //         dp.callback('success');
            //         return;
            //     }
            //     loadFile(dp.fileName[_index], dp.charset, dp.media, arguments.callee, dp.ftype, dp.attributes);
            // })();
            iterateFiles();
        }
        else {
            loadFile(dp.fileName, dp.charset, dp.media, dp.callback, dp.ftype, dp.attributes);
        }
    };

    /**
     * cordova加载完成事件捕获
     */
    if (document.addEventListener) {
        /* The only Cordova events _this user code should register for are:
         *      deviceready           Cordova native code is initialized and Cordova APIs can be called from JavaScript
         *      pause                 App has moved to background
         *      resume                App has returned to foreground
         */
        document.addEventListener("pluginready", function () {
            this.isRunApp && (this.cordovaComplete = true);
        }.bind(this), false);
    }

    //加载require文件并在加载完成后运行所有等待执行的模块
    this.loadJsCssFile({
        fileName: this.moduleUrl + requireFileName,
        //attributes:[{ key:"data-main",value:"main" }],
        callback: function (status) {
            initRequireJs();

            runAllPending();

        }.bind(this)
    });

    /**
     * requireJs 路径的配置
     */
    var initRequireJs = function () {

            this.requireComplete = true;

            require.config({
                baseUrl: this.moduleUrl + 'component',
                paths: {
                    cordova: this.moduleUrl + getCordovaPath(),//客户端插件的地址
                    text: this.moduleUrl + "text"
                }
            });

        }.bind(this),

        /**
         * 添加需要等待执行的模块
         * @params modules string 模块名称
         * @params fn function 回调函数
         * @params cordova boole 是否cordova插件
         */
        addPending = function (modules, fn, cordova) {

            pendingModule.push({
                modules: modules,
                fn: fn,
                cordova: cordova
            });

        }.bind(this),

        /**
         * 执行模块
         * @params modulePath string 模块路径
         * @params fn function 回调函数
         * @params cordova boole 是否cordova插件
         */
        runRequire = function (modulePath, fn, cordova) {

            if (!this.requireComplete) {
                addPending(modulePath, fn, cordova);
            } else {
                //如果当前调用 cordova 插件方法且 cordova 未准备完成
                if (cordova && !this.cordovaComplete) {

                    if (this.isRunApp) {
                        (function () {

                            if (this.cordovaComplete) {
                                require(modulePath, fn);
                            } else {
                                console.log(this.cordovaComplete)
                                setTimeout(arguments.callee.bind(this), 500); //严格模式下不容许使用arguments.callee
                                // setTimeout(runRequire.call(_this, modulePath, fn, cordova), 500);
                            }

                        }).call(this);
                    }

                    return;
                }
                require(modulePath, fn);
            }

        }.bind(this),

        /**
         * 运行所有等待执行的模块
         */
        runAllPending = function () {

            pendingModule.forEach(function (m) {
                runRequire(m.modules, m.fn, m.cordova);
            });

            pendingModule = [];

        }.bind(this),

        /**
         * 获取cordova组件路径
         * 暂时不用
         */
        getCordovaPath = function () {
            if (this.isAndroidApp) {
                return "";
            }
            if (this.isIosApp) {
                return "";
            }
            return "yourCordova";
        }.bind(this),

        /**
         * initMethod
         * @params module string 当前对象下一级命名空间名城 例如: personal.ui
         * @params methods array 指定命名空间下所有方法名
         * @params folder 文件夹名称 默认同 module
         */
        initMethod = function (module, methods, isCordova, folder) {
            // todo
            // module 后续是否存在数组的情况 ,如果存在建议统一处理为数组传递到后续函数中
            // var _module=[];
            // if(this.isArray(module)){
            //
            // }

            this[module] = function () {

                //模块的方法集合
                var exports = {};
                //变量模块下的方法
                methods.forEach(function (f) {
                    //方法名称
                    var fn = typeof f === 'string' ? f : f.fn;
                    //是否cordova插件
                    // isCordova = isCordova || false;
                    //挂载函数。调用时才会加载相应的模块（params 默认 {} ）
                    exports[fn] = function (params) {
                        //mod 对应模块对外暴露的 对象
                        runRequire([module + "/" + (folder || module)], function (mod) {
                            mod.call(_this, fn, params || {});
                        }, isCordova || false);

                    };

                });

                return exports;
            }();

        }.bind(this);

    /**
     * 预加载模块 可以加载zepto.js
     * @params names string or array 预先加载指定模块
     */
    this.preLoadModule = function (names) {
        runRequire(this.isArray(names) ? names : [names], null);
    };

    //初始化模块
    initMethod("ui", [
        "loading",
        "hideLoading",
        "alert",
        "toast"
    ], false, 'ui');
    //map
    initMethod("map", [
        "getLocation",
        "location"
    ]);
    //log
    initMethod("log", [
        "init",
        "log",
        "show",
        "clear"
    ]);
    //city
    initMethod("city", [
        "getCityCode"
    ]);
    //validate
    initMethod("validate", [
        "check",
        "checkSingleNode",
        "initValidateById",
        "initValidateByClass"
    ]);

    initMethod("photo", [
        "compress"
    ]);
    initMethod("lazyLoad", [
        "init"
    ]);

    /**
     * 在客户端运行时，先加载插件同时挂载相关组件模块
     * Cordova
     */
    if (!this.isRunApp) {
        //加载插件
        runRequire(["cordova"], function () {
            console.log("loading cordova");
        });
        //挂载组件
        //collect
        initMethod("plugins", [
            "getPosition"
        ], true);
    }

}).call(window.personal);

//util 工具类方法 开发中单独 维护
(function () {

}).call(window.personal);
