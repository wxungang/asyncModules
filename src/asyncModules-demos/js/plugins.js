/**
 * Created by xiaogang on 2016/10/28.
 */
"use strict";
$(function () {
    if (!personal.isRunApp) {
        $(".personal-button").addClass("inactive");
        return;
    }

    $("#plugins-position").click(function (e) {
        personal.plugins.getPosition({
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