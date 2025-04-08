"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      attendanceData: null,
      qrcodeImage: ""
    };
  },
  methods: {
    // 扫描签到二维码
    scanQRCode() {
      common_vendor.wx$1.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          try {
            this.attendanceData = JSON.parse(res.result);
            common_vendor.wx$1.showToast({ title: "扫码成功", icon: "success" });
          } catch (error) {
            common_vendor.wx$1.showToast({ title: "解析失败，请重试", icon: "none" });
          }
        },
        fail: () => {
          common_vendor.wx$1.showToast({ title: "扫码失败", icon: "none" });
        }
      });
    },
    // 生成签到二维码
    generateQRCode() {
      common_vendor.wx$1.request({
        url: "https://prod-7glwxii4e6eb93d8.service.tcloudbase.com/generate_qrcode",
        method: "POST",
        header: {
          "Content-Type": "application/json",
          "X-WX-SERVICE": "QRCode"
        },
        data: {
          class_name: "Python编程",
          duration_minutes: 10
        },
        success: (res) => {
          if (res.data.file_path) {
            this.qrcodeImage = "https://prod-7glwxii4e6eb93d8.service.tcloudbase.com/" + res.data.file_path;
            common_vendor.wx$1.showToast({ title: "二维码已生成", icon: "success" });
          } else {
            common_vendor.wx$1.showToast({ title: "生成失败", icon: "none" });
          }
        },
        fail: () => {
          common_vendor.wx$1.showToast({ title: "请求失败", icon: "none" });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.scanQRCode && $options.scanQRCode(...args)),
    b: common_vendor.o((...args) => $options.generateQRCode && $options.generateQRCode(...args)),
    c: $data.attendanceData
  }, $data.attendanceData ? {
    d: common_vendor.t($data.attendanceData.class_name),
    e: common_vendor.t($data.attendanceData.code),
    f: common_vendor.t($data.attendanceData.timestamp),
    g: common_vendor.t($data.attendanceData.expiry)
  } : {}, {
    h: $data.qrcodeImage
  }, $data.qrcodeImage ? {
    i: $data.qrcodeImage
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-903ea65c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/QRCode_Check_In/QRCode_Check_In.js.map
