/**
 * Created by Yanty on 2016/6/26.
 * 功能：rem px换算
 */
;(function (win) {
    "use strict";

    win.resize = {};

    var timer = null;
    var rem = 12;
    var doc = win.document;
    var docEl = doc.documentElement;

    /**
     * 刷新页面REM值
     */
    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        width = width > 768 ? 480 : width;
        rem = width / 7.5;
        docEl.style.fontSize = rem + 'px';
    }

    /**
     * 页面缩放或重载时刷新REM
     */
    win.addEventListener('resize', function () {
        clearTimeout(timer);
        timer = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            clearTimeout(timer);
            timer = setTimeout(refreshRem, 300);
        }
    }, false);

    // 解决font-size过大导致间距不正常，必须指定body字号为12px
    if (doc.readyState === 'complete') {
        doc.body.style.fontSize = '12px';
    } else {
        doc.addEventListener('DOMContentLoaded', function (e) {
            doc.body.style.fontSize = '12px';
        }, false);
    }

    refreshRem();

    /**
     * rem to px
     * @param d
     * @returns {number}
     */
    resize.rem2px = function (d) {
        var val = parseFloat(d) * rem;
        if (typeof d === 'string' && d.match(/rem$/)) {
            val += 'px';
        }
        return val;
    };

    /**
     * px to rem
     * @param d
     * @returns {number}
     */
    resize.px2rem = function (d) {
        var val = parseFloat(d) / rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    };

})(window);