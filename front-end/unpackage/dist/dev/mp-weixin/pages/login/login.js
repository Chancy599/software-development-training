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
          common_vendor.index.__f__("log", "at pages/login/login.vue:64", "后端返回数据:", res);
          if (res.data === true) {
            common_vendor.index.showToast({ title: "登录成功", icon: "success", duration: 1e3 });
            this.$globalData.username = username;
            this.fetchUserInfo();
            common_vendor.index.navigateTo({ url: "/pages/main/main" });
          } else {
            common_vendor.index.showToast({ title: "账号或密码错误", icon: "none", duration: 1e3 });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/login.vue:82", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    },
    // 获取用户信息
    fetchUserInfo() {
      const username = this.$globalData.username;
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/getInfo?id=${encodeURIComponent(username)}`,
        header: {
          "X-WX-SERVICE": "userinfo",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:103", "后端返回数据:", res);
          if (res.data) {
            this.$globalData.name = res.data.name || "";
            this.$globalData.gender = res.data.gender || "";
            this.$globalData.contact_information = res.data.contact_information || "";
            this.$globalData.belong_information = res.data.belong_information || [];
            this.$globalData.manage_information = res.data.manage_information || [];
            this.$globalData.belongInfo_name = res.data.belongInfo_name || [];
            this.$globalData.manageInfo_name = res.data.manageInfo_name || [];
          } else {
            common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/login.vue:118", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    },
    // 测试登录
    TestLogin() {
      this.$globalData.username = "0";
      this.$globalData.name = "测试";
      this.$globalData.gender = "MALE";
      this.$globalData.contact_information = "test@example.com";
      this.$globalData.belong_information = ["TEST_1, TEST_2"];
      this.$globalData.manage_information = ["TEST_3, TEST_4"];
      this.$globalData.belongInfo_name = ["测试1组", "测试2组"];
      this.$globalData.manageInfo_name = ["测试3组", "测试4组"];
      common_vendor.index.navigateTo({ url: "/pages/main/main" });
    },
    // 注册链接
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
    h: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    i: common_vendor.o((...args) => $options.TestLogin && $options.TestLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
