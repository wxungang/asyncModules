/**
 * Created by xiaogang on 2016/8/10.
 */
"use strict";
define(function (require) {
    var _this = null;
    /**
     * 每个模块对外只暴露一个函数，通过获取用户的调用函数名和参数，模块内部去调用相应的函数
     * funcName:用户调用的函数名称
     * params:用户调用的入参（只接受对象格式）
     */
    var exports = function (funcName, params) {
        _this = this;
        if (typeof funcName === "string") {
            //加载完成之后直接挂载到up下,下次使用再需要加载模块
            _this.photo = _photo;
            _this.photo[funcName](params);
            //会导致每次require、load模块
            //_feedback[funcName].call(_this, params);

        } else {
            return;
        }

    };
    var _photo = {};
    _photo.compress=function(p){
        //默认参数
        var options={
            imgdom:"data:image/jpeg;base64,",
            quality:0.7,
            waterMark:{
                text:"水印文字",
                font:"100px serif",
                testAlign:"center",
                textBaseline:"middle",
                positionX:0.5,
                positionY:0.5
            }
        };

        $.extend(options, p);


        //base64为图像数据
        var image=new Image();
        image.onload=function(){
            options.callback(canvastodata(image));
        };
        image.src="string"==typeof(options.imgdom)?options.imgdom:URL.createObjectURL(options.imgdom);

        //图片压缩的核心方法
        function canvastodata (idom) {
            try{
                var _quality=options.quality>1?1:options.quality;
                //创建画布
                var cans=document.createElement("canvas");
                cans.width=idom.naturalWidth;
                cans.height=idom.naturalHeight;
                //获取画布上下文。同时在画布上下文上绘制图片
                var ctx = cans.getContext("2d");
                ctx.drawImage(idom, 0, 0);

                //添加水印
                ctx.font =options.waterMark.font;
                ctx.textAlign=options.waterMark.testAlign;
                ctx.textBaseline =options.waterMark.textBaseline;
                ctx.fillText(options.waterMark.text, cans.width*options.waterMark.positionX, cans.height*options.waterMark.positionY);

                return cans.toDataURL("image/jpeg",_quality);
            }catch(e){
                return false;
            }
        }
    };


    return exports;
});