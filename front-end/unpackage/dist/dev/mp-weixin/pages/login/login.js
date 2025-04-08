"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "欢迎登录",
      username: "",
      password: ""
    };
  },
  methods: {
    handleLogin() {
      const { username, password } = this;
      if (!username || !password) {
        common_vendor.index.showToast({
          title: "请输入账号和密码",
          icon: "none"
        });
        return;
      }
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
          // 云托管环境ID
        },
        path: `/login`,
        header: {
          "X-WX-SERVICE": "userinfo",
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          id: username,
          password
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:63", "后端返回数据:", res);
          if (res.data === true) {
            common_vendor.index.showToast({ title: "登录成功", icon: "success", duration: 1e3 });
            this.$globalData.username = username;
            common_vendor.index.navigateTo({ url: "/pages/main/main" });
          } else {
            common_vendor.index.showToast({ title: "账号或密码错误", icon: "none", duration: 1e3 });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/login.vue:78", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    },
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
