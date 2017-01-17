/**
 * Created by xiaogang on 2016/10/28.
 */
"use strict";
$(function () {
    $("input").blur(function (e) {
        var _this = this;
        console.log("blur");
        var _checkFlag = personal.validate.checkSingleNode({
            node: _this,
            callback: validateCallback
        });
    });
    $("#validate-check").click(function (e) {
        var _checkFlag = personal.validate.check({
            callback: validateCallback
        });
        //校验未通过，则终止执行
        if(_checkFlag){
            return
        }
    });
    $("#initValidateById").click(function (e) {
        initValidateById();
        //修改提示语
        $("#phone").attr("placeholder", "input your phone number!")
    });
    $("#initValidateByClass").click(function (e) {
        $('input').off('blur');
        initValidateByClass();
        //修改提示语
        $(".personal-input").attr("placeholder", "input your phone number!")
    });



    //校验初始化
    function initValidateById() {
        var _form = {
            methods: {
                "phone": {
                    required: "required",
                    mobile: "mobile"
                }
            },
            errors: {
                "phone": {
                    required: "请输入您的手机号！",
                    mobile: "请核对您的手机号！"
                }
            }
        };
        personal.validate.initValidateById(_form);
    };

  //校验初始化
    function initValidateByClass() {
        var _form = {
            methods: {
                "personal-input": {
                    required: "required",
                    mobile: "mobile"
                }
            },
            errors: {
                "personal-input": {
                    required: "请输入您的手机号！",
                    mobile: "请核对您的手机号！"
                }
            }
        };
        personal.validate.initValidateByClass(_form);
    };
    function validateCallback(data, code, msg) {
        console.log(data);
        $(data.node).attr("placeholder","请输入有效的手机号码！").focus();
        (code !== 100) && alert(msg);
    }
});