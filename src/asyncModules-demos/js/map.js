/**
 * Created by xiaogang on 2016/10/28.
 */
"use strict";
$(function () {

    //
    $("#map-location").click(function (e) {
        personal.map.location({
            callback: function (data, code, msg) {
                if (100 === code) {
                    alert(JSON.stringify(data));
                } else {
                    alert(msg);
                }
            }
        })
    });
    $("#map-getLocation").click(function (e) {
        personal.map.getLocation({
            callback: function (data, code, msg) {
                if (100 === code) {
                    alert(JSON.stringify(data));
                } else {
                    alert(msg);
                }
            }
        })
    });
});