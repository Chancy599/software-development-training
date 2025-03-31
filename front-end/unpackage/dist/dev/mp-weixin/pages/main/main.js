"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {};
  },
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
        case "Location_Check_In":
          common_vendor.index.navigateTo({ url: "/pages/Location_Check_In/Location_Check_In" });
          break;
        case "mySettings":
          common_vendor.index.navigateTo({ url: "/pages/mySettings/mySettings" });
          break;
        default:
          common_vendor.index.showToast({
            title: "功能暂未开放",
            icon: "none"
          });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.handleMenuItemClick("startSign")),
    b: common_vendor.o(($event) => $options.handleMenuItemClick("joinSign")),
    c: common_vendor.o(($event) => $options.handleMenuItemClick("Location_Check_In")),
    d: common_vendor.o(($event) => $options.handleMenuItemClick("mySettings"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/main/main.js.map
