"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const uniPopup = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.js";
const uniPopupDialog = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.js";
const _sfc_main = {
  components: {
    uniPopup,
    uniPopupDialog
  },
  data() {
    return {
      selectedName: "",
      classid: "",
      duration: ""
    };
  },
  methods: {
    onPickerChange(e) {
      const index = e.detail.value;
      this.selectedName = this.$globalData.manageInfo_name[index];
      this.classid = this.$globalData.manage_information[index];
    },
    validateDuration(e) {
      let value = parseInt(e.detail.value);
      if (isNaN(value)) {
        this.duration = "";
        return;
      }
      if (value < 1) {
        this.duration = 1;
        common_vendor.index.showToast({
          title: "时长不能小于1分钟",
          icon: "none"
        });
      }
    },
    showCipherDialog() {
      if (!this.validateSelection())
        return;
      this.$refs.cipherPopup.open();
    },
    confirmCipher(value) {
      if (!value || value.trim() === "") {
        common_vendor.index.showToast({
          title: "暗号不能为空",
          icon: "none"
        });
        return;
      }
      this.launchSignIn("cipher", value);
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
    launchSignIn(methodType, cipher) {
      const params = {
        classId: this.classid,
        duration: this.duration,
        signMethod: methodType,
        cipher: methodType === "cipher" ? cipher : null
      };
      common_vendor.index.showLoading({ title: "正在发起签到..." });
      common_vendor.index.request({
        url: "你的签到API地址",
        method: "POST",
        data: params,
        success: (res) => {
          common_vendor.index.hideLoading();
          if (res.data.code === 200) {
            common_vendor.index.showToast({ title: "签到发起成功" });
          } else {
            common_vendor.index.showToast({ title: res.data.message || "签到失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "网络错误", icon: "none" });
        }
      });
    }
  }
};
if (!Array) {
  const _component_uni_popup_dialog = common_vendor.resolveComponent("uni-popup-dialog");
  const _component_uni_popup = common_vendor.resolveComponent("uni-popup");
  (_component_uni_popup_dialog + _component_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.selectedName || "请点击选择班级"),
    b: this.$globalData.manageInfo_name,
    c: common_vendor.o((...args) => $options.onPickerChange && $options.onPickerChange(...args)),
    d: common_vendor.o([($event) => $data.duration = $event.detail.value, (...args) => $options.validateDuration && $options.validateDuration(...args)]),
    e: $data.duration,
    f: common_assets._imports_0$2,
    g: common_assets._imports_1$1,
    h: common_vendor.o((...args) => $options.showCipherDialog && $options.showCipherDialog(...args)),
    i: common_assets._imports_2$1,
    j: common_assets._imports_3$1,
    k: common_vendor.o($options.confirmCipher),
    l: common_vendor.p({
      mode: "input",
      title: "输入签到暗号",
      placeholder: "请输入任意暗号"
    }),
    m: common_vendor.sr("cipherPopup", "a602b3c4-0"),
    n: common_vendor.p({
      type: "dialog"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/startSign/startSign.js.map
