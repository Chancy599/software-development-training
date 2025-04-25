"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classid: "",
      duration: "",
      latitude: 0,
      longitude: 0,
      markers: []
    };
  },
  onLoad() {
    this.classid = decodeURIComponent(options.classid || "");
    this.duration = decodeURIComponent(options.duration || "");
    this.getCurrentLocation();
  },
  methods: {
    getCurrentLocation() {
      common_vendor.wx$1.getLocation({
        type: "gcj02",
        // 适用于微信地图
        isHighAccuracy: true,
        // 高精度模式
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          this.updateMarkers();
          common_vendor.wx$1.showToast({ title: "已获取当前位置", icon: "success" });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Launch/Location_Launch.vue:43", "获取位置失败:", err);
          common_vendor.wx$1.showToast({ title: "获取位置失败", icon: "none" });
        }
      });
    },
    handleMapTap(e) {
      this.latitude = e.detail.latitude;
      this.longitude = e.detail.longitude;
      this.updateMarkers();
      common_vendor.wx$1.showToast({ title: "已选择新位置", icon: "success" });
    },
    updateMarkers() {
      this.markers = [{
        id: 1,
        latitude: this.latitude,
        longitude: this.longitude,
        title: "签到位置"
      }];
    },
    Launch() {
      common_vendor.index.showToast({
        title: "定位签到已发起",
        icon: "success"
      });
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
          // 云托管环境ID
        },
        path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}&method=GPS&longitude=${encodeURIComponent(this.longitude)}&latitude=${encodeURIComponent(this.latitude)}`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/Location_Launch/Location_Launch.vue:79", "后端返回数据:", res);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Launch/Location_Launch.vue:82", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.latitude,
    b: $data.longitude,
    c: $data.markers,
    d: common_vendor.o((...args) => $options.handleMapTap && $options.handleMapTap(...args)),
    e: common_vendor.o((...args) => $options.getCurrentLocation && $options.getCurrentLocation(...args)),
    f: common_vendor.o((...args) => $options.Launch && $options.Launch(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Location_Launch/Location_Launch.js.map
