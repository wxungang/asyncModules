/**
 * Created by xiaogang on 2016/10/28.
 */
"use strict";
$(function () {
    $('#removeLocation').click(function (e) {
        personal.removeLocalStorage('location');
        alert(JSON.stringify(personal.getLocalStorage('location') || '{}'));
    });

    $('#busi-getLocation').click(function (e) {
        personal.busi.getLocation({
            callback: function (data, code, msg) {
                alert(code + JSON.stringify(data));
            }
        })
    })

    $('#busi-getAmapLocation').click(function (e) {
        personal.busi.getLocation({
            isAmap: true,
            callback: function (data, code, msg) {
                alert(code + JSON.stringify(data));
            }
        })
    })
});