"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "欢迎登录",
      username: "",
      password: "",
      isLoggingIn: false
    };
  },
  methods: {
    simpleEncrypt(password) {
      let reversed = password.split("").reverse().join("");
      let shifted = "";
      for (let i = 0; i < reversed.length; i++) {
        shifted += String.fromCharCode(reversed.charCodeAt(i) + 3);
      }
      return this.base64Encode(shifted);
    },
    base64Encode(str) {
      const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      let result = "";
      let i = 0;
      while (i < str.length) {
        const c1 = str.charCodeAt(i++) & 255;
        if (i === str.length) {
          result += base64Chars.charAt(c1 >> 2);
          result += base64Chars.charAt((c1 & 3) << 4);
          result += "==";
          break;
        }
        const c2 = str.charCodeAt(i++);
        if (i === str.length) {
          result += base64Chars.charAt(c1 >> 2);
          result += base64Chars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
          result += base64Chars.charAt((c2 & 15) << 2);
          result += "=";
          break;
        }
        const c3 = str.charCodeAt(i++);
        result += base64Chars.charAt(c1 >> 2);
        result += base64Chars.charAt((c1 & 3) << 4 | (c2 & 240) >> 4);
        result += base64Chars.charAt((c2 & 15) << 2 | (c3 & 192) >> 6);
        result += base64Chars.charAt(c3 & 63);
      }
      return result;
    },
    handleLogin() {
      if (this.isLoggingIn)
        return;
      const { username, password } = this;
      if (!username || !password) {
        common_vendor.index.showToast({
          title: "请输入账号和密码",
          icon: "none",
          position: "top"
        });
        return;
      }
      this.isLoggingIn = true;
      const encryptedPassword = this.simpleEncrypt(password);
      common_vendor.index.__f__("log", "at pages/login/login.vue:116", "发送给后端的密码:", encryptedPassword);
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/login`,
        header: {
          "X-WX-SERVICE": "userinfo",
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          id: username,
          password: encryptedPassword
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/login/login.vue:133", "后端返回数据:", res);
          if (res.data === true) {
            common_vendor.index.showToast({
              title: "登录成功",
              icon: "success",
              duration: 1e3,
              mask: true
            });
            this.$globalData.username = username;
            this.fetchUserInfo();
            setTimeout(() => {
              common_vendor.index.navigateTo({
                url: "/pages/main/main",
                animationType: "slide-in-right",
                animationDuration: 300
              });
            }, 1e3);
          } else {
            common_vendor.index.showToast({
              title: "账号或密码错误",
              icon: "none",
              duration: 1500,
              position: "top"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/login.vue:162", "请求失败:", err);
          common_vendor.index.showToast({
            title: "网络异常，请稍后重试",
            icon: "none",
            duration: 1500,
            position: "top"
          });
        },
        complete: () => {
          this.isLoggingIn = false;
        }
      });
    },
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
          common_vendor.index.__f__("log", "at pages/login/login.vue:190", "后端返回数据:", res);
          if (res.data) {
            this.$globalData.name = res.data.name || "";
            this.$globalData.gender = res.data.gender || "";
            this.$globalData.contact_information = res.data.contact_information || "";
            this.$globalData.belong_information = res.data.belong_information || [];
            this.$globalData.manage_information = res.data.manage_information || [];
            this.$globalData.belongInfo_name = res.data.belongInfo_name || [];
            this.$globalData.manageInfo_name = res.data.manageInfo_name || [];
          } else {
            common_vendor.index.showToast({
              title: "获取用户信息失败",
              icon: "none",
              position: "top"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/login/login.vue:208", "请求失败:", err);
          common_vendor.index.showToast({
            title: "网络异常，请稍后重试",
            icon: "none",
            duration: 1500,
            position: "top"
          });
        }
      });
    },
    handleRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/register",
        animationType: "slide-in-right",
        animationDuration: 300
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.title),
    b: common_assets._imports_0,
    c: $data.username,
    d: common_vendor.o(($event) => $data.username = $event.detail.value),
    e: $data.password,
    f: common_vendor.o(($event) => $data.password = $event.detail.value),
    g: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    h: common_vendor.t($data.isLoggingIn ? "登录中..." : "登录"),
    i: $data.isLoggingIn
  }, $data.isLoggingIn ? {} : {}, {
    j: $data.isLoggingIn,
    k: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    l: !$data.isLoggingIn ? 1 : ""
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
