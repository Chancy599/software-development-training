"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "欢迎注册",
      username: "",
      // 账号
      realName: "",
      // 姓名
      password: "",
      // 密码
      genderOptions: ["男", "女"],
      genderIndex: 0,
      // 默认为男
      contact: ""
      // 联系方式
    };
  },
  methods: {
    // 处理性别选择
    handleGenderChange(event) {
      this.genderIndex = event.detail.value;
    },
    // 处理注册按钮点击
    handleregister() {
      const { username, realName, password, genderIndex, contact } = this;
      if (!username || !realName || !password || !contact) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      const gender = genderIndex === 0 ? "MALE" : "FEMALE";
      const envId = "prod-7glwxii4e6eb93d8";
      const apiUrl = `https://${envId}.service.tcloudbase.com/register`;
      common_vendor.index.request({
        url: apiUrl,
        method: "POST",
        header: { "content-type": "application/json" },
        data: { username, realName, password, gender, contact },
        success: (res) => {
          if (res.data.success) {
            common_vendor.index.showToast({
              title: "注册成功",
              icon: "success"
            });
            common_vendor.index.navigateTo({ url: "/pages/login/login" });
          } else {
            common_vendor.index.showToast({
              title: "注册失败，账号已存在",
              icon: "none"
            });
          }
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "请求失败，请检查网络",
            icon: "none"
          });
        }
      });
    },
    // 处理跳转到登录页面
    handleLogin() {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
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
    g: $data.realName,
    h: common_vendor.o(($event) => $data.realName = $event.detail.value),
    i: common_vendor.t($data.genderOptions[$data.genderIndex]),
    j: common_vendor.o((...args) => $options.handleGenderChange && $options.handleGenderChange(...args)),
    k: $data.genderIndex,
    l: $data.genderOptions,
    m: $data.contact,
    n: common_vendor.o(($event) => $data.contact = $event.detail.value),
    o: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    p: common_vendor.o((...args) => $options.handleregister && $options.handleregister(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
