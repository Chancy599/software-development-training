"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  methods: {
    navigateTo(path) {
      common_vendor.index.navigateTo({
        url: `/${path}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_vendor.o(($event) => $options.navigateTo("pages/Location_Check_In")),
    c: common_assets._imports_1,
    d: common_vendor.o(($event) => $options.navigateTo("pages/Cipher_Check_In/Cipher_Check_In")),
    e: common_assets._imports_2,
    f: common_vendor.o(($event) => $options.navigateTo("pages/QRCode_Check_In/QRCode_Check_In")),
    g: common_assets._imports_3,
    h: common_vendor.o(($event) => $options.navigateTo("pages/Face_Check_In/Face_Check_In"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/joinSign/joinSign.js.map
