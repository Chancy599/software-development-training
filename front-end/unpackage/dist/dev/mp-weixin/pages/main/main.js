"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  methods: {
    // 处理菜单项点击
    handleMenuItemClick(item) {
      switch (item) {
        case "startSign":
          common_vendor.index.navigateTo({ url: "/pages/startSign/startSign" });
          break;
        case "joinSign":
          common_vendor.index.navigateTo({ url: "/pages/joinSign/joinSign" });
          break;
        case "Check_Record":
          common_vendor.index.navigateTo({ url: "/pages/Check_Record/Check_Record" });
          break;
        case "mySettings":
          common_vendor.index.navigateTo({ url: "/pages/mySettings/mySettings" });
          break;
        case "mySettings":
          common_vendor.index.navigateTo({ url: "/pages/OrgCreate/OrgCreate" });
          break;
        case "mySettings":
          common_vendor.index.navigateTo({ url: "/pages/UncheckedList/UncheckedList" });
          break;
        default:
          common_vendor.index.showToast({
            title: "功能暂未开放",
            icon: "none"
          });
      }
    },
    // 获取用户信息
    fetchUserInfo() {
      const username = this.$globalData.username;
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/getInfo?id=${encodeURIComponent(username)}`,
        header: {
          "X-WX-SERVICE": "userinfo",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/main/main.vue:90", "后端返回数据:", res);
          if (res.data) {
            this.$globalData.name = res.data.name || "";
            this.$globalData.gender = res.data.gender || "";
            this.$globalData.contact_information = res.data.contact_information || "";
            this.$globalData.belong_information = res.data.belong_information || [];
            this.$globalData.manage_information = res.data.manage_information || [];
            this.$globalData.belong_name = res.data.belong_name || [];
            this.$globalData.manage_name = res.data.manage_name || [];
          } else {
            common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/main/main.vue:106", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    }
  },
  onLoad() {
    this.fetchUserInfo();
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.handleMenuItemClick("startSign")),
    b: common_vendor.o(($event) => $options.handleMenuItemClick("joinSign")),
    c: common_vendor.o(($event) => $options.handleMenuItemClick("Check_Record")),
    d: common_vendor.o(($event) => $options.handleMenuItemClick("mySettings")),
    e: common_vendor.o(($event) => $options.handleMenuItemClick("OrgCreate")),
    f: common_vendor.o(($event) => $options.handleMenuItemClick("UncheckedList"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/main/main.js.map
