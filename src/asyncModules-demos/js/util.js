/**
 * Created by xiaogang on 2016/11/15.
 */
"use strict";
$(function () {
    var _data = {
        tel:'12345678,12345678',
        arr: ['list1', 'list2', 'list3'],
        singleValue:'singleValue',
        mutiText:'<div>我是一个富文本<p>p标签</p>新的一行<br/>第二行</div>'
    };
    $('#util-template').click(function (e) {
        var _str = personal.util.template($('#template').html(), _data);
        console.log(_str);
        $('#templateContent').append(_str);
    })
});