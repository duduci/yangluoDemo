//选项卡模块
var nav = document.querySelector(".nav");
var lis = nav.children; // 得到4个小li
// 2.循环注册事件
for (var i = 0; i < lis.length; i++) {
    lis[i].onmouseover = function () {
        this.children[1].style.display = "block";
    }
    lis[i].onmouseout = function () {
        this.children[1].style.display = "none";
    }
}
//cesium ion
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkYjIxYWFiNS1iMGRmLTQ1ODItOWUxOC04MTM4NDlhYzNjYzQiLCJpZCI6MzQ1MjQsImlhdCI6MTYwMDQxODI0N30.Xt932HCJiDQ-mGHh0lwQsWqnuey2BcRfickTFAYRZw0";
//公共模块
var viewer = new Cesium.Viewer("cesiumContainer", {
    animation: false, //是否显示动画控件
    shouldAnimate: true,
    homeButton: false, //是否显示Home按钮
    fullscreenButton: false, //是否显示全屏按钮
    baseLayerPicker: false, //是否显示图层选择控件
    geocoder: false, //不显示地名查找控件
    timeline: false, //不显示时间轴控件
    sceneModePicker: true, //显示投影方式控件
    navigationHelpButton: false, //不显示帮助信息控件
    infoBox: false, //不显示点击要素之后显示的信息
    requestRenderMode: true, //启用请求渲染模式
    scene3DOnly: true, //每个几何实例将只能以3D渲染以节省GPU内存
    sceneMode: 3, //初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
    fullscreenElement: document.body
});


//在线天地图影像服务地址(墨卡托投影)
var TDT_IMG_W = "http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default&format=tiles&tk=" + "c0eb9d6523a6f5bf7142562be12c0401";
//在线天地图矢量地图服务(墨卡托投影)
var TDT_VEC_W = "http://{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default&format=tiles&tk=" + "c0eb9d6523a6f5bf7142562be12c0401";
//在线天地图影像中文标记服务(墨卡托投影)
var TDT_CIA_W = "http://{s}.tianditu.gov.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=" + "c0eb9d6523a6f5bf7142562be12c0401";
//在线天地图矢量中文标记服务(墨卡托投影)
var TDT_CVA_W = "http://{s}.tianditu.gov.cn/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0" +
    "&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
    "&style=default.jpg&tk=" + "c0eb9d6523a6f5bf7142562be12c0401";
var lat = 30.658141;
var lon = 114.56064;
viewer.scene.globe.enableLighting = false;
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.globe.showGroundAtmosphere = false;
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(114.56064, 30.658141, 2000.0)
});
<!-- 经纬度实时显示 -->
var longitude_show=document.getElementById('longitude_show');
var latitude_show=document.getElementById('latitude_show');
var altitude_show=document.getElementById('altitude_show');
var canvas=viewer.scene.canvas;
//具体事件的实现
var ellipsoid=viewer.scene.globe.ellipsoid;
var handler = new Cesium.ScreenSpaceEventHandler(canvas);
handler.setInputAction(function(movement){
    //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
    var cartesian=viewer.camera.pickEllipsoid(movement.endPosition, ellipsoid);
    if(cartesian){
        //将笛卡尔三维坐标转为地图坐标（弧度）
        var cartographic=viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        //将地图坐标（弧度）转为十进制的度数
        var lat_String=Cesium.Math.toDegrees(cartographic.latitude).toFixed(4);
        var log_String=Cesium.Math.toDegrees(cartographic.longitude).toFixed(4);
        var alti_String=(viewer.camera.positionCartographic.height/1000).toFixed(2);
        longitude_show.innerHTML=log_String;
        latitude_show.innerHTML=lat_String;
        altitude_show.innerHTML=alti_String;
    }
},Cesium.ScreenSpaceEventType.MOUSE_MOVE);
//取消双击事件
viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
//扫描操作组件
var CartographicCenter = new Cesium.Cartographic(Cesium.Math.toRadians(lon), Cesium.Math.toRadians(lat), 0);
var scanColor = new Cesium.Color(1.0, 0.0, 0.0, 1);
//地图切换模块
function getTDYXMap() {
    viewer.imageryLayers.removeAll()
    viewer.terrainProvider = Cesium.createWorldTerrain()
    let Img = new Cesium.WebMapTileServiceImageryProvider({   //调用影像中文服务
        url: TDT_IMG_W,//url地址
        layer: "img_w",	//WMTS请求的层名称
        style: "default",//WMTS请求的样式名称
        format: "tiles",//MIME类型，用于从服务器检索图像
        tileMatrixSetID: "GoogleMapsCompatible",//	用于WMTS请求的TileMatrixSet的标识符
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
        minimumLevel: 0,//最小层级
        maximumLevel: 18,//最大层级
    })
    viewer.imageryLayers.addImageryProvider(Img)//添加到cesium图层上
    let tdt = new Cesium.WebMapTileServiceImageryProvider({   //调用影像中文注记服务
        url: TDT_CIA_W,
        layer: "cia_w",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "GoogleMapsCompatible",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
        minimumLevel: 0,
        maximumLevel: 18,
    })
    viewer.imageryLayers.addImageryProvider(tdt)//添加到cesium图层上
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.56064, 30.658141, 15000.0), // 设置位置

        orientation: {
            heading: Cesium.Math.toRadians(20.0), // 方向
            pitch: Cesium.Math.toRadians(-90.0),// 倾斜角度
            roll: 0
        }
    });
}
function getTDSLMap() {
    viewer.imageryLayers.removeAll()
    viewer.terrainProvider = Cesium.createWorldTerrain()
    let Png = new Cesium.WebMapTileServiceImageryProvider({   //调用影像中文服务
        url: TDT_VEC_W,//url地址
        layer: "img_w",	//WMTS请求的层名称
        style: "default",//WMTS请求的样式名称
        format: "tiles",//MIME类型，用于从服务器检索图像
        tileMatrixSetID: "GoogleMapsCompatible",//	用于WMTS请求的TileMatrixSet的标识符
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
        minimumLevel: 0,//最小层级
        maximumLevel: 18,//最大层级
    })
    viewer.imageryLayers.addImageryProvider(Png)//添加到cesium图层上
    let rpg = new Cesium.WebMapTileServiceImageryProvider({   //调用影像中文注记服务
        url: TDT_CVA_W,
        layer: "cia_w",
        style: "default",
        format: "tiles",
        tileMatrixSetID: "GoogleMapsCompatible",
        subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],//天地图8个服务器
        minimumLevel: 0,
        maximumLevel: 18,
    })
    viewer._cesiumWidget._creditContainer.style.display = "none";
    viewer.imageryLayers.addImageryProvider(rpg)//添加到cesium图层上
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.56064, 30.658141, 15000.0), // 设置位置

        orientation: {
            heading: Cesium.Math.toRadians(20.0), // 方向
            pitch: Cesium.Math.toRadians(-90.0),// 倾斜角度
            roll: 0
        }
    });
}

function getBaiduMap() {
    viewer.imageryLayers.removeAll()
    var bd = new BaiduImageryProvider({
        url: "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1",
        minimumLevel: 0,
        maximumLevel: 18
    })
    viewer.imageryLayers.addImageryProvider(bd)
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.56064, 30.658141, 15000.0), // 设置位置

        orientation: {
            heading: Cesium.Math.toRadians(20.0), // 方向
            pitch: Cesium.Math.toRadians(-90.0),// 倾斜角度
            roll: 0
        }
    })
}

function getamap() {
    viewer.imageryLayers.removeAll();
    var amap = new Cesium.UrlTemplateImageryProvider({
        url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
        style: "default",
        format: "image/png",
        tileMatrixSetID: "GoogleMapsCompatible",
        show: false,
        minimumLevel: 0,
        maximumLevel: 18
    });
    viewer.imageryLayers.addImageryProvider(amap);
    var tdtLayer = new Cesium.UrlTemplateImageryProvider({
        url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
        minimumLevel: 0,
        maximumLevel: 18
    });
    viewer.imageryLayers.addImageryProvider(tdtLayer);
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.56064, 30.658141, 15000.0), // 设置位置
        orientation: {
            heading: Cesium.Math.toRadians(20.0), // 方向
            pitch: Cesium.Math.toRadians(-90.0),// 倾斜角度
            roll: 0
        }
    })
}

//3D模型模块
function addMan() {
    viewer.entities.removeAll();
    var position = Cesium.Cartesian3.fromDegrees(
        114.56064,
        30.658141,
        0
    );
    var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
    );

    var entity = viewer.entities.add({
        name: "人",
        position: position,
        orientation: orientation,
        model: {
            uri: "SampleData/models/CesiumMan/Cesium_Man.glb",
            minimumPixelSize: 100,
            maximumScale: 2000,
        },
    });
    viewer.trackedEntity = entity;
}

function addCar() {
    viewer.entities.removeAll();

    var position = Cesium.Cartesian3.fromDegrees(
        114.56064,
        30.658141,
        0
    );
    var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
    );

    var entity = viewer.entities.add({
        name: "车",
        position: position,
        orientation: orientation,
        model: {
            uri: "SampleData/models/GroundVehicle/GroundVehicle.glb",
            minimumPixelSize: 100,
            maximumScale: 2000,
        },
    });
    viewer.trackedEntity = entity;
}

function addPlane() {
    viewer.entities.removeAll();

    var position = Cesium.Cartesian3.fromDegrees(
        114.56064,
        30.658141,
        2000
    );
    var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
    );

    var entity = viewer.entities.add({
        name: "飞机",
        position: position,
        orientation: orientation,
        model: {
            uri: "SampleData/models/CesiumAir/Cesium_Air.glb",
            minimumPixelSize: 100,
            maximumScale: 2000,
        },
    });
    viewer.trackedEntity = entity;
}

function addCity() {
    viewer.entities.removeAll();
    var position = Cesium.Cartesian3.fromDegrees(
        114.56064,
        30.658141,
        5
    );
    var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
    );

    var entity = viewer.entities.add({
        name: "城市模型",
        position: position,
        orientation: orientation,
        model: {
            uri: "city.glb",
            minimumPixelSize: 100,
            maximumScale: 2000,
        },
    });
    viewer.trackedEntity = entity;
}

function manMove() {
    var czml = [
        {
            id: "document",
            name: "实时路线",
            version: "1.0",
            clock: {
                interval: "2021-02-04T10:00:00Z/2021-02-04T10:15:00Z",
                currentTime: "2021-02-04T10:00:00Z",
                multiplier: 10,
            },
        },
        {
            id: "path",
            name: "path with GPS flight data",
            availability: "2021-02-04T10:00:00Z/2021-02-04T10:15:10Z",
            path: {
                material: {
                    polylineOutline: {
                        color: {
                            rgba: [255, 0, 255, 255],
                        },
                        outlineColor: {
                            rgba: [0, 255, 255, 255],
                        },
                        outlineWidth: 5,
                    },
                },
                width: 8,
                leadTime: 10,
                trailTime: 1000,
                resolution: 5,
            },
            model: {
                gltf: "./SampleData/models/CesiumMan/Cesium_Man.glb",
                scale: 2.0,
                minimumPixelSize: 64,
            },
            position: {
                epoch: "2021-02-04T10:00:00Z",
                cartographicDegrees: [
                    0,
                    115.26975,
                    30.14760,
                    0,
                    10,
                    115.26658,
                    30.15185,
                    0,
                    20,
                    115.26195,
                    30.15644,
                    0,
                    30,
                    115.25646,
                    30.16228,
                    0,
                    40,
                    115.25213,
                    30.16721,
                    0,
                    50,
                    115.24751,
                    30.17276,
                    0,
                    60,
                    115.24220,
                    30.17748,
                    0,
                    70,
                    115.23755,
                    30.17989,
                    0,
                    80,
                    115.23297,
                    30.18379,
                    0,
                    90,
                    115.22859,
                    30.18804,
                    0,
                    100,
                    115.22558,
                    30.19693,
                    0,
                    110,
                    115.22056,
                    30.20161,
                    0,
                    120,
                    115.21515,
                    30.20840,
                    0,
                    130,
                    115.20789,
                    30.21240,
                    0,
                    140,
                    115.20116,
                    30.21671,
                    0,
                    150,
                    115.19717,
                    30.21889,
                    0,
                    160,
                    115.19300,
                    30.22010,
                    0,
                    170,
                    115.18971,
                    30.22062,
                    0,
                    180,
                    115.18148,
                    30.22128,
                    0,
                    190,
                    115.17726,
                    30.21912,
                    0,
                    200,
                    115.16374,
                    30.21705,
                    0,
                    210,
                    115.15962,
                    30.21855,
                    0,
                    220,
                    115.15367,
                    30.21507,
                    0,
                    230,
                    115.15032,
                    30.21187,
                    0,
                    240,
                    115.14171,
                    30.21082,
                    0,
                    250,
                    115.12911,
                    30.21186,
                    0,
                    260,
                    115.12364,
                    30.21196,
                    0,
                    270,
                    115.10882,
                    30.21421,
                    0,
                    280,
                    115.09719,
                    30.21750,
                    0,
                    290,
                    115.08797,
                    30.22425,
                    0,
                    300,
                    115.07688,
                    30.23393,
                    0,
                    310,
                    115.07139,
                    30.24408,
                    0,
                    320,
                    115.07102,
                    30.25518,
                    0,
                    330,
                    115.07333,
                    30.26587,
                    0,
                    340,
                    115.07761,
                    30.27891,
                    0,
                    350,
                    115.07875,
                    30.29568,
                    0,
                    360,
                    115.07975,
                    30.32844,
                    0,
                    370,
                    115.07712,
                    30.34304,
                    0,
                    380,
                    115.07019,
                    30.35782,
                    0,
                    390,
                    115.06356,
                    30.36863,
                    0,
                    400,
                    115.05421,
                    30.38260,
                    0,
                    410,
                    115.03986,
                    30.39367,
                    0,
                    420,
                    115.02362,
                    30.40179,
                    0,
                    430,
                    115.00901,
                    30.40360,
                    0,
                    440,
                    114.99281,
                    30.40201,
                    0,
                    450,
                    114.97667,
                    30.40240,
                    0,
                    460,
                    114.93114,
                    30.40770,
                    0,
                    470,
                    114.91566,
                    30.40999,
                    0,
                    480,
                    114.89645,
                    30.41193,
                    0,
                    490,
                    114.88024,
                    30.41519,
                    0,
                    500,
                    114.86765,
                    30.42093,
                    0,
                    510,
                    114.85384,
                    30.42425,
                    0,
                    520,
                    114.83640,
                    30.43211,
                    0,
                    530,
                    114.83068,
                    30.43594,
                    0,
                    540,
                    114.82724,
                    30.44198,
                    0,
                    550,
                    114.82562,
                    30.44521,
                    0,
                    560,
                    114.82484,
                    30.44936,
                    0,
                    570,
                    114.82389,
                    30.45564,
                    0,
                    580,
                    114.82406,
                    30.45992,
                    0,
                    590,
                    114.82372,
                    30.47406,
                    0,
                    600,
                    114.82516,
                    30.49165,
                    0,
                    610,
                    114.82694,
                    30.50335,
                    0,
                    620,
                    114.82906,
                    30.51491,
                    0,
                    630,
                    114.83101,
                    30.52831,
                    0,
                    640,
                    114.83284,
                    30.54196,
                    0,
                    650,
                    114.83305,
                    30.55881,
                    0,
                    660,
                    114.83321,
                    30.57829,
                    0,
                    670,
                    114.82619,
                    30.59483,
                    0,
                    680,
                    114.81247,
                    30.60426,
                    0,
                    690,
                    114.80255,
                    30.60998,
                    0,
                    700,
                    114.79638,
                    30.61162,
                    0,
                    710,
                    114.79082,
                    30.61401,
                    0,
                    720,
                    114.78054,
                    30.61543,
                    0,
                    730,
                    114.77067,
                    30.61614,
                    0,
                    740,
                    114.76111,
                    30.61383,
                    0,
                    750,
                    114.75268,
                    30.61169,
                    0,
                    760,
                    114.75874,
                    30.61249,
                    0,
                    770,
                    114.74158,
                    30.60359,
                    0,
                    780,
                    114.72967,
                    30.59167,
                    0,
                    790,
                    114.70995,
                    30.58064,
                    0,
                    800,
                    114.68611,
                    30.57672,
                    0,
                    810,
                    114.66146,
                    30.57272,
                    0,
                    820,
                    114.63528,
                    30.56356,
                    0,
                    830,
                    114.62677,
                    30.55645,
                    0,
                    840,
                    114.61444,
                    30.55796,
                    0,
                    850,
                    114.60458,
                    30.56169,
                    0,
                    860,
                    114.58576,
                    30.57697,
                    0,
                    870,
                    114.57156,
                    30.59981,
                    0,
                    880,
                    114.56362,
                    30.62035,
                    0,
                    890,
                    114.55112,
                    30.64312,
                    0,
                    900,
                    114.54914,
                    30.65246,
                    0,
                    910,
                ],
            },
        },
    ];
    viewer.dataSources
        .add(Cesium.CzmlDataSource.load(czml))
        .then(function (ds) {//令模型方向与路线方向一致
            viewer.trackedEntity = ds.entities.getById("path");
            viewer.trackedEntity.orientation = new Cesium.VelocityOrientationProperty(viewer.trackedEntity.position);
        });
}

function carMove() {
    var czml = [
        {
            id: "document",
            name: "实时路线",
            version: "1.0",
            clock: {
                interval: "2021-02-04T10:00:00Z/2021-02-04T10:15:00Z",
                currentTime: "2021-02-04T10:00:00Z",
                multiplier: 10,
            },
        },
        {
            id: "path",
            name: "path with GPS flight data",
            availability: "2021-02-04T10:00:00Z/2021-02-04T10:15:10Z",
            path: {
                material: {
                    polylineOutline: {
                        color: {
                            rgba: [255, 0, 255, 255],
                        },
                        outlineColor: {
                            rgba: [0, 255, 255, 255],
                        },
                        outlineWidth: 5,
                    },
                },
                width: 8,
                leadTime: 10,
                trailTime: 1000,
                resolution: 5,
            },
            model: {
                gltf: "./SampleData/models/GroundVehicle/GroundVehicle.glb",
                scale: 4.0,
                minimumPixelSize: 100,
            },
            position: {
                epoch: "2021-02-04T10:00:00Z",
                cartographicDegrees: [
                    0,
                    115.26975,
                    30.14760,
                    0,
                    10,
                    115.26658,
                    30.15185,
                    0,
                    20,
                    115.26195,
                    30.15644,
                    0,
                    30,
                    115.25646,
                    30.16228,
                    0,
                    40,
                    115.25213,
                    30.16721,
                    0,
                    50,
                    115.24751,
                    30.17276,
                    0,
                    60,
                    115.24220,
                    30.17748,
                    0,
                    70,
                    115.23755,
                    30.17989,
                    0,
                    80,
                    115.23297,
                    30.18379,
                    0,
                    90,
                    115.22859,
                    30.18804,
                    0,
                    100,
                    115.22558,
                    30.19693,
                    0,
                    110,
                    115.22056,
                    30.20161,
                    0,
                    120,
                    115.21515,
                    30.20840,
                    0,
                    130,
                    115.20789,
                    30.21240,
                    0,
                    140,
                    115.20116,
                    30.21671,
                    0,
                    150,
                    115.19717,
                    30.21889,
                    0,
                    160,
                    115.19300,
                    30.22010,
                    0,
                    170,
                    115.18971,
                    30.22062,
                    0,
                    180,
                    115.18148,
                    30.22128,
                    0,
                    190,
                    115.17726,
                    30.21912,
                    0,
                    200,
                    115.16374,
                    30.21705,
                    0,
                    210,
                    115.15962,
                    30.21855,
                    0,
                    220,
                    115.15367,
                    30.21507,
                    0,
                    230,
                    115.15032,
                    30.21187,
                    0,
                    240,
                    115.14171,
                    30.21082,
                    0,
                    250,
                    115.12911,
                    30.21186,
                    0,
                    260,
                    115.12364,
                    30.21196,
                    0,
                    270,
                    115.10882,
                    30.21421,
                    0,
                    280,
                    115.09719,
                    30.21750,
                    0,
                    290,
                    115.08797,
                    30.22425,
                    0,
                    300,
                    115.07688,
                    30.23393,
                    0,
                    310,
                    115.07139,
                    30.24408,
                    0,
                    320,
                    115.07102,
                    30.25518,
                    0,
                    330,
                    115.07333,
                    30.26587,
                    0,
                    340,
                    115.07761,
                    30.27891,
                    0,
                    350,
                    115.07875,
                    30.29568,
                    0,
                    360,
                    115.07975,
                    30.32844,
                    0,
                    370,
                    115.07712,
                    30.34304,
                    0,
                    380,
                    115.07019,
                    30.35782,
                    0,
                    390,
                    115.06356,
                    30.36863,
                    0,
                    400,
                    115.05421,
                    30.38260,
                    0,
                    410,
                    115.03986,
                    30.39367,
                    0,
                    420,
                    115.02362,
                    30.40179,
                    0,
                    430,
                    115.00901,
                    30.40360,
                    0,
                    440,
                    114.99281,
                    30.40201,
                    0,
                    450,
                    114.97667,
                    30.40240,
                    0,
                    460,
                    114.93114,
                    30.40770,
                    0,
                    470,
                    114.91566,
                    30.40999,
                    0,
                    480,
                    114.89645,
                    30.41193,
                    0,
                    490,
                    114.88024,
                    30.41519,
                    0,
                    500,
                    114.86765,
                    30.42093,
                    0,
                    510,
                    114.85384,
                    30.42425,
                    0,
                    520,
                    114.83640,
                    30.43211,
                    0,
                    530,
                    114.83068,
                    30.43594,
                    0,
                    540,
                    114.82724,
                    30.44198,
                    0,
                    550,
                    114.82562,
                    30.44521,
                    0,
                    560,
                    114.82484,
                    30.44936,
                    0,
                    570,
                    114.82389,
                    30.45564,
                    0,
                    580,
                    114.82406,
                    30.45992,
                    0,
                    590,
                    114.82372,
                    30.47406,
                    0,
                    600,
                    114.82516,
                    30.49165,
                    0,
                    610,
                    114.82694,
                    30.50335,
                    0,
                    620,
                    114.82906,
                    30.51491,
                    0,
                    630,
                    114.83101,
                    30.52831,
                    0,
                    640,
                    114.83284,
                    30.54196,
                    0,
                    650,
                    114.83305,
                    30.55881,
                    0,
                    660,
                    114.83321,
                    30.57829,
                    0,
                    670,
                    114.82619,
                    30.59483,
                    0,
                    680,
                    114.81247,
                    30.60426,
                    0,
                    690,
                    114.80255,
                    30.60998,
                    0,
                    700,
                    114.79638,
                    30.61162,
                    0,
                    710,
                    114.79082,
                    30.61401,
                    0,
                    720,
                    114.78054,
                    30.61543,
                    0,
                    730,
                    114.77067,
                    30.61614,
                    0,
                    740,
                    114.76111,
                    30.61383,
                    0,
                    750,
                    114.75268,
                    30.61169,
                    0,
                    760,
                    114.75874,
                    30.61249,
                    0,
                    770,
                    114.74158,
                    30.60359,
                    0,
                    780,
                    114.72967,
                    30.59167,
                    0,
                    790,
                    114.70995,
                    30.58064,
                    0,
                    800,
                    114.68611,
                    30.57672,
                    0,
                    810,
                    114.66146,
                    30.57272,
                    0,
                    820,
                    114.63528,
                    30.56356,
                    0,
                    830,
                    114.62677,
                    30.55645,
                    0,
                    840,
                    114.61444,
                    30.55796,
                    0,
                    850,
                    114.60458,
                    30.56169,
                    0,
                    860,
                    114.58576,
                    30.57697,
                    0,
                    870,
                    114.57156,
                    30.59981,
                    0,
                    880,
                    114.56362,
                    30.62035,
                    0,
                    890,
                    114.55112,
                    30.64312,
                    0,
                    900,
                    114.54914,
                    30.65246,
                    0,
                    910,
                ],
            },
        },
    ];
    viewer.dataSources
        .add(Cesium.CzmlDataSource.load(czml))
        .then(function (ds) {//令模型方向与路线方向一致
            viewer.trackedEntity = ds.entities.getById("path");
            viewer.trackedEntity.orientation = new Cesium.VelocityOrientationProperty(viewer.trackedEntity.position);
        });
}

function planeMove() {
    var czml = [
        {
            id: "document",
            name: "实时路线",
            version: "1.0",
            clock: {
                interval: "2021-02-04T10:00:00Z/2021-02-04T10:15:00Z",
                currentTime: "2021-02-04T10:00:00Z",
                multiplier: 10,
            },
        },
        {
            id: "path",
            name: "path with GPS flight data",
            availability: "2021-02-04T10:00:00Z/2021-02-04T10:15:10Z",
            path: {
                material: {
                    polylineOutline: {
                        color: {
                            rgba: [255, 0, 255, 255],
                        },
                        outlineColor: {
                            rgba: [0, 255, 255, 255],
                        },
                        outlineWidth: 5,
                    },
                },
                width: 8,
                leadTime: 10,
                trailTime: 1000,
                resolution: 5,
            },
            model: {
                gltf: "./SampleData/models/CesiumAir/Cesium_Air.glb",
                scale: 2.0,
                minimumPixelSize: 128,
            },
            position: {
                epoch: "2021-02-04T10:00:00Z",
                cartographicDegrees: [
                    0,
                    115.26975,
                    30.14760,
                    0,
                    10,
                    115.26658,
                    30.15185,
                    0,
                    20,
                    115.26195,
                    30.15644,
                    0,
                    30,
                    115.25646,
                    30.16228,
                    0,
                    40,
                    115.25213,
                    30.16721,
                    0,
                    50,
                    115.24751,
                    30.17276,
                    0,
                    60,
                    115.24220,
                    30.17748,
                    0,
                    70,
                    115.23755,
                    30.17989,
                    0,
                    80,
                    115.23297,
                    30.18379,
                    0,
                    90,
                    115.22859,
                    30.18804,
                    0,
                    100,
                    115.22558,
                    30.19693,
                    0,
                    110,
                    115.22056,
                    30.20161,
                    0,
                    120,
                    115.21515,
                    30.20840,
                    0,
                    130,
                    115.20789,
                    30.21240,
                    0,
                    140,
                    115.20116,
                    30.21671,
                    0,
                    150,
                    115.19717,
                    30.21889,
                    0,
                    160,
                    115.19300,
                    30.22010,
                    0,
                    170,
                    115.18971,
                    30.22062,
                    0,
                    180,
                    115.18148,
                    30.22128,
                    0,
                    190,
                    115.17726,
                    30.21912,
                    0,
                    200,
                    115.16374,
                    30.21705,
                    0,
                    210,
                    115.15962,
                    30.21855,
                    0,
                    220,
                    115.15367,
                    30.21507,
                    0,
                    230,
                    115.15032,
                    30.21187,
                    0,
                    240,
                    115.14171,
                    30.21082,
                    0,
                    250,
                    115.12911,
                    30.21186,
                    0,
                    260,
                    115.12364,
                    30.21196,
                    0,
                    270,
                    115.10882,
                    30.21421,
                    0,
                    280,
                    115.09719,
                    30.21750,
                    0,
                    290,
                    115.08797,
                    30.22425,
                    0,
                    300,
                    115.07688,
                    30.23393,
                    0,
                    310,
                    115.07139,
                    30.24408,
                    0,
                    320,
                    115.07102,
                    30.25518,
                    0,
                    330,
                    115.07333,
                    30.26587,
                    0,
                    340,
                    115.07761,
                    30.27891,
                    0,
                    350,
                    115.07875,
                    30.29568,
                    0,
                    360,
                    115.07975,
                    30.32844,
                    0,
                    370,
                    115.07712,
                    30.34304,
                    0,
                    380,
                    115.07019,
                    30.35782,
                    0,
                    390,
                    115.06356,
                    30.36863,
                    0,
                    400,
                    115.05421,
                    30.38260,
                    0,
                    410,
                    115.03986,
                    30.39367,
                    0,
                    420,
                    115.02362,
                    30.40179,
                    0,
                    430,
                    115.00901,
                    30.40360,
                    0,
                    440,
                    114.99281,
                    30.40201,
                    0,
                    450,
                    114.97667,
                    30.40240,
                    0,
                    460,
                    114.93114,
                    30.40770,
                    0,
                    470,
                    114.91566,
                    30.40999,
                    0,
                    480,
                    114.89645,
                    30.41193,
                    0,
                    490,
                    114.88024,
                    30.41519,
                    0,
                    500,
                    114.86765,
                    30.42093,
                    0,
                    510,
                    114.85384,
                    30.42425,
                    0,
                    520,
                    114.83640,
                    30.43211,
                    0,
                    530,
                    114.83068,
                    30.43594,
                    0,
                    540,
                    114.82724,
                    30.44198,
                    0,
                    550,
                    114.82562,
                    30.44521,
                    0,
                    560,
                    114.82484,
                    30.44936,
                    0,
                    570,
                    114.82389,
                    30.45564,
                    0,
                    580,
                    114.82406,
                    30.45992,
                    0,
                    590,
                    114.82372,
                    30.47406,
                    0,
                    600,
                    114.82516,
                    30.49165,
                    0,
                    610,
                    114.82694,
                    30.50335,
                    0,
                    620,
                    114.82906,
                    30.51491,
                    0,
                    630,
                    114.83101,
                    30.52831,
                    0,
                    640,
                    114.83284,
                    30.54196,
                    0,
                    650,
                    114.83305,
                    30.55881,
                    0,
                    660,
                    114.83321,
                    30.57829,
                    0,
                    670,
                    114.82619,
                    30.59483,
                    0,
                    680,
                    114.81247,
                    30.60426,
                    0,
                    690,
                    114.80255,
                    30.60998,
                    0,
                    700,
                    114.79638,
                    30.61162,
                    0,
                    710,
                    114.79082,
                    30.61401,
                    0,
                    720,
                    114.78054,
                    30.61543,
                    0,
                    730,
                    114.77067,
                    30.61614,
                    0,
                    740,
                    114.76111,
                    30.61383,
                    0,
                    750,
                    114.75268,
                    30.61169,
                    0,
                    760,
                    114.75874,
                    30.61249,
                    0,
                    770,
                    114.74158,
                    30.60359,
                    0,
                    780,
                    114.72967,
                    30.59167,
                    0,
                    790,
                    114.70995,
                    30.58064,
                    0,
                    800,
                    114.68611,
                    30.57672,
                    0,
                    810,
                    114.66146,
                    30.57272,
                    0,
                    820,
                    114.63528,
                    30.56356,
                    0,
                    830,
                    114.62677,
                    30.55645,
                    0,
                    840,
                    114.61444,
                    30.55796,
                    0,
                    850,
                    114.60458,
                    30.56169,
                    0,
                    860,
                    114.58576,
                    30.57697,
                    0,
                    870,
                    114.57156,
                    30.59981,
                    0,
                    880,
                    114.56362,
                    30.62035,
                    0,
                    890,
                    114.55112,
                    30.64312,
                    0,
                    900,
                    114.54914,
                    30.65246,
                    0,
                    910,
                ],
            },
        },
    ];
    viewer.dataSources
        .add(Cesium.CzmlDataSource.load(czml))
        .then(function (ds) {//令模型方向与路线方向一致
            viewer.trackedEntity = ds.entities.getById("path");
            viewer.trackedEntity.orientation = new Cesium.VelocityOrientationProperty(viewer.trackedEntity.position);
        });
}

//操作模块

function CircleScanPostStage(viewer, cartographicCenter, maxRadius, scanColor, duration) {
    var ScanSegmentShader =
        "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "varying vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_scanCenterEC;\n" +
        "uniform vec3 u_scanPlaneNormalEC;\n" +
        "uniform float u_radius;\n" +
        "uniform vec4 u_scanColor;\n" +
        "vec4 toEye(in vec2 uv, in float depth)\n" +
        " {\n" +
        " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
        " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
        " posInCamera =posInCamera / posInCamera.w;\n" +
        " return posInCamera;\n" +
        " }\n" +
        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
        "vec3 v01 = point -planeOrigin;\n" +
        "float d = dot(planeNormal, v01) ;\n" +
        "return (point - planeNormal * d);\n" +
        "}\n" +
        "float getDepth(in vec4 depth)\n" +
        "{\n" +
        "float z_window = czm_unpackDepth(depth);\n" +
        "z_window = czm_reverseLogDepth(z_window);\n" +
        "float n_range = czm_depthRange.near;\n" +
        "float f_range = czm_depthRange.far;\n" +
        "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
        "}\n" +
        "void main()\n" +
        "{\n" +
        "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
        "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
        "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
        "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
        "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
        "if(dis < u_radius)\n" +
        "{\n" +
        "float f = 1.0 -abs(u_radius - dis) / u_radius;\n" +
        "f = pow(f, 4.0);\n" +
        "gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n" +
        "}\n" +
        "}\n";
    var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    var _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);
    var _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
    var _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);
    var _time = (new Date()).getTime();
    var _scratchCartesian4Center = new Cesium.Cartesian4();
    var _scratchCartesian4Center1 = new Cesium.Cartesian4();
    var _scratchCartesian3Normal = new Cesium.Cartesian3();
    var ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: ScanSegmentShader,
        uniforms: {
            u_scanCenterEC: function () {
                return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            },
            u_scanPlaneNormalEC: function () {
                var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;
                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                return _scratchCartesian3Normal;
            },
            u_radius: function () {
                return maxRadius * (((new Date()).getTime() - _time) % duration) / duration;
            },
            u_scanColor: scanColor
        }
    });
    viewer.scene.postProcessStages.add(ScanPostStage);
}

function AddCircleScanPostStage() {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, 10000)
    });
    CircleScanPostStage(viewer, CartographicCenter, 1500, scanColor, 4000);
}

function RadarScanPostStage(viewer, cartographicCenter, radius, scanColor, duration) {
    var tileset = new Cesium.Cesium3DTileset({url: Cesium.IonResource.fromAssetId(5741)});
    viewer.scene.primitives.add(tileset);
    tileset.readyPromise.then(function () {
        var boundingSphere = tileset.boundingSphere;
        viewer.camera.viewBoundingSphere(boundingSphere, new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius));
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
    }).otherwise(function (error) {
        throw (error);
    });
    var ScanSegmentShader =
        "uniform sampler2D colorTexture;\n" +
        "uniform sampler2D depthTexture;\n" +
        "varying vec2 v_textureCoordinates;\n" +
        "uniform vec4 u_scanCenterEC;\n" +
        "uniform vec3 u_scanPlaneNormalEC;\n" +
        "uniform vec3 u_scanLineNormalEC;\n" +
        "uniform float u_radius;\n" +
        "uniform vec4 u_scanColor;\n" +
        "vec4 toEye(in vec2 uv, in float depth)\n" +
        " {\n" +
        " vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n" +
        " vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n" +
        " posInCamera =posInCamera / posInCamera.w;\n" +
        " return posInCamera;\n" +
        " }\n" +
        "bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
        "{\n" +
        "vec3 v01 = testPt - ptOnLine;\n" +
        "normalize(v01);\n" +
        "vec3 temp = cross(v01, lineNormal);\n" +
        "float d = dot(temp, u_scanPlaneNormalEC);\n" +
        "return d > 0.5;\n" +
        "}\n" +
        "vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point)\n" +
        "{\n" +
        "vec3 v01 = point -planeOrigin;\n" +
        "float d = dot(planeNormal, v01) ;\n" +
        "return (point - planeNormal * d);\n" +
        "}\n" +
        "float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt)\n" +
        "{\n" +
        "vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n" +
        "return length(tempPt - ptOnLine);\n" +
        "}\n" +
        "float getDepth(in vec4 depth)\n" +
        "{\n" +
        "float z_window = czm_unpackDepth(depth);\n" +
        "z_window = czm_reverseLogDepth(z_window);\n" +
        "float n_range = czm_depthRange.near;\n" +
        "float f_range = czm_depthRange.far;\n" +
        "return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n" +
        "}\n" +
        "void main()\n" +
        "{\n" +
        "gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n" +
        "float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n" +
        "vec4 viewPos = toEye(v_textureCoordinates, depth);\n" +
        "vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n" +
        "float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n" +
        "float twou_radius = u_radius * 2.0;\n" +
        "if(dis < u_radius)\n" +
        "{\n" +
        "float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n" +
        "f0 = pow(f0, 64.0);\n" +
        "vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n" +
        "float f = 0.0;\n" +
        "if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz))\n" +
        "{\n" +
        "float dis1= length(prjOnPlane.xyz - lineEndPt);\n" +
        "f = abs(twou_radius -dis1) / twou_radius;\n" +
        "f = pow(f, 3.0);\n" +
        "}\n" +
        "gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n" +
        "}\n" +
        "}\n";
    var _Cartesian3Center = Cesium.Cartographic.toCartesian(cartographicCenter);
    var _Cartesian4Center = new Cesium.Cartesian4(_Cartesian3Center.x, _Cartesian3Center.y, _Cartesian3Center.z, 1);
    var _CartographicCenter1 = new Cesium.Cartographic(cartographicCenter.longitude, cartographicCenter.latitude, cartographicCenter.height + 500);
    var _Cartesian3Center1 = Cesium.Cartographic.toCartesian(_CartographicCenter1);
    var _Cartesian4Center1 = new Cesium.Cartesian4(_Cartesian3Center1.x, _Cartesian3Center1.y, _Cartesian3Center1.z, 1);
    var _CartographicCenter2 = new Cesium.Cartographic(cartographicCenter.longitude + Cesium.Math.toRadians(0.001), cartographicCenter.latitude, cartographicCenter.height);
    var _Cartesian3Center2 = Cesium.Cartographic.toCartesian(_CartographicCenter2);
    var _Cartesian4Center2 = new Cesium.Cartesian4(_Cartesian3Center2.x, _Cartesian3Center2.y, _Cartesian3Center2.z, 1);
    var _RotateQ = new Cesium.Quaternion();
    var _RotateM = new Cesium.Matrix3();
    var _time = (new Date()).getTime();
    var _scratchCartesian4Center = new Cesium.Cartesian4();
    var _scratchCartesian4Center1 = new Cesium.Cartesian4();
    var _scratchCartesian4Center2 = new Cesium.Cartesian4();
    var _scratchCartesian3Normal = new Cesium.Cartesian3();
    var _scratchCartesian3Normal1 = new Cesium.Cartesian3();
    var ScanPostStage = new Cesium.PostProcessStage({
        fragmentShader: ScanSegmentShader,
        uniforms: {
            u_scanCenterEC: function () {
                return Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
            },
            u_scanPlaneNormalEC: function () {
                var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;
                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                return _scratchCartesian3Normal;
            },
            u_radius: radius,
            u_scanLineNormalEC: function () {
                var temp = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center, _scratchCartesian4Center);
                var temp1 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center1, _scratchCartesian4Center1);
                var temp2 = Cesium.Matrix4.multiplyByVector(viewer.camera._viewMatrix, _Cartesian4Center2, _scratchCartesian4Center2);
                _scratchCartesian3Normal.x = temp1.x - temp.x;
                _scratchCartesian3Normal.y = temp1.y - temp.y;
                _scratchCartesian3Normal.z = temp1.z - temp.z;
                Cesium.Cartesian3.normalize(_scratchCartesian3Normal, _scratchCartesian3Normal);
                _scratchCartesian3Normal1.x = temp2.x - temp.x;
                _scratchCartesian3Normal1.y = temp2.y - temp.y;
                _scratchCartesian3Normal1.z = temp2.z - temp.z;
                var tempTime = (((new Date()).getTime() - _time) % duration) / duration;
                Cesium.Quaternion.fromAxisAngle(_scratchCartesian3Normal, tempTime * Cesium.Math.PI * 2, _RotateQ);
                Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
                Cesium.Matrix3.multiplyByVector(_RotateM, _scratchCartesian3Normal1, _scratchCartesian3Normal1);
                Cesium.Cartesian3.normalize(_scratchCartesian3Normal1, _scratchCartesian3Normal1);
                return _scratchCartesian3Normal1;
            },
            u_scanColor: scanColor
        }
    });
    viewer.scene.postProcessStages.add(ScanPostStage);
}

function AddRadarScanPostStage() {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, 10000)
    });
    RadarScanPostStage(viewer, CartographicCenter, 1500, scanColor, 4000)
}

function ShineEllipse() {
    let x = 1;
    let flog = true;
    viewer.entities.add({
        name: "圆形区域闪烁",
        position: Cesium.Cartesian3.fromDegrees(lon, lat, 100),
        ellipse: {
            semiMinorAxis: 2000.0,
            semiMajorAxis: 2000.0,
            height: 0,
            material: new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function () {
                if (flog) {
                    x = x - 0.05;
                    if (x <= 0) {
                        flog = false;
                    }
                } else {
                    x = x + 0.05;
                    if (x >= 1) {
                        flog = true;
                    }
                }
                return Cesium.Color.RED.withAlpha(x);
            }, false))
        }
    });
}

function addShineEllipse() {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, 10000)
    });
    ShineEllipse()
}

function initPolylineTrailLinkMaterialProperty(data) {
    function PolylineTrailLinkMaterialProperty(color, duration) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = color;
        this.duration = duration;
        this._time = (new Date()).getTime();
    }

    Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
        isConstant: {
            get: function () {
                return false;
            }
        },
        definitionChanged: {
            get: function () {
                return this._definitionChanged;
            }
        },
        color: Cesium.createPropertyDescriptor('color')
    });
    PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
        return 'PolylineTrailLink';
    }
    PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
        result.image = Cesium.Material.PolylineTrailLinkImage;
        result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
        return result;
    }
    PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
        return this === other || (other instanceof PolylineTrailLinkMaterialProperty && Property.equals(this._color, other._color))
    };
    Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
    Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
    Cesium.Material.PolylineTrailLinkImage = data.flowImage;//图片
    Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                                       {\n\
                                                            czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                            vec2 st = materialInput.st;\n\
                                                            vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                            material.alpha = colorImage.a * color.a;\n\
                                                            material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                            return material;\n\
                                                        }";
// material.alpha:透明度;material.diffuse：颜色;
    Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
        fabric: {
            type: Cesium.Material.PolylineTrailLinkType,
            uniforms: {
                color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                image: Cesium.Material.PolylineTrailLinkImage,
                time: 0
            },
            source: Cesium.Material.PolylineTrailLinkSource
        },
        translucent: function (material) {
            return true;
        }
    })
}

//抛物线方程
function parabolaEquation(options, resultOut) {
    //方程 y=-(4h/L^2)*x^2+h h:顶点高度 L：横纵间距较大者
    const h = options.height && options.height > 5000 ? options.height : 5000;
    const L = Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat) ? Math.abs(options.pt1.lon - options.pt2.lon) : Math.abs(options.pt1.lat - options.pt2.lat);
    const num = options.num && options.num > 50 ? options.num : 50;
    const result = [];
    let dlt = L / num;
    if (Math.abs(options.pt1.lon - options.pt2.lon) > Math.abs(options.pt1.lat - options.pt2.lat)) {//以lon为基准
        const delLat = (options.pt2.lat - options.pt1.lat) / num;
        if (options.pt1.lon - options.pt2.lon > 0) {
            dlt = -dlt;
        }
        for (let i = 0; i < num; i++) {
            const tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
            const lon = options.pt1.lon + dlt * i;
            const lat = options.pt1.lat + delLat * i;
            result.push([lon, lat, tempH]);
        }
    } else {//以lat为基准
        let delLon = (options.pt2.lon - options.pt1.lon) / num;
        if (options.pt1.lat - options.pt2.lat > 0) {
            dlt = -dlt;
        }
        for (let i = 0; i < num; i++) {
            const tempH = h - Math.pow((-0.5 * L + Math.abs(dlt) * i), 2) * 4 * h / Math.pow(L, 2);
            const lon = options.pt1.lon + delLon * i;
            const lat = options.pt1.lat + dlt * i;
            result.push([lon, lat, tempH]);
        }
    }
    if (resultOut !== undefined) {
        resultOut = result;
    }
    // 落地
    result.push([options.pt2.lon, options.pt2.lat, options.pt2.height || 0])
    return result;
}

//折线
function addPolyline(data) {
    if (data.flowing) {
        initPolylineTrailLinkMaterialProperty(data)
        data.options.polyline.material = new Cesium.PolylineTrailLinkMaterialProperty(data.options.polyline.material, data.options.polyline.interval);
    }
    viewer.entities.add(data.options)
}

//抛物线
function addParabola(data) {
    let center = data.center;//起始点
    let cities = data.points;//可以为多组哦！
    if (data.flowing) {
        initPolylineTrailLinkMaterialProperty(data);
        data.options.polyline.material = new Cesium.PolylineTrailLinkMaterialProperty(data.options.polyline.material, data.options.polyline.interval);
    }
    for (let j = 0; j < cities.length; j++) {
        let points = parabolaEquation({pt1: center, pt2: cities[j], height: data.height, num: 100});
        let pointArr = [];
        for (let i = 0; i < points.length; i++) {
            pointArr.push(points[i][0], points[i][1], points[i][2]);
        }
        data.options.polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights(pointArr)
        viewer.entities.add(data.options);
    }
}

//墙体
function addWall(data) {
    if (data.flowing) {
        initPolylineTrailLinkMaterialProperty(data)
        data.options.wall.material = new Cesium.PolylineTrailLinkMaterialProperty(data.options.wall.material, data.options.wall.interval);
    }
    viewer.entities.add(data.options)
}

function addSpecialWall() {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(lon, lat, 300000),
        orientation: {
            heading: Cesium.Math.toRadians(0), // 方向
            pitch: Cesium.Math.toRadians(-30),// 倾斜角度
            roll: 0
        }
    });
    /** 一 普通折线**/
    const data1 = {
        options: { //options 内为原始参数
            name: 'yscNoNeedEntity',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    lon, lat, 0, //0 表示高度
                    lon + 1, lat, 0,
                    lon + 1, lat + 1, 0,
                    lon + 2, lat + 1, 0,
                    lon + 2, lat + 2, 0
                ],),
                width: 5,
                clampToGround: true,//贴地
                material: Cesium.Color.RED,
            }
        }
    };
    addPolyline(data1);
    /** 二 流动折线**/
    const data2 = {
        flowing: true,
        flowImage: "colors1.png",//飞行线的图片
        options: {
            name: 'yscNoNeedEntity',
            polyline: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                    lon, lat, 0, //0 表示高度
                    lon - 1, lat, 0,
                    lon - 1, lat - 1, 0,
                    lon - 2, lat - 1, 0,
                    lon - 2, lat - 2, 0
                ]),
                width: 5,
                clampToGround: true,//贴地
                material: Cesium.Color.YELLOW,
                interval: 3000
            }
        }
    };
    addPolyline(data2)

    /** 三 普通抛物线**/
    const data3 = {
        center: {lat: lat + 3, lon: lon + 3},//起始点
        points: [
            {lat: lat + 5, lon: lon - 5},
            {lat: lat + 6, lon: lon + 6},
            {lat: lat + 3, lon: lon + 7}
        ],
        height: 50000,//抛物线最大高度
        options: {
            name: 'yscNoNeedEntity',
            polyline: {
                width: 2,//线宽度
                material: Cesium.Color.RED,
            }
        }
    };
    addParabola(data3);

    /** 四 流动抛物线**/
    var data4 = {
        flowing: true,
        center: {lat: lat - 3, lon: lon - 3},//起始点
        height: 50000,//抛物线最大高度
        flowImage: "colors1.png",//飞行线的图片
        points: [
            {lat: lat - 5, lon: lon + 5},
            {lat: lat - 6, lon: lon - 6},
            {lat: lat - 3, lon: lon - 7}
        ],//可以多个
        options: {
            name: 'yscNoNeedEntity',
            polyline: {
                width: 2,//线宽度
                material: Cesium.Color.YELLOW,
                interval: 3000//混合颜色、(红绿混合透明后 就是黄色了)3000秒发射间隔,单纯材质无法展示飞行动态。所以去掉了。
            }
        }
    };
    addParabola(data4);
    /** 墙*/
    var data5 = {
        flowing: true,
        flowImage: "colors1.png",//飞行线的图片
        options: {
            name: 'this is YELLOW wall from surface',
            wall: {
                positions: Cesium.Cartesian3.fromDegreesArrayHeights(
                    [
                        lon - 0.5, lat - 0.5, 50000, //0 表示高度
                        lon - 3, lat, 50000,
                        lon - 3, lat - 1, 50000,
                        lon - 1, lat - 3, 50000,
                        lon - 0.5, lat - 0.5, 50000
                    ]),
                minimumHeights: [0, 0, 0, 0, 0], //墙距离地面的距离。
                material: Cesium.Color.YELLOW,
                interval: 3000,//混合颜色、(红绿混合透明后 就是黄色了)3000秒发射间隔,单纯材质无法展示飞行动态。所以去掉了。
                outline: false
            }
        }
    };
    addWall(data5);
}

function addFlyLinesAndPoints(data, callback) {
    //创建线
    this.addParabola(data)
    //创建点
    const center = data.center;
    const cities = data.points;
    /*   ***********  这个可以修改成其他实体  *********** **/
    //中心点
    viewer.entities.add({
        id: center.id,
        position: Cesium.Cartesian3.fromDegrees(center.lon, center.lat, 0),
        point: {
            pixelSize: center.size,
            color: center.color,
        }
    });
    //散点
    for (let i = 0; i < cities.length; i++) {
        viewer.entities.add({
            id: cities[i].id,
            position: Cesium.Cartesian3.fromDegrees(cities[i].lon, cities[i].lat, 1),
            point: {
                pixelSize: cities[i].size,
                color: cities[i].color
            }
        });
    }
    /*   ***********  这个可以修改成其他实体  *********** **/
    this.handleEvent('LEFT_CLICK', callback)
}

function addFlyLinesByCZML(data) {
    viewer.shouldAnimate = true
    const center = data.center, cities = data.points;
    const dsArr = [];
    for (let j = 0; j < cities.length; j++) {
        const czml = [
            {
                "id": "document",
                "name": "CZML Path",
                "version": "1.0",
                "clock": { //定时
                    "interval": "2019-05-27T10:00:00Z/2019-05-27T10:16:50Z", // 990/60=16.5
                    "currentTime": "2019-05-27T10:00:00Z",//当前时间
                    "multiplier": data.multiplier //动画的速度倍数
                }
            },
            {
                "id": "path",
                "name": "path with GPS flight data",
                "description": "<p>Hang gliding flight log data from Daniel H. Friedman.<br>Icon created by Larisa Skosyrska from the Noun Project</p>",
                "availability": "2019-05-27T10:00:00Z/2019-05-27T10:16:50Z",
                "path": {
                    "material": { //线的材质
                        "polylineOutline": {
                            "color": {
                                "rgba": data.lineColor
                            },
                            "outlineColor": {
                                "rgba": [0, 0, 0, 0]
                            },
                            "outlineWidth": 0
                        }
                    },//路线的材质
                    "width": 2, //线的宽度
                    "leadTime": 990,
                    "trailTime": 990,
                    "resolution": 5 //分辨率
                },
                "billboard": { //加billboard 也可以加载其他entity cesium会自己解析
                    "image": data.image,
                    "scale": 0.5,
                    "eyeOffset": {
                        "cartesian": [0.0, 0.0, -10.0]
                    }
                },
                "position": {
                    "epoch": "2019-05-27T10:00:00Z",//动画起始时间
                    "cartographicDegrees": [],
                }
            }];
        const points = parabolaEquation({pt1: center, pt2: cities[j], height: data.height, num: 100});//100个点
        const pointArr = [];
        for (let i = 0; i < points.length; i++) {
            pointArr.push(i * 10, points[i][0], points[i][1], points[i][2]);//0+i*10;表示距离
        }
        czml[1].position.cartographicDegrees = pointArr;
        if (cities[j].image) {
            czml[1].billboard.image = cities[j].image;
        }
        viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then(function (ds) {
            dsArr.push(ds);
        });
    }

    return dsArr;
}

function addSpecialLine() {
    const center = {lon: 114.302312702, lat: 30.598026044};
    const points = [
        {"lon": 115.028495718, "lat": 30.200814617},
        {"lon": 110.795000473, "lat": 32.638540762, image: "logo.jpg"},
        {"lon": 111.267729446, "lat": 30.698151246},
        {"lon": 112.126643144, "lat": 32.058588576},
        {"lon": 114.885884938, "lat": 30.395401912},
        {"lon": 112.190419415, "lat": 31.043949588, image: "logo.jpg"},
        {"lon": 113.903569642, "lat": 30.932054050},
        {"lon": 112.226648859, "lat": 30.367904255},
        {"lon": 114.861716770, "lat": 30.468634833},
        {"lon": 114.317846048, "lat": 29.848946148},
        {"lon": 113.371985426, "lat": 31.704988330},
        {"lon": 109.468884533, "lat": 30.289012191},
        {"lon": 113.414585069, "lat": 30.368350431},
        {"lon": 112.892742589, "lat": 30.409306203},
        {"lon": 113.160853710, "lat": 30.667483468},
        {"lon": 110.670643354, "lat": 31.748540780}
    ];

    const data = {
        image: "logo.jpg",
        center: center,
        points: points,
        height: 50000,//抛物线的最高点
        multiplier: 100,//动画的运行时间加快倍数//速度
        lineColor: [255, 0, 0, 255]//线的颜色 最后一个255就相当于1
    };
    const dsArr = addFlyLinesByCZML(data); // shouldAnimate : true,//允许动画
    setTimeout(function () {
        for (let i = 0; i < dsArr.length; i++) {
            viewer.dataSources.remove(dsArr[i]);
        }
    }, 1000 * 60);//60秒后清除

    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.302312702, 30.598026044, 500000)
    });

    const data2 = {
        image: "logo.jpg",
        center: {lon: 114.302312702, lat: 30.598026044},
        points: [{lon: 118.302312702, lat: 30.598026044}],
        height: 50000,//抛物线的最高点
        multiplier: 100,//动画的运行时间加快倍数//速度 缺陷是 因为时间是唯一的，一个容器不能同时存在两个时间加快倍数，所以。要在一个容器使用两个这个函数，且想要速度不一样，那就改源码的czml吧
        lineColor: [255, 255, 255, 255],//线的颜色 最后一个255就相当于1
    };
    addFlyLinesByCZML(data2); // shouldAnimate : true,//允许动画
}

function addDoubleCircleRipple(data) {
    let r1 = data.minR, r2 = data.minR

    function changeR1() {
        r1 = r1 + data.deviationR
        if (r1 >= data.maxR) {
            r1 = data.minR
        }
        return r1;
    }

    function changeR2() {
        r2 = r2 + data.deviationR
        if (r2 >= data.maxR) {
            r2 = data.minR
        }
        return r2
    }

    viewer.entities.add({
        name: "",
        id: data.id[0],
        position: Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.height),
        ellipse: {
            semiMinorAxis: new Cesium.CallbackProperty(changeR1, false),
            semiMajorAxis: new Cesium.CallbackProperty(changeR1, false),
            height: data.height,
            material: new Cesium.ImageMaterialProperty({
                image: data.imageUrl,
                repeat: new Cesium.Cartesian2(1.0, 1.0),
                transparent: true,
                color: new Cesium.CallbackProperty(function () {
                    return Cesium.Color.WHITE.withAlpha(1 - r1 / data.maxR)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
                }, false)
            })
        }
    })
    setTimeout(() => {
        viewer.entities.add({
            name: "",
            id: data.id[1],
            position: Cesium.Cartesian3.fromDegrees(data.lon, data.lat, data.height),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(changeR2, false),
                semiMajorAxis: new Cesium.CallbackProperty(changeR2, false),
                height: data.height,
                material: new Cesium.ImageMaterialProperty({
                    image: data.imageUrl,
                    repeat: new Cesium.Cartesian2(1.0, 1.0),
                    transparent: true,
                    color: new Cesium.CallbackProperty(function () {
                        return Cesium.Color.WHITE.withAlpha(1 - r1 / data.maxR)  //entity的颜色透明 并不影响材质，并且 entity也会透明哦
                    }, false)
                })
            }
        })
    }, data.eachInterval)
}

function addDoubleCircle() {
    addDoubleCircleRipple({
        id: ['1', '2'],
        lon: lon,
        lat: lat,
        height: 50,
        maxR: 3000,
        minR: 0,//最好为0
        deviationR: 20,//差值 差值也大 速度越快
        eachInterval: 1000,//两个圈的时间间隔
        imageUrl: "redCircle2.png"
    })
    //如果添加中心线的话：
    viewer.entities.add({
        name: "",
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArrayHeights([
                lon, lat, 0,
                lon, lat, 5000,]
            ),
            width: 4,
            material: new Cesium.PolylineGlowMaterialProperty({ //发光线
                glowPower: 0.1,
                color: Cesium.Color.WHITE
            })
        }
    });
    viewer.zoomTo(viewer.entities);
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.56064, 30.658141, 1000)
    });
}

function createLightScan_getCirclePoints(r, ox, oy, count) {
    let point = []; //结果
    let radians = (Math.PI / 180) * Math.round(360 / count), //弧度
        i = 0;
    for (; i < count; i++) {
        let x = ox + r * Math.sin(radians * i),
            y = oy + r * Math.cos(radians * i);
        point.unshift({x: x, y: y}); //为保持数据顺时针
    }
    return point
}

//生成 entityCList面--形成圆锥
function createLightScan_entityCList(viewer, point, data) {
    const lon = data.observer[0], lat = data.observer[1], h = data.observer[2];
    const entityCList = [];
    //创建 面
    for (let i = 0; i < point.length; i++) {
        let hierarchy;
        if (i === (point.length - 1)) {
            hierarchy = new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
                [
                    lon, lat, h,
                    point[i].x, point[i].y, 0,
                    point[0].x, point[0].y, 0
                ]))
        } else {
            hierarchy = new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
                [
                    lon, lat, h,
                    point[i].x, point[i].y, 0,
                    point[i + 1].x, point[i + 1].y, 0
                ]))
        }

        const entityC = viewer.entities.add({
            name: "三角形",
            polygon: {
                hierarchy: hierarchy,
                outline: false,
                perPositionHeight: true,//允许三角形使用点的高度
                material: data.material
            }
        });
        entityCList.push(entityC);
    }

    return entityCList
}

//改变每个面的位置
function createLightScan_changeOnePosition(data, entity, arr) {
    const positionList = data.positionList;
    let x, y, x0, y0, X0, Y0, n = 0, a = 0;//x代表差值 x0代表差值等分后的值，X0表示每次回调改变的值。a表示回调的循环窜次数，n表示扫描的坐标个数
    function f(i) {
        x = positionList[i + 1][0] - positionList[i][0];//差值
        y = positionList[i + 1][1] - positionList[i][1];//差值
        x0 = x / data.number;//将差值等分500份
        y0 = y / data.number;
        a = 0;
    }

    f(n);
    entity.polygon.hierarchy = new Cesium.CallbackProperty(function () { //回调函数
        if ((Math.abs(X0) >= Math.abs(x)) && (Math.abs(Y0) >= Math.abs(y))) { //当等分差值大于等于差值的时候 就重新计算差值和等分差值  Math.abs
            n = n + 1;
            if (n === positionList.length - 1) {
                n = 0;
            }
            arr[0] = arr[0] + X0;
            arr[1] = arr[1] + Y0;
            arr[2] = arr[2] + X0;
            arr[3] = arr[3] + Y0;
            f(n);//重新赋值 x y x0 y0
        }
        X0 = a * x0;//将差值的等份逐渐递增。直到大于差值 会有精度丢失,所以扩大再加 x0=x0+0.0001
        Y0 = a * y0;//将差值的等份逐渐递增。直到大于差值 会有精度丢失,所以扩大再加
        a++;
        return new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArrayHeights(
            [
                data.observer[0], data.observer[1], data.observer[2],
                arr[0] + X0, arr[1] + Y0, 0,
                arr[2] + X0, arr[3] + Y0, 0
            ]))
    }, false)
}

function addLightScan(data) {
    //生成分割点
    const point = createLightScan_getCirclePoints(data.circle[0], data.circle[1], data.circle[2], data.circle[3]);
    //生成 entityCList 圆锥
    const entityCList = createLightScan_entityCList(viewer, point, data)
    for (let i = 0; i < entityCList.length; i++) {
        if (i !== entityCList.length - 1) {
            createLightScan_changeOnePosition(data, entityCList[i], [point[i].x, point[i].y, point[i + 1].x, point[i + 1].y]) //中间arr 代表的是点的坐标
        } else {
            createLightScan_changeOnePosition(data, entityCList[i], [point[i].x, point[i].y, point[0].x, point[0].y])
        }
    }
    return entityCList
}

function addLight() {
    const data = {
        circle: [0.003, 114.56064, 30.658141, 30]// 第一个参数 0.003表示半径，第二个第三个分别表示底座圆心的坐标,第四个表示切割成多少个点。组成多少个面。越多会越卡 尽量实际项目不影响效果，越少越好。
        , observer: [114.57064, 30.668141, 500]//观察点，也就是光源点
        , positionList: [ //我们这里就不加高度了。不然太麻烦了 //以圆心为参考做偏移值获取，圆心坐标 [117,35]，简单点画个正方形吧 如果画圆的画，也可以多取点
            [114.56064, 30.658141],//初始位置 (圆心坐标 [117,35]要和这个初始位置统一，不然会偏移出去)
            [114.57064, 30.658141], //下一个点
            [114.57064, 30.668141],
            [114.56064, 30.668141],
            [114.56064, 30.658141],//回来
        ]
        , material: Cesium.Color.RED.withAlpha(0.5)//光的材质
        , number: 100//数字越小速度越快
    };
    const entityCList = addLightScan(data); //返回的是所有面的数组 如果需要清除的画，就通过此清除
    //清除
    // for(var i=0;i< entityCList.length;i++){
    //     viewer.entities.remove(entityCList[i]);
    // }

    //**** 下面是额外的 可加可不加***//
    //立方体柱子 表示站台
    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(data.observer[0], data.observer[1], data.observer[2] / 2),
        name: "",
        box: {
            dimensions: new Cesium.Cartesian3(100.0, 100.0, data.observer[2]),
            outline: true,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            material: Cesium.Color.fromRandom({alpha: 0.5})
        }
    });
    //发蓝光的线
    const glowingLine = viewer.entities.add({
        name: 'Glowing blue line on the surface',
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(
                [
                    data.positionList[0][0], data.positionList[0][1],
                    data.positionList[1][0], data.positionList[1][1],
                    data.positionList[2][0], data.positionList[2][1],
                    data.positionList[3][0], data.positionList[3][1],
                    data.positionList[4][0], data.positionList[4][1],
                ]),
            width: 10,
            material: new Cesium.PolylineGlowMaterialProperty({ //发光线
                glowPower: 0.2,
                color: Cesium.Color.BLUE
            })
        }
    });
    viewer.zoomTo(viewer.entities)
}

//添加动态弹窗
function addWindows(){
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE =
        Cesium.Rectangle.fromDegrees(114.6, 30.7, 114.7, 30.72); //Rectangle(west, south, east, north)
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(114.56064, 30.658141, 1500.0),
        orientation: {
            heading: Cesium.Math.toRadians(20.0), //左右摆
            pitch: Cesium.Math.toRadians(-35.0), //正俯视
            roll: 0.0
        }
    });
    function addCircleWindow() {
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function (e) {
            var cartesian = viewer.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5); //四舍五入 小数点后保留五位
            var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5); //四舍五入  小数点后保留五位
            // var height = Math.ceil(viewer.camera.positionCartographic.height);   //获取相机高度
            if (cartesian) {
                /** main */
                var data = {
                    layerId: "layer1", //弹窗的唯一id，英文，且唯一,内部entity会用得到
                    lon: lon,
                    lat: lat,
                    addEntity: true, //默认为false,如果为false的话就不添加实体，后面的实体属性就不需要了
                    boxHeight: 150, //中间立方体的高度
                    boxHeightDif: 5, //中间立方体的高度增长差值，越大增长越快
                    boxHeightMax: 300, //中间立方体的最大高度
                    boxSide: 40, //立方体的边长
                    boxMaterial: Cesium.Color.DEEPSKYBLUE.withAlpha(0.5),
                    circleSize: 200, //大圆的大小，小圆的大小默认为一半
                };
                var s1 = 0.001,
                    s2 = s1
                let sStartFlog = false
                setTimeout(function () {
                    console.log("延迟开放加载标志")
                    sStartFlog = true;
                }, 70);
                var rotation = Cesium.Math.toRadians(30);

                function getRotationValue() {
                    rotation += 0.05;
                    return rotation;
                }

                viewer.entities.removeById(data.layerId + "_2");
                //添加底座一 外环
                viewer.entities.add({
                    id: data.layerId + "_2",
                    name: "椭圆",
                    position: Cesium.Cartesian3.fromDegrees(lon, lat),
                    ellipse: {
                        // semiMinorAxis :data.circleSize, //直接这个大小 会有一个闪白的材质 因为cesium材质默认是白色 所以我们先将大小设置为0
                        // semiMajorAxis : data.circleSize,
                        semiMinorAxis: new Cesium.CallbackProperty(function () {
                            if (sStartFlog) {
                                s1 = s1 + data.circleSize / 20;
                                if (s1 >= data.circleSize) {
                                    s1 = data.circleSize;
                                }
                            }
                            return s1;
                        }, false),
                        semiMajorAxis: new Cesium.CallbackProperty(function () {
                            if (sStartFlog) {
                                s2 = s2 + data.circleSize / 20;
                                if (s2 >= data.circleSize) {
                                    s2 = data.circleSize;
                                }
                            }
                            return s2;
                        }, false),
                        material: "circle2.png",
                        //rotation: new Cesium.CallbackProperty(getRotationValue, false),
                        stRotation: new Cesium.CallbackProperty(getRotationValue, false),
                        zIndex: 2,
                    }
                });

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    addCircleWindow();
    function addDivWindow(){
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(e) {
            var  s1=0.001

            var sStartFlog = false;

            var cartesian = viewer.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5); //四舍五入 小数点后保留五位
            var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5); //四舍五入  小数点后保留五位
            // var height = Math.ceil(viewer.camera.positionCartographic.height);   //获取相机高度


            var data = {
                layerId: "layer1", //弹窗的唯一id，英文，且唯一,内部entity会用得到
                lon: lon,
                lat: lat,
                addEntity: true, //默认为false,如果为false的话就不添加实体，后面的实体属性就不需要了
                boxHeight: 150, //中间立方体的高度
                boxHeightDif: 1, //中间立方体的高度增长差值，越大增长越快
                boxHeightMax: 300, //中间立方体的最大高度
                boxSide: 40, //立方体的边长
                boxMaterial: Cesium.Color.DEEPSKYBLUE.withAlpha(0.5),
                circleSize: 200, //大圆的大小，小圆的大小默认为一半
            };
            var height = data.boxHeight,
                heightMax = data.boxHeightMax,
                heightDif = data.boxHeightDif;
            var goflog = true;
            if (cartesian) {
                viewer.entities.removeById("_1");
                var blueBox = viewer.entities.add({
                    id:  "_1",
                    name: "立方体盒子",
                    //中心的位置
                    position: new Cesium.CallbackProperty(function() {
                        height = height + heightDif;
                        if (height >= heightMax) {
                            height = heightMax;
                        }
                        return Cesium.Cartesian3.fromDegrees(lon, lat, height/2)
                    }, false),
                    box: {
                        dimensions: new Cesium.CallbackProperty(function() {
                            height = height + heightDif;
                            if (height >= heightMax) {
                                height = heightMax;
                                if (goflog) { //需要增加判断 不然它会一直执行; 导致对div的dom操作 会一直重复
                                    goflog = false;
                                }
                            }
                            return new Cesium.Cartesian3(data.boxSide, data.boxSide, height)
                        }, false),
                        material: data.boxMaterial
                    }
                });

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    addDivWindow();
    function addWindowDiv(){
        document.body.addEventListener('click',() => {
            console.log("111111")
            var kankan=document.getElementById('one')
            kankan.style.display='block'
            var f=document.getElementsByClassName('line')[0]
            f.style.display='block'
            f.style.width='50px'
            var e=document.getElementsByClassName('main')[0]
            e.style.display='block'
        })
        var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
        handler.setInputAction(function(e) {
            var  s1=0.001

            var sStartFlog = false;
            // 获取模型上的点
//   var cartesian = viewer.scene.pickPosition(movement.position);


            var cartesian = viewer.camera.pickEllipsoid(e.position, viewer.scene.globe.ellipsoid);
            var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            var lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5); //四舍五入 小数点后保留五位
            var lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5); //四舍五入  小数点后保留五位
            // var height = Math.ceil(viewer.camera.positionCartographic.height);   //获取相机高度


            var data = {
                layerId: "layer1", //弹窗的唯一id，英文，且唯一,内部entity会用得到
                lon: lon,
                lat: lat,

                addEntity: true, //默认为false,如果为false的话就不添加实体，后面的实体属性就不需要了
                boxHeight: 150, //中间立方体的高度
                boxHeightDif: 1, //中间立方体的高度增长差值，越大增长越快
                boxHeightMax: 300, //中间立方体的最大高度
                boxSide: 40, //立方体的边长
                boxMaterial: Cesium.Color.DEEPSKYBLUE.withAlpha(0.5),
                circleSize: 200, //大圆的大小，小圆的大小默认为一半
            };
            var height = data.boxHeight,
                heightMax = data.boxHeightMax,
                heightDif = data.boxHeightDif;

            var goflog = true;
            if (cartesian) {
                viewer.entities.removeById("_1");
                var blueBox = viewer.entities.add({
                    id:  "_1",
                    name: "立方体盒子",
                    //中心的位置
                    position: new Cesium.CallbackProperty(function() {
                        height = height + heightDif;
                        if (height >= heightMax) {
                            height = heightMax;
                        }
                        return Cesium.Cartesian3.fromDegrees(lon, lat, height/2)
                    }, false),
                    box: {
                        dimensions: new Cesium.CallbackProperty(function() {
                            height = height + heightDif;
                            if (height >= heightMax) {
                                height = heightMax;
                                if (goflog) { //需要增加判断 不然它会一直执行; 导致对div的dom操作 会一直重复
                                    goflog = false;
                                    console.log("增长完毕")
                                    //添加div
                                    var divPosition = Cesium.Cartesian3.fromDegrees(lon, lat, data.boxHeightMax); //data.boxHeightMax为undef也没事
                                    var kankan=document.getElementById('one')
                                    kankan.style.display='block'
                                    var f=document.getElementsByClassName('line')[0]
                                    f.style.display='block'
                                    f.style.width='50px'
                                    var e=document.getElementsByClassName('main')[0]
                                    e.style.display='block'
                                    console.log(kankan.style)
                                    creatHtmlElement(viewer, kankan, divPosition, [10, -250], true); //当为true的时候，表示当element在地球背面会自动隐藏。默认为false，置为false，不会这样。但至少减轻判断计算压力
                                }
                            }
                            return new Cesium.Cartesian3(data.boxSide, data.boxSide, height)
                        }, false),
                        material: data.boxMaterial
                    }
                });

            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        /**
         * 创建一个 htmlElement元素 并且，其在earth背后会自动隐藏
         */
        function creatHtmlElement(viewer, element, position, arr, flog) {
            var scratch = new Cesium.Cartesian2(); //cesium二维笛卡尔 笛卡尔二维坐标系就是我们熟知的而二维坐标系；三维也如此
            var scene = viewer.scene,
                camera = viewer.camera;
            scene.preRender.addEventListener(function() {
                var canvasPosition = scene.cartesianToCanvasCoordinates(position, scratch); //cartesianToCanvasCoordinates 笛卡尔坐标（3维度）到画布坐标
                if (Cesium.defined(canvasPosition)) {
                    element.style.left=canvasPosition.x + arr[0]+"px"
                    element.style.top=canvasPosition.y + arr[1]+"px"
                }
                //控制在地球背面时，隐藏div
                if (flog && flog == true) {
                    var e = position,
                        i = camera.position,
                        n = scene.globe.ellipsoid.cartesianToCartographic(i).height;
                    if (!(n += 1 * scene.globe.ellipsoid.maximumRadius, Cesium.Cartesian3.distance(i, e) > n)) {
                        element.style.display="block"
                    } else {
                        element.style.display="none"
                    }
                }
            });
            /* 此处进行判断**/ // var px_position = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian);

            /* 此处进行判断**/
        }
    }
    addWindowDiv();
            /** main */
}

//echarts模块
function addHeatMaps() {
    var bounds = {
        west: 114.55,
        south: 30.65,
        east: 114.6,
        north: 30.7
    };
    //初始化cesiumheatmap对象，传入相应的参数
    this.heatMap = window.CesiumHeatmap.create(
        viewer, // 视图层
        bounds, // 矩形坐标
        { // heatmap相应参数
            backgroundColor: "rgba(0,0,0,0)",
            radius: 50,
            maxOpacity: .5,
            minOpacity: 0,
            blur: .75
        }
    );
    // random example data 添加数据 最小值，最大值，数据集
    let data = [{"x": 114.56, "y": 30.651, "value": 76}, {"x": 114.52, "y": 30.652, "value": 63}, {
        "x": 114.563,
        "y": 30.654,
        "value": 1
    }, {"x": 114.565, "y": 30.658, "value": 14}, {"x": 114.5639, "y": 30.6556, "value": 45}, {
        "x": 114.57,
        "y": 30.658,
        "value": 72
    }, {"x": 114.59, "y": 30.676, "value": 32}, {"x": 114.584, "y": 30.693, "value": 56}, {
        "x": 114.5765,
        "y": 30.6864,
        "value": 22
    }, {"x": 114.5435, "y": 30.6543, "value": 33},];

    let valueMin = 0;
    let valueMax = 100;

    // add data to heatmap
    // heatMap.setWGS84Data(valueMin, valueMax, data);
    var a, b;

    // 动态数据 [{x: -97.6433525165054, y: 45.61443064377248, value: 11.409122369106317}]

    function getData(length) {
        var data = [];
        for (var i = 0; i < length; i++) {
            var x = Math.random() * (114.55 - 114.6) + 114.6;
            var y = Math.random() * (30.7 - 30.65) + 30.65;
            var value = Math.random() * 100;
            data.push({
                x: x,
                y: y,
                value: value
            });
            a = x;
            b = y;
        }
        return data;
    }

    //添加场景切换
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.56064, 30.658141, 8000)
    });

    function addHeatMap() {
        //获取动态数据
        this.heatMap.setWGS84Data(valueMin, valueMax, getData(10));
    }

    addHeatMap();
}
function combineEcharts(option) {
    //结合echarts
    (function(e) {
        const t = {};
        function n(r) {
            if (t[r]) return t[r].exports;
            const i = t[r] = {
                i: r,
                l: !1,
                exports: {}
            };
            return e[r].call(i.exports, i, i.exports, n),
                i.l = !0,
                i.exports
        }
        n.m = e,
            n.c = t,
            n.d = function(e, t, r) {
                n.o(e, t) || Object.defineProperty(e, t, {
                    enumerable: !0,
                    get: r
                })
            },
            n.r = function(e) {
                "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module"
                }),
                    Object.defineProperty(e, "__esModule", {
                        value: !0
                    })
            },
            n.t = function(e, t) {
                if (1 & t && (e = n(e)), 8 & t) return e;
                if (4 & t && "object" == typeof e && e && e.__esModule) return e;
                const r = Object.create(null);
                if (n.r(r), Object.defineProperty(r, "default", {
                    enumerable: !0,
                    value: e
                }), 2 & t && "string" != typeof e) for (let i in e) n.d(r, i,
                    function(t) {
                        return e[t]
                    }.bind(null, i));
                return r
            },
            n.n = function(e) {
                let t = e && e.__esModule ?
                    function() {
                        return e.
                            default
                    }:
                    function() {
                        return e
                    };
                return n.d(t, "a", t),
                    t
            },
            n.o = function(e, t) {
                return Object.prototype.hasOwnProperty.call(e, t)
            },
            n.p = "",
            n(n.s = 0)
    })([function(e, t, n){e.exports = n(1)},function(e, t, n) {
        echarts ? n(2).load() : console.error("missing echarts lib")
    },function(e, t, n) {
        "use strict";
        function r(e, t) {
            for (let n = 0; n < t.length; n++) {
                let r = t[n];
                r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                "value" in r && (r.writable = !0),
                    Object.defineProperty(e, r.key, r)
            }
        }
        n.r(t);
        let i = function() {
            function e(t, n) { !
                function(e, t) {
                    if (! (e instanceof t)) throw new TypeError("Cannot call a class as a function")
                } (this, e),
                this._viewer = t,
                this.dimensions = ["lng", "lat"],
                this._mapOffset = [0, 0],
                this._api = n
            }
            let t, n, i;
            return t = e,
                i = [{
                    key: "create",
                    value: function(t, n) {
                        let r;
                        t.eachComponent("GLMap",
                            function(t) { (r = new e(echarts.cesiumViewer, n)).setMapOffset(t.__mapOffset || [0, 0]),
                                t.coordinateSystem = r
                            }),
                            t.eachSeries(function(e) {
                                "GLMap" === e.get("coordinateSystem") && (e.coordinateSystem = r)
                            })
                    }
                },
                    {
                        key: "dimensions",
                        get: function() {
                            return ["lng", "lat"]
                        }
                    }],
            (n = [{
                key: "setMapOffset",
                value: function(e) {
                    return this._mapOffset = e,
                        this
                }
            },
                {
                    key: "getViewer",
                    value: function() {
                        return this._viewer
                    }
                },
                {
                    key: "dataToPoint",
                    value: function(e) {
                        let t = this._viewer.scene,
                            n = [0, 0],
                            r = Cesium.Cartesian3.fromDegrees(e[0], e[1]);
                        if (!r) return n;
                        if (t.mode === Cesium.SceneMode.SCENE3D && Cesium.Cartesian3.angleBetween(t.camera.position, r) > Cesium.Math.toRadians(80)) return ! 1;
                        let i = t.cartesianToCanvasCoordinates(r);
                        return i ? [i.x - this._mapOffset[0], i.y - this._mapOffset[1]] : n
                    }
                },
                {
                    key: "pointToData",
                    value: function(e) {
                        let t = this._mapOffset,
                            n = viewer.scene.globe.ellipsoid,
                            r = new Cesium.cartesian3(e[1] + t, e[2] + t[2], 0),
                            i = n.cartesianToCartographic(r);
                        return [i.lng, i.lat]
                    }
                },
                {
                    key: "getViewRect",
                    value: function() {
                        let e = this._api;
                        return new echarts.graphic.BoundingRect(0, 0, e.getWidth(), e.getHeight())
                    }
                },
                {
                    key: "getRoamTransform",
                    value: function() {
                        return echarts.matrix.create()
                    }
                }]) && r(t.prototype, n),
            i && r(t, i),
                e
        } ();
        echarts.extendComponentModel({
            type: "GLMap",
            getViewer: function() {
                return echarts.cesiumViewer
            },
            defaultOption: {
                roam: !1
            }
        }),
            echarts.extendComponentView({
                type: "GLMap",
                init: function(e, t) {
                    this.api = t,
                        echarts.cesiumViewer.scene.postRender.addEventListener(this.moveHandler, this)
                },
                moveHandler: function(e, t) {
                    this.api.dispatchAction({
                        type: "GLMapRoam"
                    })
                },
                render: function(e, t, n) {},
                dispose: function(e) {
                    echarts.cesiumViewer.scene.postRender.removeEventListener(this.moveHandler, this)
                }
            });
        function a() {
            echarts.registerCoordinateSystem("GLMap", i),
                echarts.registerAction({
                        type: "GLMapRoam",
                        event: "GLMapRoam",
                        update: "updateLayout"
                    },
                    function(e, t) {})
        }
        n.d(t, "load",
            function() {
                return a
            })
    }])
    //开始
    echarts.cesiumViewer = this.viewer
    function CesiumEcharts(t, e) {
        this._mapContainer = t;
        this._overlay = this._createChartOverlay()
        this._overlay.setOption(e)
    }
    CesiumEcharts.prototype._createChartOverlay = function() {
        const t = this._mapContainer.scene;
        t.canvas.setAttribute('tabIndex', 0);
        const e = document.createElement('div');
        e.style.position = 'absolute';
        e.style.top = '0px';
        e.style.left = '0px';
        e.style.width = t.canvas.width + 'px';
        e.style.height = t.canvas.height + 'px';
        e.style.pointerEvents = 'none';
        const l = document.getElementsByClassName('echartMap').length
        e.setAttribute('id','ysCesium-echarts-'+parseInt(Math.random()*99999)+'-'+l)
        e.setAttribute('class', 'echartMap');
        this._mapContainer.container.appendChild(e);
        this._echartsContainer = e
        return echarts.init(e)
    }
    function dispose() {
        this._echartsContainer && (this._mapContainer.container.removeChild(this._echartsContainer), (this._echartsContainer = null)), this._overlay && (this._overlay.dispose(), (this._overlay = null))
    }
    function updateOverlay(t) {
        this._overlay && this._overlay.setOption(t)
    }
  function getMap() {
        return this._mapContainer
    }
    function getOverlay() {
        return this._overlay}

    function show() {
        document.getElementById(this._id).style.visibility = 'visible'
    }
    function hide() {
        document.getElementById(this._id).style.visibility = 'hidden'
    }

    new CesiumEcharts(this.viewer,option)
}
function addMovingMapsFirst(){
    const geoCoordMap = {
        '上海': [121.4648,31.2891],
        '东莞': [113.8953,22.901],
        '东营': [118.7073,37.5513],
        '中山': [113.4229,22.478],
        '临汾': [111.4783,36.1615],
        '临沂': [118.3118,35.2936],
        '丹东': [124.541,40.4242],
        '丽水': [119.5642,28.1854],
        '乌鲁木齐': [87.9236,43.5883],
        '佛山': [112.8955,23.1097],
        '保定': [115.0488,39.0948],
        '兰州': [103.5901,36.3043],
        '包头': [110.3467,41.4899],
        '北京': [116.4551,40.2539],
        '北海': [109.314,21.6211],
        '南京': [118.8062,31.9208],
        '南宁': [108.479,23.1152],
        '南昌': [116.0046,28.6633],
        '南通': [121.1023,32.1625],
        '厦门': [118.1689,24.6478],
        '台州': [121.1353,28.6688],
        '合肥': [117.29,32.0581],
        '呼和浩特': [111.4124,40.4901],
        '咸阳': [108.4131,34.8706],
        '哈尔滨': [127.9688,45.368],
        '唐山': [118.4766,39.6826],
        '嘉兴': [120.9155,30.6354],
        '大同': [113.7854,39.8035],
        '大连': [122.2229,39.4409],
        '天津': [117.4219,39.4189],
        '太原': [112.3352,37.9413],
        '威海': [121.9482,37.1393],
        '宁波': [121.5967,29.6466],
        '宝鸡': [107.1826,34.3433],
        '宿迁': [118.5535,33.7775],
        '常州': [119.4543,31.5582],
        '广州': [113.5107,23.2196],
        '廊坊': [116.521,39.0509],
        '延安': [109.1052,36.4252],
        '张家口': [115.1477,40.8527],
        '徐州': [117.5208,34.3268],
        '德州': [116.6858,37.2107],
        '惠州': [114.6204,23.1647],
        '成都': [103.9526,30.7617],
        '扬州': [119.4653,32.8162],
        '承德': [117.5757,41.4075],
        '拉萨': [91.1865,30.1465],
        '无锡': [120.3442,31.5527],
        '日照': [119.2786,35.5023],
        '昆明': [102.9199,25.4663],
        '杭州': [119.5313,29.8773],
        '枣庄': [117.323,34.8926],
        '柳州': [109.3799,24.9774],
        '株洲': [113.5327,27.0319],
        '武汉': [114.3896,30.6628],
        '汕头': [117.1692,23.3405],
        '江门': [112.6318,22.1484],
        '沈阳': [123.1238,42.1216],
        '沧州': [116.8286,38.2104],
        '河源': [114.917,23.9722],
        '泉州': [118.3228,25.1147],
        '泰安': [117.0264,36.0516],
        '泰州': [120.0586,32.5525],
        '济南': [117.1582,36.8701],
        '济宁': [116.8286,35.3375],
        '海口': [110.3893,19.8516],
        '淄博': [118.0371,36.6064],
        '淮安': [118.927,33.4039],
        '深圳': [114.5435,22.5439],
        '清远': [112.9175,24.3292],
        '温州': [120.498,27.8119],
        '渭南': [109.7864,35.0299],
        '湖州': [119.8608,30.7782],
        '湘潭': [112.5439,27.7075],
        '滨州': [117.8174,37.4963],
        '潍坊': [119.0918,36.524],
        '烟台': [120.7397,37.5128],
        '玉溪': [101.9312,23.8898],
        '珠海': [113.7305,22.1155],
        '盐城': [120.2234,33.5577],
        '盘锦': [121.9482,41.0449],
        '石家庄': [114.4995,38.1006],
        '福州': [119.4543,25.9222],
        '秦皇岛': [119.2126,40.0232],
        '绍兴': [120.564,29.7565],
        '聊城': [115.9167,36.4032],
        '肇庆': [112.1265,23.5822],
        '舟山': [122.2559,30.2234],
        '苏州': [120.6519,31.3989],
        '莱芜': [117.6526,36.2714],
        '菏泽': [115.6201,35.2057],
        '营口': [122.4316,40.4297],
        '葫芦岛': [120.1575,40.578],
        '衡水': [115.8838,37.7161],
        '衢州': [118.6853,28.8666],
        '西宁': [101.4038,36.8207],
        '西安': [109.1162,34.2004],
        '贵阳': [106.6992,26.7682],
        '连云港': [119.1248,34.552],
        '邢台': [114.8071,37.2821],
        '邯郸': [114.4775,36.535],
        '郑州': [113.4668,34.6234],
        '鄂尔多斯': [108.9734,39.2487],
        '重庆': [107.7539,30.1904],
        '金华': [120.0037,29.1028],
        '铜川': [109.0393,35.1947],
        '银川': [106.3586,38.1775],
        '镇江': [119.4763,31.9702],
        '长春': [125.8154,44.2584],
        '长沙': [113.0823,28.2568],
        '长治': [112.8625,36.4746],
        '阳泉': [113.4778,38.0951],
        '青岛': [120.4651,36.3373],
        '韶关': [113.7964,24.7028]
    };

    const XAData = [
        [{name:'西安'}, {name:'北京',value:100}],
        [{name:'西安'}, {name:'上海',value:100}],
        [{name:'西安'}, {name:'广州',value:100}],
        [{name:'西安'}, {name:'西宁',value:100}],
        [{name:'西安'}, {name:'银川',value:100}]
    ];

    const XNData = [
        [{name:'西宁'}, {name:'北京',value:100}],
        [{name:'西宁'}, {name:'上海',value:100}],
        [{name:'西宁'}, {name:'广州',value:100}],
        [{name:'西宁'}, {name:'西安',value:100}],
        [{name:'西宁'}, {name:'银川',value:100}]
    ];

    const YCData = [
        [{name:'银川'}, {name:'北京',value:100}],
        [{name:'银川'}, {name:'广州',value:100}],
        [{name:'银川'}, {name:'上海',value:100}],
        [{name:'银川'}, {name:'西安',value:100}],
        [{name:'银川'}, {name:'西宁',value:100}],
    ];

    const planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
    // const planePath = 'arrow';
    const convertData = function (data) {
        const res = [];
        for (let i = 0; i < data.length; i++) {

            const dataItem = data[i];

            const fromCoord = geoCoordMap[dataItem[0].name];
            const toCoord = geoCoordMap[dataItem[1].name];
            if (fromCoord && toCoord) {
                res.push({
                    fromName: dataItem[0].name,
                    toName: dataItem[1].name,
                    coords: [fromCoord, toCoord],
                    value: dataItem[1].value
                });
            }
        }
        return res;

    };
    const color = ['#a6c84c', '#ffa022', '#46bee9'];//航线的颜色
    const series = [];
    [['西安', XAData], ['西宁', XNData], ['银川', YCData]].forEach(function (item, i) {
        series.push(
            {
                name: item[0] + ' Top3',
                type: 'lines',
                coordinateSystem: 'GLMap',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: 'red',   //arrow箭头的颜色
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },
            {
                name: item[0] + ' Top3',
                type: 'lines',
                coordinateSystem: 'GLMap',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: planePath,
                    symbolSize: 15
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 1,
                        opacity: 0.6,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },
            {
                name: item[0] + ' Top3',
                type: 'effectScatter',
                coordinateSystem: 'GLMap',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    return val[2] / 8;
                },
                itemStyle: {
                    normal: {
                        color: color[i],
                    },
                    emphasis: {
                        areaColor: '#2B91B7'
                    }
                },
                data: item[1].map(function (dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                    };
                })
            });
    });
    const option = {
        animation: !1,
        GLMap: {},
        series: series
    };

    combineEcharts(option);

    viewer.camera.setView({
        destination : Cesium.Cartesian3.fromDegrees(117.16, 32.71, 15000000.0)
    });
}
function addMovingMapsSecond(){
    const chinaGeoCoordMap = {
        '黑龙江': [127.9688, 45.368],
        '内蒙古': [110.3467, 41.4899],
        "吉林": [125.8154, 44.2584],
        '北京市': [116.4551, 40.2539],
        "辽宁": [123.1238, 42.1216],
        "河北": [114.4995, 38.1006],
        "天津": [117.4219, 39.4189],
        "山西": [112.3352, 37.9413],
        "陕西": [109.1162, 34.2004],
        "甘肃": [103.5901, 36.3043],
        "宁夏": [106.3586, 38.1775],
        "青海": [101.4038, 36.8207],
        "新疆": [87.9236, 43.5883],
        "西藏": [91.11, 29.97],
        "四川": [103.9526, 30.7617],
        "重庆": [108.384366, 30.439702],
        "山东": [117.1582, 36.8701],
        "河南": [113.4668, 34.6234],
        "江苏": [118.8062, 31.9208],
        "安徽": [117.29, 32.0581],
        "湖北": [114.3896, 30.6628],
        "浙江": [119.5313, 29.8773],
        "福建": [119.4543, 25.9222],
        "江西": [116.0046, 28.6633],
        "湖南": [113.0823, 28.2568],
        "贵州": [106.6992, 26.7682],
        "云南": [102.9199, 25.4663],
        "广东": [113.12244, 23.009505],
        "广西": [108.479, 23.1152],
        "海南": [110.3893, 19.8516],
        '上海': [121.4648, 31.2891]
    };
    const chinaDatas = [
        [{
            name: '黑龙江',
            value: 0
        }],	[{
            name: '内蒙古',
            value: 0
        }],	[{
            name: '吉林',
            value: 0
        }],	[{
            name: '辽宁',
            value: 0
        }],	[{
            name: '河北',
            value: 0
        }],	[{
            name: '天津',
            value: 0
        }],	[{
            name: '山西',
            value: 0
        }],	[{
            name: '陕西',
            value: 0
        }],	[{
            name: '甘肃',
            value: 0
        }],	[{
            name: '宁夏',
            value: 0
        }],	[{
            name: '青海',
            value: 0
        }],	[{
            name: '新疆',
            value: 0
        }],[{
            name: '西藏',
            value: 0
        }],	[{
            name: '四川',
            value: 0
        }],	[{
            name: '重庆',
            value: 0
        }],	[{
            name: '山东',
            value: 0
        }],	[{
            name: '河南',
            value: 0
        }],	[{
            name: '江苏',
            value: 0
        }],	[{
            name: '安徽',
            value: 0
        }],	[{
            name: '湖北',
            value: 0
        }],	[{
            name: '浙江',
            value: 0
        }],	[{
            name: '福建',
            value: 0
        }],	[{
            name: '江西',
            value: 0
        }],	[{
            name: '湖南',
            value: 0
        }],	[{
            name: '贵州',
            value: 0
        }],[{
            name: '广西',
            value: 0
        }],	[{
            name: '海南',
            value: 0
        }],	[{
            name: '上海',
            value: 1
        }]
    ];

    const convertData = function(data) {
        const res = [];
        for(let i = 0; i < data.length; i++) {
            const dataItem = data[i];
            const fromCoord = chinaGeoCoordMap[dataItem[0].name];
            const toCoord = [116.4551,40.2539];
            if(fromCoord && toCoord) {
                res.push([{
                    coord: fromCoord,
                    value: dataItem[0].value
                }, {
                    coord: toCoord,
                }]);
            }
        }
        return res;
    };
    const series = [];
    [['北京市', chinaDatas]].forEach(function(item, i) {
        series.push(
            {
                type: 'lines',
                coordinateSystem: 'GLMap',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 4, //箭头指向速度，值越小速度越快
                    trailLength: 0.02, //特效尾迹长度[0,1]值越大，尾迹越长重
                    symbol: 'arrow', //箭头图标
                    symbolSize: 5, //图标大小
                },
                lineStyle: {
                    normal: {
                        width: 1, //尾迹线条宽度
                        opacity: 1, //尾迹线条透明度
                        color: '#00EAFF',//线的颜色
                        curveness: .3 //尾迹线条曲直度
                    }
                },
                data: convertData(item[1])
            },
            {
                type: 'effectScatter',
                coordinateSystem: 'GLMap',
                zlevel: 2,
                rippleEffect: { //涟漪特效
                    period: 4, //动画时间，值越小速度越快
                    brushType: 'stroke', //波纹绘制方式 stroke, fill
                    scale: 4 //波纹圆环最大限制，值越大波纹越大
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right', //显示位置
                        offset: [5, 0], //偏移设置
                        formatter: function(params){//圆环显示文字
                            return params.data.name;
                        },
                        fontSize: 13
                    },
                    emphasis: {
                        show: true
                    }
                },
                symbol: 'circle',
                symbolSize: function(val) {
                    return 5+ val[2] * 5; //圆环大小
                },
                itemStyle: {
                    normal: {
                        show: false,
                        color: '#32ff9d'//颜色
                    }
                },
                data: item[1].map(function(dataItem) {
                    return {
                        name: dataItem[0].name,
                        value: chinaGeoCoordMap[dataItem[0].name].concat([dataItem[0].value])
                    };
                }),
            },
            //被攻击点
            {
                type: 'scatter',
                coordinateSystem: 'GLMap',
                zlevel: 2,
                rippleEffect: {
                    period: 4,
                    brushType: 'stroke',
                    scale: 4
                },
                itemStyle: {
                    normal: {
                        color: '#ff0617'//颜色
                    }
                },
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        //offset:[5, 0],
                        color: '#0f0',
                        formatter: '{b}',
                        textStyle: {
                            color: "#0f0"
                        }
                    },
                    emphasis: {
                        show: true,
                        color: "#f60"
                    }
                },
                symbol: 'pin',
                symbolSize: 50,
                data: [{
                    name: item[0],
                    value: chinaGeoCoordMap[item[0]].concat([10]),
                }],
            }
        );
    });

    option = {
        animation: !1,
        GLMap: {},
        series: series
    };

    combineEcharts(option)

    viewer.camera.setView({
        destination : Cesium.Cartesian3.fromDegrees(117.16, 32.71, 15000000.0)
    });
}
//标绘模块
var DrawTool = function (obj) {
    if (!obj.viewer || !obj) {
        console.warn("缺少必要参数！--viewer");
        return;
    }
    this.viewer = obj.viewer;
    this.hasEdit = obj.hasEdit;
    this.toolArr = [];
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.show = obj.drawEndShow;
}
DrawTool.prototype = {
    startDraw: function (opt) {
        var that = this;
        // if (this.hasEdit) {
        //   this.bindEdit();
        // }
        if (opt.type == "polyline") {
            var polyline = new CreatePolyline(this.viewer, opt.style);
            polyline.start(function (evt) {
                if (that.hasEdit) {
                    that.unbindEdit();
                    polyline.startModify(opt.modifySuccess);
                    that.lastSelectEntity = polyline;
                }
                if (opt.success) opt.success(evt);
                if (that.show == false) polyline.setVisible(false);
            });
            this.toolArr.push(polyline);
        }
        if (opt.type == "polygon") {
            var polygon = new CreatePolygon(this.viewer, opt.style);
            polygon.start(function () {
                if (that.hasEdit) {
                    that.unbindEdit();
                    polygon.startModify();
                    that.lastSelectEntity = polygon;
                }
                if (opt.success) opt.success(polygon);
                if (that.show == false) polygon.setVisible(false);
            });
            this.toolArr.push(polygon);
        }
        if (opt.type == "billboard") {
            var billboard = new CreateBillboard(this.viewer, opt.style);
            billboard.start(function () {
                if (that.hasEdit) {
                    that.unbindEdit();
                    billboard.startModify();
                    that.lastSelectEntity = billboard;
                }
                if (opt.success) opt.success(billboard);
                if (that.show == false) billboard.setVisible(false);
            });
            this.toolArr.push(billboard);
        }
        if (opt.type == "circle") {
            var circle = new CreateCircle(this.viewer, opt.style);
            circle.start(function () {
                if (that.hasEdit) {
                    that.unbindEdit();
                    circle.startModify();
                    that.lastSelectEntity = circle;
                }
                if (opt.success) opt.success(circle);
                if (that.show == false) circle.setVisible(false);
            });
            this.toolArr.push(circle);
        }
        if (opt.type == "rectangle") {
            var rectangle = new CreateRectangle(this.viewer, opt.style);
            rectangle.start(function () {
                if (that.hasEdit) {
                    that.unbindEdit();
                    rectangle.startModify();
                    that.lastSelectEntity = rectangle;
                }
                if (opt.success) opt.success(rectangle);
                if (that.show == false) rectangle.setVisible(false);
            });
            this.toolArr.push(rectangle);
        }
        //重写材质
        if (opt.type == "flowPolyline") {
            var polyline = new CreatePolyline(this.viewer, opt.style);
            polyline.start(function () {
                if (that.hasEdit) {
                    that.unbindEdit();
                    polyline.startModify();
                }
                if (opt.success) opt.success(polyline);
            });
            this.toolArr.push(polyline);
        }

    },
    createByPositions: function (opt) {
        if (this.hasEdit) {
            this.bindEdit();
        }
        if (!opt) opt = {};
        if (opt.type == "polyline") {
            var polyline = new CreatePolyline(this.viewer, opt.style);
            polyline.createByPositions(opt.positions, opt.success);
            this.toolArr.push(polyline);
        }
        if (opt.type == "polygon") {
            var polygon = new CreatePolygon(this.viewer, opt.style);
            polygon.createByPositions(opt.positions, opt.success);
            this.toolArr.push(polygon);
        }
        if (opt.type == "billboard") {
            var billboard = new CreateBillboard(this.viewer, opt.style);
            billboard.createByPositions(opt.positions, function () {
                if (opt.success) opt.success(billboard)
            });
            this.toolArr.push(billboard);
        }
    },
    destroy: function () {
        for (var i = 0; i < this.toolArr.length; i++) {
            var obj = this.toolArr[i];
            obj.destroy();
        }
    },
    lastSelectEntity: null,
    bindEdit: function () {
        var that = this;
        this.handler.setInputAction(function (evt) { //单机开始绘制
            var pick = that.viewer.scene.pick(evt.position);
            if (Cesium.defined(pick) && pick.id) {
                for (var i = 0; i < that.toolArr.length; i++) {
                    if (pick.id.objId == that.toolArr[i].objId && (that.toolArr[i].state == 1 || that.toolArr[i].state == 2)) {
                        if (that.lastSelectEntity) {
                            that.lastSelectEntity.endModify();
                        }
                        that.toolArr[i].startModify();
                        that.lastSelectEntity = that.toolArr[i];
                        break;
                    }
                }
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    },
    unbindEdit: function () {
        for (var i = 0; i < this.toolArr.length; i++) {
            this.toolArr[i].endModify();
        }
    }
}
//绘制工具初始化
var drawTool = new DrawTool({
    viewer: viewer,
    hasEdit: true
});
//绘制矩形
$("#drawRectangle").click(function () {
    if (!drawTool) return;
    drawTool.startDraw({
        type: "rectangle",
        style: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        success: function (evt) {
        }
    });
});
//绘制线
$("#drawPolyline").click(function () {
    if (!drawTool) return;
    drawTool.startDraw({
        type: "polyline",
        style: {
            material: Cesium.Color.YELLOW,
            clampToGround: true
        },
        success: function (evt) {
        }
    });
});
//绘制多边形
$("#drawPolygon").click(function () {
    if (!drawTool) return;
    drawTool.startDraw({
        type: "polygon",
        style: {
            clampToGround: true,
            material: Cesium.Color.YELLOW,
        },
        success: function (evt) {
        }
    });
});
//绘制点
$("#drawBillboard").click(function () {
    if (!drawTool) return;
    drawTool.startDraw({
        type: "billboard",
        style: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            image: 'marker.png'
        },
        success: function (evt) {
        }
    });
});
//绘制圆
$("#drawCircle").click(function () {
    if (!drawTool) return;
    drawTool.startDraw({
        type: "circle",
        style: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        },
        success: function (evt) {
        }
    });
});
var measureArr = [];
//测量面积
$("#measureSpaceArea").click(function () {
    var msa = new MeasureSpaceArea(viewer, {});
    msa.start();
    measureArr.push(msa);
});
//测量距离
$("#measureSpaceDistance").click(function () {
    var msd = new MeasureSpaceDistance(viewer, {});
    msd.start();
    measureArr.push(msd);
});
function clean() {
    viewer.entities.removeAll();
    viewer.dataSources.removeAll();
    viewer.scene.postProcessStages.removeAll();
    viewer.shouldAnimate=false;
    document.getElementsByClassName("leaflet-popup")[0].style.display="none";
}