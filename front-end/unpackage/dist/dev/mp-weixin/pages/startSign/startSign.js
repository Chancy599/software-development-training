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
    a: common_assets._imports_0$2,
    b: common_vendor.o(($event) => $options.navigateTo("pages/Location_Launch/Location_Launch")),
    c: common_assets._imports_1$1,
    d: common_vendor.o(($event) => $options.navigateTo("pages/Cipher_Launch/Cipher_Launch")),
    e: common_assets._imports_2$1,
    f: common_vendor.o(($event) => $options.navigateTo("pages/QRCode_Launch/QRCode_Launch")),
    g: common_assets._imports_3$1,
    h: common_vendor.o(($event) => $options.navigateTo("pages/Face_Launch/Face_Launch"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/startSign/startSign.js.map
