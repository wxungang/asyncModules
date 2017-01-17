/**
 * Created by xiaogang on 2016/8/12.
 */
"use strict";
define(function (require) {
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
            _this.log = _log;
            _this.log[funcName](params);
            //会导致每次require、load模块
            //_feedback[funcName].call(_this, params);

        } else {
            return;
        }

    };
    var _log = {};
    var template = '<div class="up-Log" id="upLog" style="display:none;height: 100%; width: 100%; position: fixed;top:0; left: 0;background: rgba(0,0,0,0.6);z-index: 1000;"> ' +
        '<div class="logContent" id="logContent" style="padding: 5px;max-height: 86%; width: 90%;margin: 16px 5%; background-color: #999; color: #fff;overflow-y: auto; word-break: break-all;box-sizing: border-box;">' +
        ' </div> <div class="close" style="width:90%;margin:0 5%;height:30px; line-height:30px;text-align:center;border-radius: 5px;color: white;background-color: #005bac;" onclick="$(this).parent().hide()">关闭</div></div>';

    _log.init = function (params) {
        //日志显示的触发
        if (params) {
            //内容默认通过longtap绑定（依赖touch.js）
            if (params.node) {
                require(['../../touch'], function () {
                    $(params.node).on("longTap", function (e) {
                        $("#upLog").show();
                    });
                });
            } else {
                //通过回调触发
                $.isFunction(params.callback) && params.callback();
            }
        }
        return _log;
    };
    /**
     * 日志 记录
     * @param params
     */
    _log.log = function (params) {
        if ($("#upLog").length) {
            $("#logContent").append('<div>' + (params && params.msg || params) + '</div>');
        } else {
            $("body").append(template);
            $("#logContent").append('<div>' + (params.msg || params) + '</div>');
        }
        return _log;
    };
    /**
     * 日志显示
     */
    _log.show = function () {
        $("#upLog").show();
    };
    /**
     * 日志显示
     */
    _log.clear = function () {
        $("#logContent").text("");
        return _log;
    };
    /**
     * 添加错误捕获函数
     * @param sMessage
     * @param sUrl
     * @param sLine
     */
    window.onerror = function (sMessage, sUrl, sLine) {
        _log.log('<p style="color:red;">'+sLine+'行'+sUrl+'</p>');
        _log.log(sMessage);
    };
    return exports;
});