/**
 * Created by xiaogang on 2016/8/12.
 */
"use strict";
define(function () {
    var _this = null;
    var _relyFiles = ["http://webapi.amap.com/maps?v=1.3&key=b9c3419c3798ace570f18d94ec5d256b&plugin=AMap.Geocoder"];
    /**
     * 每个模块对外只暴露一个函数，通过获取用户的调用函数名和参数，模块内部去调用相应的函数
     * funcName:用户调用的函数名称
     * params:用户调用的入参（只接受对象格式）
     */
    var exports = function (funcName, params) {
        _this = this;
        if (typeof funcName === "string") {
            require(_relyFiles, function () {
                //加载完成之后直接挂载到up下,下次使用再需要加载模块
                _this.map = _map;
                _this.map[funcName](params);
            });
        } else {
            return;
        }

    };
    var _map = {};

    /**
     * 利用浏览器只有的API 获取当前经纬度 信息
     * 不依赖高德api
     * @param params ={
     *
     * }
     */
    _map.location = function (params) {
        if (window.navigator.geolocation) {
            var options = {
                enableHighAccuracy: params.enableHighAccuracy || false,
                timeout: params.timeout || 5000,
                maximumAge: params.maximumAge || 1000 //定位缓存时间（默认1s）
            };
            window.navigator.geolocation.getCurrentPosition(
                function (position) {
                    var _data = {};
                    for (var key in position.coords) {
                        _data[key] = position.coords[key];
                    }
                    _data.timestamp = position.timestamp;
                    _this.successCallback(params.callback, _data);
                },
                function (err) {
                    // 定位失败（无法定位、未授权等）,返回空对象
                    _this.errorCallback(params.callback, {}, err.message, err.code);
                },
                options);
        } else {
            // 不支持定位  返回空对象
            _this.errorCallback(params.callback, {}, '您的浏览器暂不支持定位功能');
        }
    };


    /**
     * 获取经纬度对应的城市信息（不传经纬度则获取当前定位经纬度）
     * 使用该函数页面需引用：http://webapi.amap.com/maps?v=1.3&key=b9c3419c3798ace570f18d94ec5d256b&plugin=AMap.Geocoder
     * @param callback
     * @param longitude
     * @param latitude
     * code :100-成功，99-高德定位失败，0：不支持定位 3：定位超时
     */
    _map.getLocation = function (params) {
        // 定位失败使用默认响应数据
        // todo 组件层不能给默认值（应该放到业务代码层去 设置位置信息的默认值）
        var _defaultLocation = {
            // longitude: 121.662709,//经度
            // latitude: 131.23415,//维度
            // amap: {
            //     city: '上海市',
            //     province: '上海市',
            // },
            // cityInfo: {
            //     provinceCode: '310000',
            //     cityCode: '310000',
            // }
        };
        // 通过经纬度信息。调用高德地图组件获取城市信息
        function regeocoder(lnglatXY, callback) {
            var geocoder = new AMap.Geocoder();
            geocoder.getAddress(lnglatXY, function (status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    if(result.regeocode){
                        callback(result.regeocode.addressComponent,result.regeocode.formattedAddress);
                    }else{
                        callback();
                    }
                } else {
                    // 调用高德地图失败
                    callback();
                }
            });
        }

        /**
         * 高德定位成功执行的回调函数
         * @param data
         * @param fullAddress
         */
        function amapfunc(data,fullAddress) {
            if(data){
                //城市预处理（直辖市为空的情况,默认赋值省份）
                data.city=data.city||data.province;
                //设置高德定位信息
                _defaultLocation.amap=data;
                //新增一个address（简单改变一下结构）
                _defaultLocation.amap.address=fullAddress;
                _this.successCallback(params.callback, _defaultLocation, "定位成功");
            }else {
                _this.errorCallback(params.callback, _defaultLocation, "经纬度成功，但城市信息获取失败",99);
            }
        }

        // 已经指定经纬度，无需定位
        if (params && params.longitude && params.latitude) {
            //设置经纬度信息
            _defaultLocation.longitude=params.longitude;
            _defaultLocation.latitude=params.latitude;
            _defaultLocation.timestamp=(new Date()).getTime();
            regeocoder([params.longitude, params.latitude],amapfunc);

        } else {
            if (window.navigator.geolocation) {
                _map.location({
                    timeout: 5000,
                    callback: function (data, code, msg) {
                        if (100 === code) {
                            //设置经纬度信息
                            _defaultLocation=data;
                            regeocoder([data.longitude, data.latitude], amapfunc);
                        } else {
                            //定位失败返回默认值
                            _this.errorCallback(params.callback, _defaultLocation, msg, code);
                        }
                    }
                });
            } else {
                // 不支持定位
                _this.errorCallback(params.callback, _defaultLocation, '您的浏览器暂不支持定位功能');
            }
        }
    };
    return exports;
});