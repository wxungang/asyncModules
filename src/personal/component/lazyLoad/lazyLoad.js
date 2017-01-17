/**
 * Created by xiaogang on 2016/9/5.
 * 移植于：https://github.com/mishe/lazyload.git
 * //后续改为不依赖zepto
 */
"use strict";
define(function (require) {
    var that = null;
    /**
     * 每个模块对外只暴露一个函数，通过获取用户的调用函数名和参数，模块内部去调用相应的函数
     * funcName:用户调用的函数名称
     * params:用户调用的入参（只接受对象格式）
     */
    var exports = function (funcName, params) {
        that = this;
        if (typeof funcName === "string") {

            //加载完成之后直接挂载到up下,下次使用再需要加载模块
            that.lazyLoad = _lazyLoad;
            that.lazyLoad[funcName](params);
            //会导致每次require、load模块
            //_feedback[funcName].call(_this, params);
        } else {
            return;
        }
    };

    var _lazyLoad={};
    _lazyLoad.init=function () {
        var timer,
            len = $('img.lazyload').length;

        function getPos(node) {
            var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft,
                scrollt = document.documentElement.scrollTop || document.body.scrollTop;
            var pos = node.getBoundingClientRect();
            return {
                top: pos.top + scrollt,
                right: pos.right + scrollx,
                bottom: pos.bottom + scrollt,
                left: pos.left + scrollx
            }
        }

        function loading() {
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                    imgs = $('img.lazyload'),
                    screenHeight = document.documentElement.clientHeight;
                for (var i = 0; i < imgs.length; i++) {
                    var pos = getPos(imgs[i]),
                        posT = pos.top,
                        posB = pos.bottom,
                        screenTop = screenHeight + scrollTop;
                    if ((posT > scrollTop && posT < screenTop) || (posB > scrollTop && posB < screenTop)) {
                        imgs[i].src = imgs[i].getAttribute('data-img');
                        $(imgs[i]).removeClass('lazyload');
                    } else {
                        // new Image().src = imgs[i].getAttribute('data-img');
                    }
                }
            }, 100);
        }

        if (!len) return;
        loading();
        $(window).on('scroll resize', function () {
            if (!$('img.lazyload').length) {
                return;
            } else {
                loading();
            }
        })
    }

    return exports;
})
