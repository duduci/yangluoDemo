GAODELayer = DObject({
    id:null,
    esriLayer: null,
    esriLayerType:'road',
    construct: function (options) {
        DUtil.extend(this, options);
        dojo.declare("GaoDeTiledMapServiceLayer", esri.layers.TiledMapServiceLayer, {
            id:null,
            layertype: "road",//图层类型
            constructor: function (args) {
                this.spatialReference = new esri.SpatialReference(MapConfig.mapInitParams.gaode_spatialReference);
                DUtil.extend(this, args);
                this.fullExtent = new esri.geometry.Extent({
                    xmin: MapConfig.params_gaode.fullExtent.xmin,
                    ymin: MapConfig.params_gaode.fullExtent.ymin,
                    xmax: MapConfig.params_gaode.fullExtent.xmax,
                    ymax: MapConfig.params_gaode.fullExtent.ymax,
                    spatialReference: this.spatialReference
                });
                this.initialExtent = this.fullExtent;
                this.tileInfo = new esri.layers.TileInfo(MapConfig.params_gaode);
                this.loaded = true;
                this.onLoad(this);
            },
            /**
             * 根据不同的layType返回不同的图层
             * @param level
             * @param row
             * @param col
             * @returns {string}
             */
            getTileUrl: function (level, row, col) {
                var url = "";
                switch (this.layertype) {
                    case "road"://矢量
                        url = 'http://webrd0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=' + col + '&y=' + row + '&z=' + level;
                        break;
                    case "st"://影像
                        url = 'http://webst0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?style=6&x=' + col + '&y=' + row + '&z=' + level;
                        break;
                    case "label"://影像标
                        url = 'http://webst0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?style=8&x=' + col + '&y=' + row + '&z=' + level;
                        break;
                    default:
                        url = 'http://webrd0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=' + col + '&y=' + row + '&z=' + level;
                        break;
                }
                return url;
            }
        });
        this.esriLayer = new GaoDeTiledMapServiceLayer({id:this.id,layertype:this.esriLayerType});
    },
    hide: function () {
        this.esriLayer.hide();
    },
    show: function () {
        this.esriLayer.show();
    }
});