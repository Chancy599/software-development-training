"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      realName: "",
      password: "",
      genderOptions: ["男", "女"],
      genderIndex: 0,
      contact: "",
      photoUrl: ""
    };
  },
  methods: {
    handleGenderChange(event) {
      this.genderIndex = event.detail.value;
    },
    takePhoto() {
      const { username } = this;
      if (!username) {
        common_vendor.index.showToast({ title: "请先输入账号", icon: "none" });
        return;
      }
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (chooseRes) => {
          const tempFilePath = chooseRes.tempFilePaths[0];
          const fileName = `FaceRecognition/${username}.jpg`;
          common_vendor.wx$1.cloud.uploadFile({
            cloudPath: fileName,
            filePath: tempFilePath,
            success: (res) => {
              common_vendor.index.__f__("log", "at pages/register/register.vue:77", "上传成功:", res.fileID);
              this.photoUrl = res.fileID;
              common_vendor.index.showToast({ title: "照片上传成功", icon: "success" });
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/register/register.vue:82", "上传失败:", err);
              common_vendor.index.showToast({ title: "上传失败，请重试", icon: "none" });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/register/register.vue:88", "拍照失败:", err);
          common_vendor.index.showToast({ title: "拍照失败，请重试", icon: "none" });
        }
      });
    },
    handleRegister() {
      const { username, realName, password, genderIndex, contact, photoUrl } = this;
      if (!username || !realName || !password || !contact) {
        common_vendor.index.showToast({ title: "请填写完整信息", icon: "none" });
        return;
      }
      if (!photoUrl) {
        common_vendor.index.showToast({ title: "请拍照上传人脸", icon: "none" });
        return;
      }
      const gender = genderIndex === 0 ? "MALE" : "FEMALE";
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
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
          common_vendor.index.__f__("log", "at pages/register/register.vue:128", "后端返回数据:", res);
          if (res.data === true) {
            common_vendor.index.showToast({ title: "注册成功", icon: "success" });
            common_vendor.index.navigateTo({ url: "/pages/login/login" });
          } else {
            common_vendor.index.showToast({ title: "账号已存在", icon: "none", duration: 1e3 });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/register/register.vue:137", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    },
    handleLogin() {
      common_vendor.index.navigateTo({ url: "/pages/login/login" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.username,
    b: common_vendor.o(($event) => $data.username = $event.detail.value),
    c: $data.password,
    d: common_vendor.o(($event) => $data.password = $event.detail.value),
    e: $data.realName,
    f: common_vendor.o(($event) => $data.realName = $event.detail.value),
    g: common_vendor.t($data.genderOptions[$data.genderIndex]),
    h: common_vendor.o((...args) => $options.handleGenderChange && $options.handleGenderChange(...args)),
    i: $data.genderIndex,
    j: $data.genderOptions,
    k: $data.contact,
    l: common_vendor.o(($event) => $data.contact = $event.detail.value),
    m: !$data.photoUrl
  }, !$data.photoUrl ? {
    n: common_assets._imports_0$1,
    o: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args))
  } : {}, {
    p: $data.photoUrl
  }, $data.photoUrl ? {
    q: $data.photoUrl
  } : {}, {
    r: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
