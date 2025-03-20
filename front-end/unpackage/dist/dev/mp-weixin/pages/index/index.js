"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "登录页面",
      loginMode: "admin",
      // 默认登录模式为管理员
      username: "",
      // 账号
      password: ""
      // 密码
    };
  },
  onLoad() {
  },
  methods: {
    // 处理登录模式切换
    handleModeChange(e) {
      this.loginMode = e.detail.value;
    },
    // 处理登录按钮点击
    handleLogin() {
      const { loginMode, username, password } = this;
      console.log(`登录模式: ${loginMode}, 账号: ${username}, 密码: ${password}`);
      common_vendor.index.showToast({
        title: "登录成功（模拟）",
        icon: "none"
      });
    },
    // 处理注册链接点击
    handleRegister() {
      console.log("跳转到注册页面");
      common_vendor.index.showToast({
        title: "跳转到注册页面（模拟）",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.title),
    b: common_assets._imports_0,
    c: $data.loginMode === "admin",
    d: $data.loginMode === "employee",
    e: common_vendor.o((...args) => $options.handleModeChange && $options.handleModeChange(...args)),
    f: $data.username,
    g: common_vendor.o(($event) => $data.username = $event.detail.value),
    h: $data.password,
    i: common_vendor.o(($event) => $data.password = $event.detail.value),
    j: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    k: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
