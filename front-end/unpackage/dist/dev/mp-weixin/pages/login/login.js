"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "欢迎登录",
      username: "",
      // 账号
      password: ""
      // 密码
    };
  },
  onLoad() {
  },
  methods: {
    // 处理登录按钮点击
    handleLogin() {
      const { username, password } = this;
      if (!username || !password) {
        common_vendor.index.showToast({
          title: "请输入账号和密码",
          icon: "none"
        });
        return;
      }
      const envId = "prod-7glwxii4e6eb93d8";
      const apiUrl = `https://${envId}.service.tcloudbase.com/login`;
      common_vendor.index.request({
        url: apiUrl,
        method: "POST",
        header: {
          "content-type": "application/json"
        },
        data: {
          username,
          password
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:69", "后端返回数据:", res);
          if (res.data.success) {
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success"
            });
            common_vendor.index.navigateTo({ url: "/pages/main/main" });
          } else {
            common_vendor.index.showToast({
              title: "账号或密码错误，请重试",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/login.vue:86", "请求失败:", err);
          common_vendor.index.showToast({
            title: "请求失败，请检查网络",
            icon: "none"
          });
        }
      });
    },
    // 处理跳转到注册页面
    handleRegister() {
      common_vendor.index.navigateTo({ url: "/pages/register/register" });
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
    h: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
