"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      // 用户名
      belongInformation: [],
      // 组织信息
      selectedOrganization: "",
      // 选中的组织
      checkInRecords: [],
      // 签到记录
      totalRecords: 0
      // 记录总数
    };
  },
  onLoad() {
    this.getUserBelongInformation();
  },
  methods: {
    // 获取用户所属组织
    getUserBelongInformation() {
      this.username = common_vendor.index.getStorageSync("globalUsername");
      if (!this.username) {
        common_vendor.index.showToast({
          title: "未登录，请重新登录",
          icon: "none"
        });
        return;
      }
      const envId = "prod-7glwxii4e6eb93d8";
      const apiUrl = `https://${envId}.service.tcloudbase.com/getBelongInformation`;
      common_vendor.index.request({
        url: apiUrl,
        method: "POST",
        header: {
          "content-type": "application/json"
        },
        data: { username: this.username },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/Individual_Check_In/Individual_Check_In.vue:62", "组织信息返回:", res);
          if (res.data.belong_information.length === 0) {
            common_vendor.index.showToast({
              title: "你不归属于任何组织",
              icon: "none"
            });
          } else {
            this.belongInformation = res.data.belong_information;
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Individual_Check_In/Individual_Check_In.vue:73", "请求失败:", err);
          common_vendor.index.showToast({
            title: "获取组织信息失败",
            icon: "none"
          });
        }
      });
    },
    // 处理用户选择组织
    handleSelectOrganization(event) {
      const index = event.detail.value;
      this.selectedOrganization = this.belongInformation[index];
      this.sendSelectedOrganization();
    },
    // 发送用户选择的组织到后端，获取签到记录
    sendSelectedOrganization() {
      const envId = "prod-7glwxii4e6eb93d8";
      const apiUrl = `https://${envId}.service.tcloudbase.com/getCheckInRecords`;
      common_vendor.index.request({
        url: apiUrl,
        method: "POST",
        header: {
          "content-type": "application/json"
        },
        data: {
          username: this.username,
          organization: this.selectedOrganization
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/Individual_Check_In/Individual_Check_In.vue:107", "签到记录返回:", res);
          if (res.data.records) {
            this.checkInRecords = res.data.records;
            this.totalRecords = res.data.total;
          } else {
            common_vendor.index.showToast({
              title: "获取签到记录失败",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/Individual_Check_In/Individual_Check_In.vue:119", "请求失败:", err);
          common_vendor.index.showToast({
            title: "请求失败，请检查网络",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.selectedOrganization || "请选择组织"),
    b: $data.belongInformation,
    c: common_vendor.o((...args) => $options.handleSelectOrganization && $options.handleSelectOrganization(...args)),
    d: $data.checkInRecords.length > 0
  }, $data.checkInRecords.length > 0 ? {
    e: common_vendor.t($data.totalRecords),
    f: common_vendor.f($data.checkInRecords, (record, index, i0) => {
      return {
        a: common_vendor.t(record[0]),
        b: common_vendor.t(record[1]),
        c: common_vendor.t(record[2]),
        d: common_vendor.t(record[3]),
        e: index
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Individual_Check_In/Individual_Check_In.js.map
