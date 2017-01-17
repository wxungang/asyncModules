/**
 * Created by xiaogang on 2016/10/28.
 */
"use strict";
$(function () {
    //
    $("#city-cityCode").click(function (e) {
        personal.city.getCityCode({
            cityName:"上海市",
            provinceName:"上海市",
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