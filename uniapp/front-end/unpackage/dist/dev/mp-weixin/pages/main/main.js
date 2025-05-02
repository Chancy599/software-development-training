"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  methods: {
    // 处理菜单项点击
    handleMenuItemClick(item) {
      switch (item) {
        case "startSign":
          common_vendor.index.navigateTo({ url: "/pages/startSign/startSign" });
          break;
        case "UncheckedList":
          common_vendor.index.navigateTo({ url: "/pages/UncheckedList/UncheckedList" });
          break;
        case "Check_Record":
          common_vendor.index.navigateTo({ url: "/pages/Check_Record/Check_Record" });
          break;
        case "mySettings":
          common_vendor.index.navigateTo({ url: "/pages/mySettings/mySettings" });
          break;
        case "OrgCreate":
          common_vendor.index.navigateTo({ url: "/pages/OrgCreate/OrgCreate" });
          break;
        case "OrgManage":
          common_vendor.index.navigateTo({ url: "/pages/OrgManage/OrgManage" });
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
    a: common_assets._imports_0$2,
    b: common_vendor.o(($event) => $options.handleMenuItemClick("startSign")),
    c: common_assets._imports_1,
    d: common_vendor.o(($event) => $options.handleMenuItemClick("UncheckedList")),
    e: common_assets._imports_2,
    f: common_vendor.o(($event) => $options.handleMenuItemClick("Check_Record")),
    g: common_assets._imports_3,
    h: common_vendor.o(($event) => $options.handleMenuItemClick("mySettings")),
    i: common_assets._imports_4,
    j: common_vendor.o(($event) => $options.handleMenuItemClick("OrgCreate")),
    k: common_assets._imports_5,
    l: common_vendor.o(($event) => $options.handleMenuItemClick("OrgManage"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/main/main.js.map
