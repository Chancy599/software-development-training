"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      latitude: 0,
      longitude: 0
    };
  },
  mounted() {
    this.getLocation();
  },
  methods: {
    getLocation() {
      common_vendor.wx$1.getLocation({
        type: "gcj02",
        // 适用于微信地图
        isHighAccuracy: true,
        // 高精度模式
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:36", "获取位置失败:", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.latitude,
    b: $data.longitude,
    c: [{
      latitude: $data.latitude,
      longitude: $data.longitude
    }],
    d: common_vendor.t($data.latitude),
    e: common_vendor.t($data.longitude),
    f: common_vendor.o((...args) => _ctx.checkIn && _ctx.checkIn(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Location_Check_In/Location_Check_In.js.map
