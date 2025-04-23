"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      latitude: 0,
      longitude: 0,
      markers: []
    };
  },
  onLoad() {
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
          common_vendor.index.__f__("error", "at pages/Location_Launch/Location_Launch.vue:41", "获取位置失败:", err);
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
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.latitude,
    b: $data.longitude,
    c: $data.markers,
    d: common_vendor.o((...args) => $options.handleMapTap && $options.handleMapTap(...args)),
    e: common_vendor.t($data.latitude),
    f: common_vendor.t($data.longitude),
    g: common_vendor.o((...args) => $options.getCurrentLocation && $options.getCurrentLocation(...args)),
    h: common_vendor.o((...args) => _ctx.Launch && _ctx.Launch(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Location_Launch/Location_Launch.js.map
