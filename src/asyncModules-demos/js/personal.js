/**
 * Created by xiaogang on 2016/10/28.
 */
"use strict";
$(function () {
    var _props = [], _func = [];
    for (var key in personal) {
        //personal.props
        var _type = typeof personal[key];
        if (_type === "string" || _type === "boolean" || _type === "number") {
            // console.log(key + ":" + personal[key]);
            _props.push('<p><span class="key">personal.' + key + '</span> = ' + personal[key] + '&nbsp </p>');
            continue;
        }
        //personal.func
        if (personal.isFunction(personal[key])) {
            _func.push('<pre class="props prettyprint prettyprinted func personal-ellipsis"> <span class="key"> personal.' + key + '</span> = ');
            _func.push(personal[key].toString().replace(/(\n|\r)+/g, "<br/>").replace(/\s{2}/g, '&nbsp').replace(/;/g, ';&nbsp') + '</pre>');
            continue;
        }
        //personal.modules
        if (typeof personal[key] === 'object') {
            // console.log(key);
            var _modulse = '<div class="personal-list module title" data-module="' + key + '">personal.' + key + '</div>', _mProps = [], _mFunc = [];
            for (var _key in personal[key]) {
                //personal.module.props
                var _mType = typeof personal[key][_key];
                if (_mType === "string" || _mType === "boolean" || _mType === "number") {
                    console.log(key + ":" + personal[key]);
                    _mProps.push('<p><span class="key">personal.' + key + '.' + _key + '</span> = ' + personal[key][_key] + '&nbsp </p>');
                    continue;
                }

                //personal.module.func
                if (personal.isFunction(personal[key][_key])) {
                    _mFunc.push('<pre class="props ' + key + ' hide prettyprint prettyprinted func personal-ellipsis"> <span class="key"> personal.' + key + '.' + _key + '</span> = ');
                    _mFunc.push(personal[key][_key].toString().replace(/(\n|\r)+/g, "<br/>").replace(/\s{2}/g, '&nbsp').replace(/;/g, ';&nbsp') + '</pre>');
                    continue;
                }
            }
            // console.log(_mProps.join(''));
            if (_mProps.length) {
                _modulse += '<div class="props ' + key + ' hide">' + _mProps.join('') + '</div>';
            }
            _modulse += _mFunc.join('');
            $("#modules").append(_modulse);
            continue;
        }
    }
    $("#props").html(_props.join(''));
    $("#funcs").html(_func.join(''));


    //personal.props
    $("#props").prev().click(function (e) {
        $("#props").toggleClass("hide");
    });


    //personal.func
    $("#func").click(function (e) {
        $("#funcs").toggleClass("hide");
    });
    //func
    $(".func").click(function (e) {
        $(this).toggleClass('personal-ellipsis word-break');
    });


    $("#module").click(function (e) {
        $("#modules").toggleClass("hide");
    });
    //module
    $(".module").click(function (e) {
        var _moduleName = $(this).data('module');
        $('.' + _moduleName).toggleClass('hide');
    })


});