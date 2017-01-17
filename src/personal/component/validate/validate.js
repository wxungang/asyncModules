/**
 * Created by xiaogang on 2016/8/23.
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
            that.validate = _validate;
            that.validate[funcName](params);
            //会导致每次require、load模块
            //_feedback[funcName].call(_this, params);
        } else {
            return;
        }
    };
    //对外暴露的模块方法
    var _validate = {
        check: function (params) {
            var parentNode = params.parentNode || $("body");
            // var params = params || {};
            var pass = true, _methods, _errors;
            parentNode.find("[p-validate-enable='true']").each(function () {
                var _this = $(this);
                _methods = _this.attr("p-validate-methods").split("&") || [];
                _errors = _this.attr("p-validate-errors").split("&") || [];
                for (var m = 0; m < _methods.length; m++) {
                    var methodName = _methods[m].split(":");
                    if (!$.isFunction(methods[methodName[0]])) {
                        continue;
                    }
                    var result = methods[methodName[0]]({
                        value: _this.val().replace(/\r/g, ""),
                        msg: _errors[m],
                        params: (methodName.length > 1 ? JSON.parse(methodName.splice(1).join(":")) : {})
                    });
                    result = result || "";
                    if (result !== "") {
                        console.log(result);
                        // $.isFunction(callBack) && callBack(result, _this, methodName[0]);
                        that.errorCallback(params.callback, {msg: result, node: this, funcName: methodName[0]}, result);
                        pass = false;
                        return pass;
                    }
                }
            });
            //成功回调函数
            if (pass) {
                that.successCallback(params.callback, {
                    msg: "校验成功"
                }, "校验成功");
            }
            return pass;
        },
        checkSingleNode: function (params) {
            var pass = true;
            if (params.node) {
                var _this = $(params.node),
                    _methods = _this.attr("p-validate-methods").split("&") || [],
                    _errors = _this.attr("p-validate-errors").split("&") || [];
                for (var m = 0; m < _methods.length; m++) {
                    var methodName = _methods[m].split(":");
                    if (!$.isFunction(methods[methodName[0]])) {
                        continue;
                    }
                    var result = methods[methodName[0]]({
                        value: _this.val().replace(/\r/g, ""),
                        msg: _errors[m],
                        params: (methodName.length > 1 ? JSON.parse(methodName.splice(1).join(":")) : {})
                    });
                    result = result || "";
                    if (result != "") {
                        //setTimeout(function(){
                        that.errorCallback(params.callback, {msg: result, node: this, funcName: methodName[0]}, result);
                        //},30);
                        pass = false;
                        return pass;
                    }
                }
            }
            //成功回调函数
            if (pass) {
                that.successCallback(params.callback, {
                    msg: "校验成功"
                }, "校验成功");
            }
            return pass;
        },
        initValidateById: function (params) {
            var _methods = params.methods || {},
                _errors = params.errors || {};
            for (var m in _methods) {
                var _this = $("#" + m), ms = [], es = [];
                for (var md in _methods[m]) {
                    if (typeof _methods[m][md] == 'object') {
                        ms.push(md + ":" + JSON.stringify(_methods[m][md]));
                    }
                    else {
                        ms.push(md);
                    }
                    es.push(_errors[m][md]);
                }
                _this.attr("p-validate-methods", ms.join("&"))
                    .attr("p-validate-errors", es.join("&"))
                    .attr("p-validate-enable", "true");
            }
        },
        initValidateByClass: function (params) {
            var _methods = params.methods || {},
                _errors = params.errors || {},
                _parentNode = $(params.parentNode||"body");
            for (var m in _methods) {
                var _this = _parentNode.find("." + m), ms = [], es = [];
                for (var md in _methods[m]) {
                    if (typeof _methods[m][md] == 'object') {
                        ms.push(md + ":" + JSON.stringify(_methods[m][md]));
                    }
                    else {
                        ms.push(md);
                    }
                    es.push(_errors[m][md]);
                }
                _this.attr("p-validate-methods", ms.join("&"))
                    .attr("p-validate-errors", es.join("&"))
                    .attr("p-validate-enable", "true");
            }
        }
    };
    //模块内部校验方法
    var methods = {};
    methods["required"] = function (p) {
        return p.value != "" ? "" : p.msg;
    };
    methods["date"] = function (p) {
        return (/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(p.value)) ? "" : p.msg;
    };
    methods["number"] = function (p) {
        return (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(p.value)) ? "" : p.msg;
    };
    methods["email"] = function (p) {
        return (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i
            .test(p.value) || !p.value) ? "" : p.msg;
    };
    methods["mobile"] = function (p) {
        return (/^(1)\d{10}$/.test(p.value.trim()) || !p.value) ? "" : p.msg;
    };
    methods["emailormobile"] = function (p) {
        return (/^(13|14|15|18)\d{9}$|^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/
            .test(p.value)) ? "" : p.msg;
    };
    methods["phoneormobile"] = function (p) {
        return (/^\(?(0\d{2,3}-?)?\)?\d{7,8}$|^(13|14|15|18)\d{9}$/
            .test(p.value.trim())) ? "" : p.msg;
    };
    methods["string"] = function (p) {
        return (/^[a-zA-Z\u4E00-\u9FA5]+$/.test(p.value) || !p.value) ? ""
            : p.msg;
    };
    methods["chineseChracter"] = function (p) {
        return (/^[\u4e00-\u9fa5]+$/.test(p.value)) ? "" : p.msg;
    };
    methods["idCard"] = function (p) {
        return ((checkIdcard(p.value.trim()) == "验证通过!") || !p.value) ? "" : p.msg;
    };
    methods["address"] = function (p) {
        return (/^[0-9a-zA-Z\u4E00-\u9FA5]+$/.test(p.value) || !p.value) ? ""
            : p.msg;
    };
    methods["postCode"] = function (p) {
        return (/^[0-9]\d{5}$/.test(p.value) || !p.value) ? "" : p.msg;
    };
    methods["telephone"] = function (p) {
        return (/^\(?(0\d{2,3}-?)?\)?\d{7,8}$/.test(p.value) || !p.value) ? ""
            : p.msg;
    };
    methods["policyNo"] = function (p) {
        return (/^[A-z0-9]{22}$/.test(p.value)) ? "" : p.msg;
    };
    methods["checkPwd"] = function (p) {
        return (checkPwd(p.value) == true) ? "" : p.msg;
    };
    methods["minLength"] = function (p) {
        return (p.value.length >= p.params.minLength) ? "" : p.msg;
    };
    methods["maxLength"] = function (p) {
        return (p.value.length <= p.params.maxLength) ? "" : p.msg;
    };
    methods["loginName"] = function (p) {
        return (/^[0-9a-zA-Z\_\-\u4e00-\u9fa5]+$/.test(p.value) || !p.value) ? ""
            : p.msg;
    };
    methods["lengthFromTo"] = function (p) {
        var reg = new RegExp("^.{" + p.params.from + "," + p.params.to + "}$");
        return reg.test(p.value) ? "" : p.msg;
    };
    methods["chineseChracter"] = function (p) {
        p.value = p.value.replace(/\s/g, "");
        return (/^[\u4e00-\u9fa5|\u25cf|\u2022|%b7]+$/.test(p.value)) ? "" : p.msg;
    };
    methods["blanks"] = function (p) {
        //连续空格
        return (new RegExp("\\s{" + p.params.number + ",}").test(p.value)) ? p.msg : "";
    };
    methods["consistentTo"] = function (p) {
        var to = $(p.params.to);
        return p.value == to[0].value ? "" : p.msg;
    };
    methods["passwordFormat"] = function (p) {
        //返回空字符串 校验通过
        //返回非空字符串 校验不通过
        var regChinese = /^[^\u4e00-\u9fa5]{0,}$/;
        return regChinese.test(p.value) ? "" : p.msg;
    };
    methods["licensePlateNumber2"] = function (p) {
        //车牌号
        var reg = /^[\u4e00-\u9fa5|\u25cf|\u2022]{1}[A-Z0-9]{6}$/;
        return reg.test(p.value) ? "" : p.msg;
    };
    methods["numberUppLetter"] = function (p) {
        //数字或大写字母
        var reg = /^[A-Z0-9]+$/;
        return reg.test(p.value) ? "" : p.msg;
    };
    methods["complex"] = function (p) {
        var reg = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/;//  复杂度检测
        return reg.test(p.value) ? "" : p.msg;
    };
    methods["sumFromTo"] = function (p) {
        //数值大小的范围检测   (from,to]
        var From = p.params ? (p.params.from || 0) : 0,
            To = p.params ? (p.params.to || 100) : 100,
            flag_L = p.params ? (p.params.flag_L || false) : false,
            flag_R = p.params ? (p.params.flag_R || false) : false,
            num = Number(p.value);
        if (From == "min" && To != "max") {
            //（负无穷，M)
            if (flag_R) {
                return (num > To) ? p.msg : "";
            } else {
                return (num >= To) ? p.msg : "";
            }
            // return flag_R?((num>To)? p.msg :""):((num>=To)? p.msg :"");

        } else if (From != "min" && To == "max") {
            //(M,正无穷)
            return flag_L ? ((num < From) ? p.msg : "") : ((num <= From) ? p.msg : "");

        } else if (From != "min" && To != "max") {
            // (m,n)
            if (flag_L && flag_R) {
                return (num < From || num > To) ? p.msg : "";
            } else if (flag_L && !flag_R) {
                return (num < From || num >= To) ? p.msg : "";
            } else if (!flag_L && flag_R) {
                return (num <= From || num > To) ? p.msg : "";
            } else if (!(flag_L || flag_R)) {
                return (num <= From || num >= To) ? p.msg : "";
            }
        }

    };
    //正整数校验
    methods["positiveNumber"] = function (p) {
        //  正整数检测
        return (/^[1-9]\d*$/.test(Number(p.value))) ? "" : p.msg;
    };
    //邀请码
    methods['InvitationCode'] = function (p) {

    };
    //敏感数据校验
    methods["sensitivePassword"] = function (p) {
        //其他敏感数据规则可以继续新增
        for (var key in p.params) {
            switch (key) {
                case "equal":
                    //禁止同某些输入框相同字段密码
                    for (var i = 0; i < p.params[key].length; i++) {
                        if (p.params[key][i] !== p.value) {
                            return p.msg;
                        }
                    }
                    break;
            }
        }
        return "";
    };
    // 验证身份证
    function checkIdcard(idcard) {
        idcard = idcard.toUpperCase();
        var Errors = new Array("验证通过!", "身份证号码位数不对!", "身份证号码出生日期超出范围或含有非法字符!", "身份证号码校验错误!", "身份证地区非法!");
        var area = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        var Y, JYM;
        var S, M;
        var ereg, eregNow;
        var idcard_array = new Array();
        idcard_array = idcard.split("");
        if (area[parseInt(idcard.substr(0, 2))] == null)
            return Errors[4];
        switch (idcard.length) {
            case 15:
                if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0
                    || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard
                        .substr(6, 2)) + 1900) % 4 == 0)) {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/;// 测试出生日期的合法性
                } else {
                    ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/;// 测试出生日期的合法性
                }
                if (ereg.test(idcard))
                    return Errors[0];
                else
                    return Errors[2];
                break;
            case 18:
                if (parseInt(idcard.substr(6, 4)) % 4 == 0
                    || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard
                        .substr(6, 4)) % 4 == 0)) {
                    ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;// 闰年出生日期的合法性正则表达式
                    eregNow = /^[1-9][0-9]{5}20[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/;// 闰年出生日期的合法性正则表达式
                } else {
                    ereg = /^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;// 平年出生日期的合法性正则表达式
                    eregNow = /^[1-9][0-9]{5}20[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/;// 平年出生日期的合法性正则表达式
                }
                if (ereg.test(idcard) || eregNow.test(idcard)) {
                    S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10]))
                        * 7
                        + (parseInt(idcard_array[1]) + parseInt(idcard_array[11]))
                        * 9
                        + (parseInt(idcard_array[2]) + parseInt(idcard_array[12]))
                        * 10
                        + (parseInt(idcard_array[3]) + parseInt(idcard_array[13]))
                        * 5
                        + (parseInt(idcard_array[4]) + parseInt(idcard_array[14]))
                        * 8
                        + (parseInt(idcard_array[5]) + parseInt(idcard_array[15]))
                        * 4
                        + (parseInt(idcard_array[6]) + parseInt(idcard_array[16]))
                        * 2 + parseInt(idcard_array[7]) * 1
                        + parseInt(idcard_array[8]) * 6
                        + parseInt(idcard_array[9]) * 3;
                    Y = S % 11;
                    M = "F";
                    JYM = "10X98765432";
                    M = JYM.substr(Y, 1);
                    if (M == idcard_array[17])
                        return Errors[0];
                    else
                        return Errors[3];
                } else
                    return Errors[2];
                break;
            default:
                return Errors[1];
                break;
        }

    }

    // 验证密码
    function checkPwd(value) {
        if (value == '') {
            return false;
        }
        var _reg = "^[\\w@\\-\\.]{6,16}$";
        var re = new RegExp(_reg);
        if (!re.test(value)) {
            return false;
        }
        return true;
    }

    return exports;
});