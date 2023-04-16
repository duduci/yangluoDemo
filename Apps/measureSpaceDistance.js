//空间距离量算js
var MeasureSpaceDistance = function (viewer, opt) {
	this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
	this.viewer = viewer;
	this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	this.ts_handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
	//线
	this.polyline = null;
	//线坐标
	this.positions = [];
	//标签数组
	this.labels = [];
	this.floatLable = null;
	this.lastCartesian = null;
	this.allDistance = 0;
	var that = this;
}
MeasureSpaceDistance.prototype = {
	//开始测量
	start: function () {
		var that = this;
		this.handler.setInputAction(function (evt) { //单机开始绘制
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline, that.floatLable]);
			if (!cartesian) return;
			if (that.positions.length == 0) {
				var label = that.createLabel(cartesian, "起点");
				that.labels.push(label);
				that.floatLable = that.createLabel(cartesian, "");
				that.floatLable.show = false;
				that.positions.push(cartesian);
				that.positions.push(cartesian.clone());
				that.lastCartesian = cartesian;
			} else {
				that.floatLable.show = false;
				that.positions.push(cartesian);
				if (!that.lastCartesian) return;
				var distance = that.getLength(cartesian, that.lastCartesian);
				that.allDistance += distance;
				var text = that.formatLength(distance);
				var label = that.createLabel(cartesian, text);
				that.labels.push(label);
			}
			that.lastCartesian = cartesian;
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
		this.handler.setInputAction(function (evt) {
			if (that.positions.length < 1) return;
			that.floatLable.show = true;
			var cartesian = that.getCatesian3FromPX(evt.endPosition, that.viewer, [that.polyline, that.floatLable]);
			if (!cartesian) return;
			if (that.positions.length == 2) {
				if (!Cesium.defined(that.polyline)) {
					that.polyline = that.createLine();
				}
			}
			if (that.polyline) {
				that.positions.pop();
				that.positions.push(cartesian);
				if (!that.lastCartesian) return;
				var distance = that.getLength(cartesian, that.lastCartesian);
				that.floatLable.show = true;
				that.floatLable.label.text = that.formatLength(distance);
				that.floatLable.position.setValue(cartesian);
			}
		}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
		this.handler.setInputAction(function (evt) {
			if (!that.polyline) return;
			that.floatLable.show = false;
			that.viewer.scene.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
			that.viewer.trackedEntity = undefined;
		
			var cartesian = that.getCatesian3FromPX(evt.position, that.viewer, [that.polyline, that.floatLable]);
			var distanceLast = that.getLength(cartesian, that.lastCartesian);
			that.allDistance += distanceLast;
			var allDistance = that.formatLength(that.allDistance);


			var label = that.createLabel(cartesian, "");
			if (!cartesian) return;
			that.labels.push(label);
			that.labels[that.labels.length - 1].label.text = "总长：" + allDistance;
			if (that.handler) {
				that.handler.destroy();
				that.handler = null;
			}
			if (that.tsLabel) {
				that.viewer.entities.remove(that.tsLabel);
			}
			if (that.ts_handler) {
				that.ts_handler.destroy();
				that.ts_handler = null;
			}
		}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
	},
	//清除测量结果
	clear: function () {
		if (this.polyline) {
			this.viewer.entities.remove(this.polyline);
			this.polyline = null;
		}
		for (var i = 0; i < this.labels.length; i++) {
			this.viewer.entities.remove(this.labels[i]);
		}
		this.labels = [];
		if (this.floatLable) {
			this.viewer.entities.remove(this.floatLable);
			this.floatLable = null;
		}
		this.floatLable = null;
	},
	createLine: function () {
		var that = this;
		var polyline = this.viewer.entities.add({
			polyline: {
				positions: new Cesium.CallbackProperty(function () {
					return that.positions
				}, false),
				show: true,
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				material: Cesium.Color.YELLOW,
				width: 3,
				clampToGround:true,
			}
		});
		polyline.objId = this.objId;
		return polyline;
	},
	createLabel: function (c, text) {
		if (!c) return;
		var label = this.viewer.entities.add({
			position: c,
			label: {
				text: text || "",
				font: '24px Helvetica',
				fillColor: Cesium.Color.SKYBLUE,
				outlineColor: Cesium.Color.BLACK,
				outlineWidth: 2,
				disableDepthTestDistance: Number.POSITIVE_INFINITY,
				style: Cesium.LabelStyle.FILL_AND_OUTLINE,
				horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,
				verticalOrigin: Cesium.VerticalOrigin.BOTTOM
			}
		});

		return label;
	},
	getLength: function (c1, c2) {
		if (!c1 || !c2) return 0;
		return Cesium.Cartesian3.distance(c1, c2);
	},
	formatLength: function (num, dw) {
		if (!num) return;
		var res = null;
		if (!dw) {
			dw = "米";
			var n = Number(num).toFixed(2);
			res = n + dw;
		}
		if (dw == "千米" || dw == "公里") {
			var n = (Number(num) / 1000).toFixed(2);
			res = n + dw;
		}
		return res;
	},
	//兼容模型和地形上坐标拾取
	getCatesian3FromPX: function (px, viewer, noPickEntityArr) {
		var picks = viewer.scene.drillPick(px);
		viewer.render();
		var getOnModel = false;
		var that = this;
		var cartesian;
		if (viewer.scene.pickPositionSupported) { //检测是否支持拾取坐标
			for (var i = 0; i < picks.length; i++) {
				var pickedObject = picks[i];
				for (var j = 0; j < noPickEntityArr.length; j++) {
					var noPickEntity = noPickEntityArr[j];
					if (that.hasPickedModel(pickedObject, noPickEntity)) {
						getOnModel = true;
					}
				}
			}
		}
		if (getOnModel) {
			cartesian = viewer.scene.pickPosition(px);
		} else {
			var ray = viewer.camera.getPickRay(px);
			if (!ray) return null;
			cartesian = viewer.scene.globe.pick(ray, viewer.scene);
		}
		return cartesian;
	},
	//过滤拾取 屏蔽对某个entity的拾取
	hasPickedModel: function (pickedObject, noPickEntity) {
		if (!noPickEntity) return true;
		if (Cesium.defined(pickedObject.id)) {
			var entity = pickedObject.id;
			if (noPickEntity && entity == noPickEntity) return false;
		}

		if (Cesium.defined(pickedObject.primitive)) {
			var primitive = pickedObject.primitive;
			if (noPickEntity && primitive == noPickEntity) return false;
		}
		return true;
	}
}