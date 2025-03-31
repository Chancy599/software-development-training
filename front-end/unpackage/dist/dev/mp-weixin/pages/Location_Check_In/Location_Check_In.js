"use strict";
const common_vendor = require("../../common/vendor.js");
const envId = "prod-7glwxii4e6eb93d8";
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
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:38", "获取位置失败:", err);
        }
      });
    },
    checkIn() {
      if (this.latitude && this.longitude) {
        common_vendor.wx$1.cloud.callFunction({
          name: "checkIn",
          env: envId,
          // 设置云托管环境ID
          data: {
            latitude: this.latitude,
            longitude: this.longitude
          },
          success: (res) => {
            common_vendor.wx$1.showToast({ title: "签到成功", icon: "success" });
          },
          fail: (err) => {
            common_vendor.wx$1.showToast({ title: "签到失败", icon: "none" });
            common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:56", "签到失败:", err);
          }
        });
      } else {
        common_vendor.wx$1.showToast({ title: "未获取到位置", icon: "none" });
      }
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
    f: common_vendor.o((...args) => $options.checkIn && $options.checkIn(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Location_Check_In/Location_Check_In.js.map
