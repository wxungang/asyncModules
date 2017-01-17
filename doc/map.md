## personal.map组件
- personal.map.location(params)
- personal.map.getLocation(params)

### personal.map.location(params) 
####     方法功能描述
- 不依赖高德定位，获取用户当前位置的经纬度信息（无法获取地理名称、城市、街区等信息）
- [webAPI](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation)

#### 入参 params(object)
字段名称|是否必须|默认值|字段说明
---|---|---|---
enableHighAccuracy|-1(否)||false |地理位置的高度信息
timeout|-1|5000|超时时间（单位ms）
maximumAge|-1|0|定位的缓存时间
callback|0(建议)|function(data,code,msg){}|回调函数

#### 成功反参 data(object)
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

#### 失败返回参数 data(object)  
- data 为空对象 {}

#### 回调函数 code 值
code值|相关联的常量（msg）|描述
---|---|---
0|您的浏览器暂不支持定位功能|浏览器暂不支持或者没有权限（没有授权）
1|PERMISSION_DENIED|地理位置信息的获取失败，因为该页面没有获取地理位置信息的权限。
2|POSITION_UNAVAILABLE|地理位置获取失败，因为至少有一个内部位置源返回一个内部错误。
3|TIMEOUT|获取地理位置超时，通过定义PositionOptions.timeout 来设置获取地理位置的超时时长。
100|success|定位成功

#### demo
```javascript
    personal.map.location({
        enableHighAccuracy:false,
        timeout:10000,
        callback:function(data,code,msg) {
           if(100===code){
               conosle.log(msg||'定位成功')
               alert(JSON.stringify(data));
           }else {
               conosle.log(msg||'定位失败')
               alert(JSON.stringify(data));
           }
        }
    })
    //data(success)
    data={
        timestamp:1233344,//时间戳
        latitude:121,
        longitude:31,
        altitude:0,
        accuracy:30,
        altitudeAccuracy:null,
        heading:0,
        speed:0
    }
    //data(error)
    data={}
```
### personal.map.getLocation(params)
####    方法功能描述
- 利用经纬度信息，通过高德服务获取对应经纬度的城市、街区、路段等详细地理位置（不传入经纬度，则主动定位当前位置）

#### 方法入参 params(object)
字段名称|是否必须|默认值|字段说明
---|---|---|---
longitude|-1|undefined| 经度（不提供则主动定位获取）
latitude|-1|undefined| 纬度（不提供则主动定位获取）
callback|0|function(data,code,msg){}|回调函数

#### 成功函数返回参数 data(object)
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
data.amap(key)|value|data.amap对象下字段
citycode|021|城市区号
adcode|310115|高德地区编码
neighborhoodType||
neighborhood||
building||
buildingType||
street|张江路|
streetNumber|169|
province|上海市|
city||城市名称（直辖市为空）
district|浦东新区|市级（直辖市下的区级）名称
township|张江|
address|上海市浦东新区张江张江路|
data.amap.businessAreas[i]（key）|value|data.amap.businessAreas数组内对象的字段（数组格式）
name|唐镇|县级（直辖市下镇级）名称
id|310115|县级（直辖市下镇级）编码
data.amap.businessAreas[i].location(key)|value|data.amap.businessAreas[i].location对象下字段
I|31.215644843333|高精度维度
C|121.6533333333|高精度经度
lng|121.6533|经度
lat|31.21564|纬度

#### 失败函数返回参数 data(object)
##### code==99时
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

##### 其他情况：
 data 空对象 {}
 
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
    personal.map.getLocation({
        callback:function(data,code,msg) {
            if(100===code){
               conosle.log(msg||'定位成功')
               alert(JSON.stringify(data));
            }else {
               conosle.log(msg||'定位失败')
               alert(JSON.stringify(data));
            }
        }
    })
    //data(success)
    data={
        timestamp:1233344,//时间戳
        latitude:121,
        longitude:31,
        altitude:0,
        accuracy:30,
        altitudeAccuracy:null,
        heading:0,
        speed:0,
        amap:{
            citycode:021,
            adcode:310115,
            neighborhoodType:"",
            neighborhood:"",
            building:"",
            buildingType:"",
            street:"张江路",
            streetNumber:"169",
            province:"上海市",
            city:"",
            district:"浦东新区",
            township:"张江",
            address:"上海市浦东新区上海张江高科技园区",
            businessAreas:[{
                name:"张江",
                id:"310115",
                location:{
                    I:"31.215644843333",
                    C:"121.6533333333",
                    lng:"121.6533",
                    lat:"31.21564"
                }
            }]
        }
    }
    //data(error)
    data={
        timestamp:1233344,//时间戳
        latitude:121,
        longitude:31,
        altitude:0,
        accuracy:30,
        altitudeAccuracy:null,
        heading:0,
        speed:0,
    }
    //data(error)
    data={}
```