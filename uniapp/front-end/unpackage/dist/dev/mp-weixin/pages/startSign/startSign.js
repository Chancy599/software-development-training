"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      selectedName: "",
      classid: "",
      duration: "",
      cipher: "",
      start_time: "",
      file_id: "",
      qrImageUrl: "",
      showQRCodeModalView: false
    };
  },
  methods: {
    onPickerChange(e) {
      const index = e.detail.value;
      this.selectedName = this.$globalData.manageInfo_name[index];
      this.classid = this.$globalData.manage_information[index];
    },
    validateSelection() {
      if (!this.selectedName || !this.duration) {
        common_vendor.index.showToast({
          title: "请先选择班级并设置时长",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    onLocationClick() {
      if (!this.validateSelection())
        return;
      common_vendor.index.navigateTo({
        url: `/pages/Location_Launch/Location_Launch?classid=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}`
      });
    },
    onCipherClick() {
      if (!this.validateSelection())
        return;
      common_vendor.index.showModal({
        title: "暗号签到",
        editable: true,
        placeholderText: "请输入签到暗号",
        success: (res) => {
          if (res.confirm && res.content) {
            this.cipher = res.content;
            this.startCipherSignIn();
          }
        }
      });
    },
    startCipherSignIn() {
      common_vendor.index.showToast({ title: "暗号签到已发起", icon: "success" });
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}&method=CIPHER&cipher=${encodeURIComponent(this.cipher)}`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        success: (res) => common_vendor.index.__f__("log", "at pages/startSign/startSign.vue:121", "后端返回数据:", res),
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/startSign/startSign.vue:123", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    },
    onFaceClick() {
      if (!this.validateSelection())
        return;
      common_vendor.index.showModal({
        title: "刷脸签到",
        content: "是否确认发起刷脸签到？",
        success: (res) => {
          if (res.confirm)
            this.startFaceSignIn();
          else
            common_vendor.index.showToast({ title: "已取消操作", icon: "none" });
        }
      });
    },
    startFaceSignIn() {
      common_vendor.index.showToast({ title: "刷脸签到已发起", icon: "success" });
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}&method=FACE_SCAN`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        success: (res) => common_vendor.index.__f__("log", "at pages/startSign/startSign.vue:149", "后端返回数据:", res),
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/startSign/startSign.vue:151", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    },
    onQRcodeClick() {
      if (!this.validateSelection())
        return;
      common_vendor.index.showModal({
        title: "二维码签到",
        content: "是否确认发起二维码签到？",
        success: (res) => {
          if (res.confirm)
            this.startQRCodeSignIn();
          else
            common_vendor.index.showToast({ title: "已取消操作", icon: "none" });
        }
      });
    },
    startQRCodeSignIn() {
      common_vendor.index.showToast({ title: "二维码签到已发起", icon: "success" });
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}&method=QRCODE`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/startSign/startSign.vue:178", "后端返回数据:", res);
          this.start_time = res.start_timestamp;
          this.generate_qrcode();
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/startSign/startSign.vue:183", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    },
    generate_qrcode() {
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/generate_qrcode`,
        header: {
          "X-WX-SERVICE": "qrcode",
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          class_id: this.classid,
          start_time: this.start_time
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/startSign/startSign.vue:202", "后端返回数据:", res);
          this.file_id = res.data.file_id;
          common_vendor.wx$1.cloud.getTempFileURL({
            fileList: [this.file_id],
            success: (res2) => {
              common_vendor.index.__f__("log", "at pages/startSign/startSign.vue:209", "获取临时地址:", res2);
              this.qrImageUrl = res2.fileList[0].tempFileURL;
              this.showQRCodeModalView = true;
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/startSign/startSign.vue:214", "获取临时地址失败:", err);
              common_vendor.index.showToast({ title: "图片加载失败", icon: "none" });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/startSign/startSign.vue:220", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    },
    saveImage() {
      common_vendor.wx$1.cloud.downloadFile({
        fileID: this.file_id,
        success: (res) => {
          common_vendor.wx$1.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              common_vendor.index.showToast({ title: "保存成功", icon: "success" });
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/startSign/startSign.vue:235", "保存失败:", err);
              common_vendor.index.showToast({ title: "保存失败，请检查权限", icon: "none" });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/startSign/startSign.vue:241", "下载失败:", err);
          common_vendor.index.showToast({ title: "下载失败", icon: "none" });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.selectedName || "请点击选择班级"),
    b: this.$globalData.manageInfo_name,
    c: common_vendor.o((...args) => $options.onPickerChange && $options.onPickerChange(...args)),
    d: common_vendor.o([($event) => $data.duration = $event.detail.value, (...args) => _ctx.validateDuration && _ctx.validateDuration(...args)]),
    e: $data.duration,
    f: common_assets._imports_0$2,
    g: common_vendor.o((...args) => $options.onLocationClick && $options.onLocationClick(...args)),
    h: common_assets._imports_1$1,
    i: common_vendor.o((...args) => $options.onCipherClick && $options.onCipherClick(...args)),
    j: common_assets._imports_2$1,
    k: common_vendor.o((...args) => $options.onQRcodeClick && $options.onQRcodeClick(...args)),
    l: common_assets._imports_3$1,
    m: common_vendor.o((...args) => $options.onFaceClick && $options.onFaceClick(...args)),
    n: $data.showQRCodeModalView
  }, $data.showQRCodeModalView ? {
    o: $data.qrImageUrl,
    p: common_vendor.o((...args) => $options.saveImage && $options.saveImage(...args)),
    q: common_vendor.o(($event) => $data.showQRCodeModalView = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/startSign/startSign.js.map
