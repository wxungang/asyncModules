/**
 * Created by xiaogang on 2016/8/16.
 * 城市列表 模块
 */
"use strict";
define(function () {
    var _this = null;
    /**
     * 每个模块对外只暴露一个函数，通过获取用户的调用函数名和参数，模块内部去调用相应的函数
     * funcName:用户调用的函数名称
     * params:用户调用的入参（只接受对象格式）
     */
    var exports = function (funcName, params) {
        _this = this;
        if (typeof funcName === "string") {
            //加载完成之后直接挂载到up下,下次使用再需要加载模块
            _this.plugins = _plugins;
            _this.plugins[funcName](params)
            //会导致每次require、load模块
            //_plugins[funcName].call(_this, params);
        } else {
            return;
        }

    };
    var _plugins = {};

    /**
     * 通过 省市名 获取对应的 code
     * @param params={pluginsName:"上海市",provinceName:"上海市"}
     */
    _plugins.getPosition = function (params) {
        cordova.getPosition(
            function (data) {
                if (data.latitude > 0 && data.longitude > 0) {
                    //新增时间戳
                    data.timestamp=(new Date()).getTime();
                    _this.successCallback(params.callback, data);
                } else {
                    _this.errorCallback(params.callback, data, "没有权限，返回经纬度 默认值0.0", 99);
                }
            },
            function (err) {
                _this.errorCallback(params.callback, err, JSON.stringify(err));
            }
        );
    };

    return exports;
});