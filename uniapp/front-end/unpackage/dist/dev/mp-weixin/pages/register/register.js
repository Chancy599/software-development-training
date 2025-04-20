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
      contact: "",
      // 联系方式
      photoUrl: ""
      // 存储上传照片的URL
    };
  },
  methods: {
    // 处理性别选择
    handleGenderChange(event) {
      this.genderIndex = event.detail.value;
    },
    // 处理拍照上传
    takePhoto() {
      const { username } = this;
      if (!username) {
        common_vendor.index.showToast({ title: "请先输入账号", icon: "none" });
        return;
      }
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        // 使用相机拍照
        success: (chooseRes) => {
          const tempFilePath = chooseRes.tempFilePaths[0];
          const fileName = `FaceRecognition/${username}.jpg`;
          common_vendor.wx$1.cloud.uploadFile({
            cloudPath: fileName,
            // 存储路径
            filePath: tempFilePath,
            // 本地路径
            success: (res) => {
              common_vendor.index.__f__("log", "at pages/register/register.vue:81", "上传成功:", res.fileID);
              this.photoUrl = res.fileID;
              common_vendor.index.showToast({ title: "照片上传成功", icon: "success" });
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/register/register.vue:86", "上传失败:", err);
              common_vendor.index.showToast({ title: "上传失败，请重试", icon: "none" });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/register/register.vue:92", "拍照失败:", err);
          common_vendor.index.showToast({ title: "拍照失败，请重试", icon: "none" });
        }
      });
    },
    // 处理注册按钮点击
    handleRegister() {
      const { username, realName, password, genderIndex, contact } = this;
      if (!username || !realName || !password || !contact) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      const gender = genderIndex === 0 ? "MALE" : "FEMALE";
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
          // 你的云托管环境ID
        },
        path: `/register`,
        header: {
          "X-WX-SERVICE": "userinfo",
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          id: username,
          name: realName,
          password,
          gender,
          contact_information: contact
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/register/register.vue:131", "后端返回数据:", res);
          if (res.data === true) {
            common_vendor.index.showToast({ title: "注册成功", icon: "success" });
            common_vendor.index.navigateTo({ url: "/pages/login/login" });
          } else {
            common_vendor.index.showToast({ title: "账号已存在", icon: "none", duration: 1e3 });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/register/register.vue:141", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
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
  return common_vendor.e({
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
    o: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args)),
    p: $data.photoUrl
  }, $data.photoUrl ? {
    q: $data.photoUrl
  } : {}, {
    r: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    s: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
