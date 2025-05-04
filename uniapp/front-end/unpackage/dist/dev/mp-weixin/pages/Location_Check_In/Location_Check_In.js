"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classId: "",
      startTime: "",
      latitude: "",
      longitude: "",
      markers: []
    };
  },
  onLoad(options) {
    this.classId = decodeURIComponent(options.classId || "");
    this.startTime = decodeURIComponent(options.startTime || "");
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
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:43", "获取位置失败:", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            title: "定位失败",
            content: "请检查是否授予定位权限，或手动选择位置",
            showCancel: false
          });
        }
      });
    },
    updateMarkers() {
      this.markers = [{
        id: 0,
        latitude: this.latitude,
        longitude: this.longitude,
        width: 40,
        height: 40
      }];
    },
    checkIn() {
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/api/checkins/verify`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          userId: this.$globalData.username,
          classId: this.classId,
          startTime: this.startTime,
          method: "GPS",
          params: {
            longitude: this.longitude,
            latitude: this.latitude
          }
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/Location_Check_In/Location_Check_In.vue:82", "定位签到返回:", res);
          if (res.data.success === true) {
            common_vendor.index.showToast({ title: "签到成功", icon: "success" });
            this.commit(this.classId, this.startTime);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:89", "签到失败:", err);
          common_vendor.index.showToast({ title: "签到失败，请稍后重试", icon: "none" });
        }
      });
    },
    commit(classId, startTime) {
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/api/checkins/commit`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          userId: this.$globalData.username,
          classId,
          startTime
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/Location_Check_In/Location_Check_In.vue:111", "后端返回数据:", res);
          if (res.data && res.data.state) {
            if (res.data.state === "IN_TIME") {
              common_vendor.index.showToast({ title: "准时", icon: "success", duration: 1e3 });
            } else if (res.data.state === "LATE") {
              common_vendor.index.showToast({ title: "迟到", icon: "none", duration: 1e3 });
            }
          }
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1e3);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:124", "请求失败:", err);
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
    d: common_vendor.o((...args) => $options.checkIn && $options.checkIn(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Location_Check_In/Location_Check_In.js.map
