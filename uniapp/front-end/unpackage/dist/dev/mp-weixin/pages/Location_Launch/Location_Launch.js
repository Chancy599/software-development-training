"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classid: "",
      duration: "",
      latitude: "",
      longitude: "",
      markers: []
    };
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || "");
    this.duration = decodeURIComponent(options.duration || "");
    this.getCurrentLocation();
  },
  methods: {
    getCurrentLocation() {
      common_vendor.index.showLoading({ title: "获取位置中...", mask: true });
      common_vendor.wx$1.getLocation({
        type: "gcj02",
        isHighAccuracy: true,
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
          this.updateMarkers();
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "定位成功", icon: "success" });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Launch/Location_Launch.vue:67", "获取位置失败:", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            title: "定位失败",
            content: "请检查是否授予定位权限，或手动选择位置",
            showCancel: false
          });
        }
      });
    },
    handleMapTap(e) {
      this.latitude = e.detail.latitude;
      this.longitude = e.detail.longitude;
      this.updateMarkers();
      common_vendor.index.showToast({ title: "已选择新位置", icon: "none", duration: 1e3 });
    },
    updateMarkers() {
      this.markers = [{
        id: 1,
        latitude: this.latitude,
        longitude: this.longitude,
        title: "签到点",
        callout: {
          content: "签到位置",
          color: "#07C160",
          fontSize: 14,
          borderRadius: 10,
          padding: 5,
          display: "ALWAYS"
        }
      }];
    },
    Launch() {
      common_vendor.index.showLoading({ title: "发起签到中...", mask: true });
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${this.duration}&method=GPS&longitude=${this.longitude}&latitude=${this.latitude}`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        success: (res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "签到已发起", icon: "success" });
          setTimeout(() => common_vendor.index.navigateBack(), 1500);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Launch/Location_Launch.vue:115", "请求失败:", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            title: "发起失败",
            content: "网络异常，请稍后重试",
            showCancel: false
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.latitude,
    b: $data.longitude,
    c: $data.markers,
    d: common_vendor.o((...args) => $options.handleMapTap && $options.handleMapTap(...args)),
    e: $data.latitude && $data.longitude
  }, $data.latitude && $data.longitude ? {
    f: common_vendor.t($data.latitude.toFixed(6)),
    g: common_vendor.t($data.longitude.toFixed(6))
  } : {}, {
    h: common_vendor.o((...args) => $options.getCurrentLocation && $options.getCurrentLocation(...args)),
    i: common_vendor.o((...args) => $options.Launch && $options.Launch(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Location_Launch/Location_Launch.js.map
