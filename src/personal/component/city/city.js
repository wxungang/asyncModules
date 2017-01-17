/**
 * Created by xiaogang on 2016/8/16.
 * 城市列表 模块
 */
"use strict";
define(['./cityList'], function (cityList) {
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
            _this.city = _city;
            _this.city[funcName](params)
            //会导致每次require、load模块
            //_city[funcName].call(_this, params);
        } else {
            return;
        }

    };
    var _city = {};

    /**
     * 通过 省市名 获取对应的 code
     * @param params={cityName:"上海市",provinceName:"上海市"}
     */
    _city.getCityCode = function (params) {
        var _params = {
            cityCode: "",
            provinceCode: ""
        };
        if (params) {
            if (params.cityName) {
                //数据预处理
                params.cityName = params.cityName.trim();
                var _cityLists = cityList || {};
                for (var key in _cityLists) {
                    // console.log(_cityLists[key].name);
                    if (_cityLists[key].name === params.cityName) {
                        _params.cityCode = key;
                        break;
                    }
                }
            }
            //目前没有省code
            if (params.cityName === params.provinceName) {
                _params.provinceCode = _params.cityCode;
            }
        } else {
            console.log("请输入相应的参数");
        }
        //异步执行
        _params.cityCode ? _this.successCallback(params.callback, _params) : _this.errorCallback(params.callback, _params);
    };
    return exports;
});