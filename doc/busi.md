## personal.busi 业务模块
- personal.busi.setLocation(params)
- personal.busi.getLocation(params)

### personal.busi.setLocation(params)
####  功能描述
- 主动定位 同时将位置信息存储起来（回调成功时默认）,异步执行
- 失败时返回默认位置信息（失败情况下永远不会存储位置信息）。

#### 入参 params(object)
字段名称|是否必须|默认值|字段说明
---|---|---|---
key|-1|location|位置信息存储的key值
isAmap|-1|false|是否获取高德定位服务信息[为true时 忽视locationByApp入参 只能浏览器定位获取信息]
longitude|-1|undefined|
latitude|-1|undefined|
callback|0|undefined|function(data,code,msg){}
successStore|-1|true|默认成功回调储存定位信息（默认存储，即覆盖用户自选的位置信息）
defaultStore|-1|false|调用失败时 是否存储默认位置信息
locationByApp|-1|isRunApp|默认取决于运行环境[isAmap 为true时无效]

#### 成功返回参数 data (object)
##### isAmap:false
字段|返回值|字段说明
---|---|---
timestamp|系统当前时间|定位的时间戳
latitude|121|经度
longitude|31|纬度
altitude|0|
accuracy|30|
altitudeAccuracy|null|
heading|0|
speed|0|

##### isAmap:true
字段|返回值|字段说明
---|---|---
timestamp|系统当前时间|定位的时间戳
latitude|传参或者系统自定位|经度
longitude|传参或者系统自定位|纬度
altitude|0|
accuracy|30|
altitudeAccuracy|null|
heading|0|
speed|0|
data.amap(key)|value|data.amap对象下字段
citycode|021|城市区号
adcode|310115|高德地区编码
neighborhoodType||
neighborhood||
building||
buildingType||
street|顾唐路|
streetNumber|1699号|
province|上海市|
city||城市名称（直辖市为空）
district|浦东新区|市级（直辖市下的区级）名称
township|唐镇|
address|上海市浦东新区唐镇顾唐路|
data.amap.businessAreas[i] (key)|value|data.amap.businessAreas数组内对象的字段（数组格式）
name|唐镇|县级（直辖市下镇级）名称
id|310115|县级（直辖市下镇级）编码
data.amap.businessAreas[i].location(key)|value|data.amap.businessAreas[i].location对象下字段
I|31.215644843333|高精度维度
C|121.6533333333|高精度经度
lng|121.6533|经度
lat|31.21564|纬度

#### 失败返回参数 data(object)
##### isAmap:false （data 为默认位置对象）
字段|返回值|字段说明
---|---|---
latitude|121|经度
longitude|31|纬度

##### isAmap:true 同时 code==99时
字段|返回值|字段说明
---|---|---
timestamp|1233344|定位的时间戳
latitude|121|经度
longitude|31|纬度
altitude|0|
accuracy|30|
altitudeAccuracy|null|
heading|0|
speed|0|
data.amap(key)|value|data.amap对象下的字段值
city|上海市|默认城市值
province|上海市|默认省份值

##### isAmap:true 同时 code 为其他值
字段|返回值|字段说明
---|---|---
latitude|121|经度
longitude|31|纬度

#### 回调函数 code 值
code值|相关联的常量（msg）|描述
---|---|---
0|您的浏览器暂不支持定位功能|浏览器暂不支持或者没有权限（没有授权）
1|PERMISSION_DENIED|地理位置信息的获取失败，因为该页面没有获取地理位置信息的权限。
2|POSITION_UNAVAILABLE|地理位置获取失败，因为至少有一个内部位置源返回一个内部错误。
3|TIMEOUT|获取地理位置超时，通过定义PositionOptions.timeout 来设置获取地理位置的超时时长。
99|经纬度成功，但城市信息获取失败|经纬度获取成功，但没有拿到城市信息
100|success|定位成功

#### demo
```javascript
    //before
    personal.map.location({
        callback: function (data, status, msg) {
            if (status === 100) {
                //设置定位结果
                personal.setLocalStorage('location', data, true);
            } else {
                // personal.ui.toast("定位失败！");
            }
        }
    });
    //now 
    personal.busi.setLocation({
        callback: function (data, code, msg) {
            if (100 === code) {
                console.log(code + JSON.stringify(data));
            } else {
                // personal.ui.toast("定位失败！");
            }
        }
    })
```
### personal.busi.getLocation(params)
####  功能描述
- 获取定位信息不存在时主动定位同时将位置信息存储起来,异步执行

#### 入参 params(object)
字段名称|是否必须|默认值|字段说明
---|---|---|---
key|-1|location|位置信息存储的key值
isAmap|-1|false|是否获取高德定位服务信息[为true时 忽视locationByApp入参 只能浏览器定位获取信息]
longitude|-1|undefined|
latitude|-1|undefined|
callback|0|undefined|function(data,code,msg){}
successStore|-1|true|默认成功回调储存定位信息（默认存储，即覆盖用户自选的位置信息）
defaultStore|-1|false|调用失败时 是否存储默认位置信息
locationByApp|-1|isRunApp|默认取决于运行环境[isAmap 为true时无效]
callback|undefined|function(data,code,msg){}

#### 成功返回参数 data (object)
- 同personal.busi.setLocation(params)

#### 失败返回参数 data(object)
- 同personal.busi.setLocation(params)

#### 回调函数 code 值
- 同personal.busi.setLocation(params)

#### demo
```javascript
    //获取定位信息，之后调用商圈数据
    personal.busi.getLocation({
        isAmap: true,
        callback: function (data, code, msg) {
            //if you do not want the default value,just add block : if(code===100){ // do something }
            //获取位置信息
            if (data.cityInfo && data.cityInfo.cityCode) {
                locationFunc(data);
            } else {
                //新增cityInfo城市信息
                personal.city.getCityCode({
                    cityName: data.amap.city,
                    provinceName: data.amap.province,
                    callback: function (cityData, cityCode, cityMsg) {
                        if (100 === cityCode) {
                            data.cityInfo = cityData;
                            locationFunc(data);
                            //缓存位置信息(非默认数据)
                            (code === 100) && personal.setLocalStorage('location', data, true);
                        } else {
                            console.log(cityMsg);
                        }
                    }
                });
            }
        }
    });
    //demo2
    personal.busi.getLocation({
        callback:function (data,code,msg) {
            if(100===code){
                personal.ajax({
                    url: "shop/getShopDetailInfo",
                    data: {
                        shopNo: _urlObj.shopNo,
                        userLnt: data.longitude,
                        userLat: data.latitude
                    },
                    callback: function (data, code) {
                        if (code === 100) {
                            console.log(JSON.stringify(data));
                            $("#pageShopDetail").prepend(personal.util.template($("#shopInfoTemplate").html(), data.result || {}));
                            pageEvent(data.result.shopInfo);
                        }
                        personal.ui.hideLoading();
                    }
                });
            }else{
                console.log(msg||"定位失败");
            }
        }
    })
```