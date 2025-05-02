"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      class_id: "",
      start_time: "",
      word: "",
      photo_path: ""
    };
  },
  onLoad(options) {
    this.class_id = decodeURIComponent(options.classId || "");
    this.start_time = decodeURIComponent(options.startTime || "");
  },
  methods: {
    AddReason() {
      if (!this.word) {
        return common_vendor.index.showToast({ title: "请填写请假原因", icon: "none" });
      }
      if (!this.photo_path) {
        return common_vendor.index.showToast({ title: "请上传证明材料", icon: "none" });
      }
      const requestData = {
        sender_id: this.$globalData.username,
        class_id: this.class_id,
        start_time: this.start_time,
        word: this.word,
        photo_path: this.photo_path
      };
      common_vendor.index.__f__("log", "at pages/leaveApplication/leaveApplication.vue:75", "将要发送给后端的数据:", requestData);
      common_vendor.index.showLoading({ title: "提交中...", mask: true });
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/AddReason`,
        header: {
          "X-WX-SERVICE": "reason",
          "content-type": "application/json"
        },
        method: "PUT",
        data: requestData,
        // 使用上面定义的数据对象
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/leaveApplication/leaveApplication.vue:89", "后端返回数据:", res);
          common_vendor.index.hideLoading();
          if (res.data === true) {
            common_vendor.index.showToast({ title: "申请成功", icon: "success" });
            setTimeout(() => {
              common_vendor.index.navigateTo({ url: "/pages/UncheckedList/UncheckedList" });
            }, 1500);
          } else {
            common_vendor.index.showToast({ title: "申请失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/leaveApplication/leaveApplication.vue:102", "请求失败:", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    },
    takePhoto() {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        success: (chooseRes) => {
          const tempFilePath = chooseRes.tempFilePaths[0];
          const fileName = `LeaveList/${this.start_time}/${this.$globalData.username}.jpg`;
          common_vendor.index.showLoading({ title: "上传中...", mask: true });
          common_vendor.wx$1.cloud.uploadFile({
            cloudPath: fileName,
            filePath: tempFilePath,
            success: (res) => {
              common_vendor.index.__f__("log", "at pages/leaveApplication/leaveApplication.vue:123", "上传成功:", res.fileID);
              this.photo_path = res.fileID;
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "上传成功", icon: "success" });
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/leaveApplication/leaveApplication.vue:129", "上传失败:", err);
              common_vendor.index.hideLoading();
              common_vendor.index.showToast({ title: "上传失败，请重试", icon: "none" });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/leaveApplication/leaveApplication.vue:136", "拍照失败:", err);
          common_vendor.index.showToast({ title: "拍照失败，请重试", icon: "none" });
        }
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.word,
    b: common_vendor.o(($event) => $data.word = $event.detail.value),
    c: $data.photo_path
  }, $data.photo_path ? {
    d: $data.photo_path
  } : {}, {
    e: common_vendor.p({
      type: "camera",
      size: "16"
    }),
    f: common_vendor.t($data.photo_path ? "重新上传" : "拍照上传"),
    g: common_vendor.o((...args) => $options.takePhoto && $options.takePhoto(...args)),
    h: common_vendor.o((...args) => $options.AddReason && $options.AddReason(...args)),
    i: !$data.word || !$data.photo_path
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/leaveApplication/leaveApplication.js.map
