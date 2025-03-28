"use strict";
const common_vendor = require("../../common/vendor.js");
const envId = "prod-7glwxii4e6eb93d8";
const _sfc_main = {
  data() {
    return {
      userData: {}
      // 初始化为空
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      common_vendor.wx$1.request({
        url: `https://${envId}.service.tcloudbase.com/user/12345`,
        // 你的云托管 API 地址
        method: "GET",
        success: (res) => {
          this.userData = res.data;
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/mySettings/mySettings.vue:49", "请求用户数据失败:", err);
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.userData.id),
    b: common_vendor.t($data.userData.name),
    c: common_vendor.t($data.userData.gender),
    d: common_vendor.t($data.userData.contact_information),
    e: common_vendor.f($data.userData.belong_information, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-951dd1b8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mySettings/mySettings.js.map
