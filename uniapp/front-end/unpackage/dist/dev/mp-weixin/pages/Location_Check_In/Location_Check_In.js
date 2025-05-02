"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classId: "",
      startTime: "",
      latitude: "",
      longitude: ""
    };
  },
  onLoad() {
    this.classId = decodeURIComponent(options.classId || "");
    this.startTime = decodeURIComponent(options.startTime || "");
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
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:40", "获取位置失败:", err);
        }
      });
    },
    checkIn(classId, startTime) {
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/api/checkins/verify?userId=${encodeURIComponent(this.$globalData.username)}&classId=${encodeURIComponent(classId)}&startTime=${encodeURIComponent(startTime)}&method=GPS&longitude=${encodeURIComponent(this.longitude)}&latitude=${encodeURIComponent(this.latitude)}`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/Location_Check_In/Location_Check_In.vue:54", "定位签到返回:", res);
          if (res.data === true) {
            common_vendor.index.showToast({ title: "签到成功", icon: "success" });
            this.commit(classId, startTime);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:61", "签到失败:", err);
          common_vendor.index.showToast({ title: "签到失败，请稍后重试", icon: "none" });
        }
      });
    },
    commit(classId, startTime) {
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `//api/checkins/commit?userId=${encodeURIComponent(this.$globalData.username)}&classId=${encodeURIComponent(classId)}&startTime=${encodeURIComponent(startTime)}`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/Location_Check_In/Location_Check_In.vue:78", "后端返回数据:", res);
          if (res.data && res.data.state) {
            if (res.data.state === "IN_TIME") {
              common_vendor.index.showToast({ title: "准时", icon: "success", duration: 1e3 });
            } else if (res.data.state === "LATE") {
              common_vendor.index.showToast({ title: "迟到", icon: "none", duration: 1e3 });
            }
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:88", "请求失败:", err);
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
