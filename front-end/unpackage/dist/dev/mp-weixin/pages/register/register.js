"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "欢迎注册",
      username: "",
      // 账号
      password: ""
      // 密码
    };
  },
  onLoad() {
  },
  methods: {
    // 处理注册按钮点击
    handleregister() {
      const { username, password } = this;
      common_vendor.index.__f__("log", "at pages/register/register.vue:42", `账号: ${username}, 密码: ${password}`);
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    },
    // 处理注册链接点击
    handleRegister() {
      common_vendor.index.__f__("log", "at pages/register/register.vue:51", "跳转到登录页面");
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
      common_vendor.index.showToast({
        title: "跳转到登录页面（模拟）",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.title),
    b: common_assets._imports_0,
    c: $data.username,
    d: common_vendor.o(($event) => $data.username = $event.detail.value),
    e: $data.password,
    f: common_vendor.o(($event) => $data.password = $event.detail.value),
    g: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    h: common_vendor.o((...args) => $options.handleregister && $options.handleregister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
