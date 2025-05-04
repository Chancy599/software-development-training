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
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:65", "获取位置失败:", err);
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
      common_vendor.index.showToast({ title: "已更新位置", icon: "none" });
    },
    updateMarkers() {
      this.markers = [{
        id: 0,
        latitude: this.latitude,
        longitude: this.longitude,
        iconPath: "/static/location-marker.png",
        width: 40,
        height: 40,
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
    checkIn() {
      common_vendor.index.showLoading({ title: "签到中...", mask: true });
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
          common_vendor.index.__f__("log", "at pages/Location_Check_In/Location_Check_In.vue:120", "定位签到返回:", res);
          if (res.data.success === true) {
            this.commit(this.classId, this.startTime);
          } else {
            common_vendor.index.hideLoading();
            common_vendor.index.showModal({
              title: "签到失败",
              content: res.data.message || "签到验证未通过",
              showCancel: false
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:133", "签到失败:", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            title: "签到失败",
            content: "网络异常，请稍后重试",
            showCancel: false
          });
        }
      });
    },
    commit(classId, startTime) {
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
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
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("log", "at pages/Location_Check_In/Location_Check_In.vue:159", "后端返回数据:", res);
          if (res.data && res.data.state) {
            if (res.data.state === "IN_TIME") {
              common_vendor.index.showModal({
                title: "签到成功",
                content: "您已准时签到！",
                showCancel: false,
                success: () => {
                  common_vendor.index.navigateBack();
                }
              });
            } else if (res.data.state === "LATE") {
              common_vendor.index.showModal({
                title: "签到提示",
                content: "您已迟到，请下次注意时间。",
                showCancel: false,
                success: () => {
                  common_vendor.index.navigateBack();
                }
              });
            }
          }
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/Location_Check_In/Location_Check_In.vue:184", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.latitude,
    b: $data.longitude,
    c: $data.markers,
    d: common_vendor.o((...args) => $options.handleMapTap && $options.handleMapTap(...args)),
    e: $data.latitude && $data.longitude
  }, $data.latitude && $data.longitude ? {
    f: common_vendor.p({
      type: "location-filled",
      size: "20",
      color: "#07C160"
    }),
    g: common_vendor.t($data.longitude.toFixed(6)),
    h: common_vendor.t($data.latitude.toFixed(6))
  } : {}, {
    i: common_vendor.p({
      type: "checkbox-filled",
      size: "20",
      color: "#fff"
    }),
    j: common_vendor.o((...args) => $options.checkIn && $options.checkIn(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Location_Check_In/Location_Check_In.js.map
