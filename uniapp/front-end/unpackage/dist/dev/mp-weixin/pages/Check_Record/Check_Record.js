"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  methods: {
    goToPage(pageName) {
      common_vendor.index.navigateTo({
        url: `/pages/${pageName}/${pageName}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $options.goToPage("Organization_Records")),
    b: common_vendor.o(($event) => $options.goToPage("Member_Records")),
    c: common_vendor.o(($event) => $options.goToPage("My_Records"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Check_Record/Check_Record.js.map
