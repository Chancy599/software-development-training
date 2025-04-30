"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      uncheckedList: []
    };
  },
  onLoad() {
    this.Check_In();
  },
  methods: {
    Check_In() {
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/EnterClassToSelectUser/GetUncheckedList?userId=${encodeURIComponent(this.$globalData.username)}`,
        header: {
          "X-WX-SERVICE": "query",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:50", "后端返回数据:", res);
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.uncheckedList = res.data;
          } else {
            this.uncheckedList = [];
            common_vendor.index.showToast({ title: "暂无未签到课程", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:59", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    },
    onLeave(item) {
      common_vendor.index.navigateTo({
        url: `/pages/leaveApplication/leaveApplication?classId=${encodeURIComponent(item.classId)}&startTime=${encodeURIComponent(item.startTime)}`
      });
    },
    onSignIn(item) {
      if (item.method === "CIPHER") {
        this.onCipherClick(item.classId, item.startTime);
      } else if (item.method === "GPS") {
        common_vendor.index.navigateTo({
          url: `/pages/Location_Check_In/Location_Check_In?classId=${encodeURIComponent(item.classId)}&startTime=${encodeURIComponent(item.startTime)}`
        });
      } else if (item.method === "QRCODE") {
        this.onQRCodeSignIn(item.classId, item.startTime);
      } else if (item.method === "FACE_SCAN") {
        this.onFaceScanSignIn(item.classId);
      } else {
        common_vendor.index.showToast({ title: "暂不支持该签到方式", icon: "none" });
      }
    },
    onCipherClick(classId, startTime2) {
      common_vendor.index.showModal({
        title: "暗号签到",
        editable: true,
        placeholderText: "请输入签到暗号",
        success: (res) => {
          if (res.confirm && res.content) {
            this.startCipherSignIn(classId, startTime2, res.content);
          }
        }
      });
    },
    startCipherSignIn(classId, startTime2, cipher) {
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/api/checkins/verify?userId=${encodeURIComponent(this.$globalData.username)}&classId=${encodeURIComponent(classId)}&startTime=${encodeURIComponent(startTime2)}&method=CIPHER&cipher=${encodeURIComponent(cipher)}`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:111", "暗号签到返回:", res);
          if (res.data === true) {
            common_vendor.index.showToast({ title: "签到成功", icon: "success" });
            this.commit(classId, startTime2);
          }
          this.Check_In();
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:119", "签到失败:", err);
          common_vendor.index.showToast({ title: "签到失败，请稍后重试", icon: "none" });
        }
      });
    },
    onQRCodeSignIn(classId, startTime2) {
      common_vendor.index.scanCode({
        scanType: ["qrCode"],
        // 只扫二维码
        success: (res) => {
          try {
            const qrData = JSON.parse(res.result);
            common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:130", "二维码内容（JSON对象）:", qrData);
            if (qrData.class_id === classId && qrData.start_time === startTime2) {
              common_vendor.index.showToast({ title: "扫码成功", icon: "success" });
              this.commit(classId, startTime2);
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:138", "二维码不是有效JSON:", error);
            common_vendor.index.showToast({ title: "二维码格式错误", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:143", "扫码失败:", err);
          common_vendor.index.showToast({ title: "扫码失败", icon: "none" });
        }
      });
    },
    onFaceScanSignIn(classId) {
      common_vendor.index.chooseImage({
        count: 1,
        sourceType: ["camera"],
        // 使用相机拍照
        success: (chooseRes) => {
          const tempFilePath = chooseRes.tempFilePaths[0];
          const fileName = `FaceRecognition/temp.jpg`;
          common_vendor.wx$1.cloud.uploadFile({
            cloudPath: fileName,
            // 存储路径
            filePath: tempFilePath,
            // 本地路径
            success: (res) => {
              common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:161", "上传成功:", res.fileID);
              this.photoUrl = res.fileID;
              common_vendor.index.showToast({ title: "照片上传成功", icon: "success" });
              this.startFaceRecognition(classId);
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:167", "上传失败:", err);
              common_vendor.index.showToast({ title: "上传失败，请重试", icon: "none" });
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:173", "拍照失败:", err);
          common_vendor.index.showToast({ title: "拍照失败，请重试", icon: "none" });
        }
      });
    },
    startFaceRecognition(classId) {
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/FaceCompare?userId=${encodeURIComponent(this.$globalData.username)}&classId=${encodeURIComponent(classId)}`,
        header: {
          "X-WX-SERVICE": "facerecognition",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:190", "后端返回数据:", res);
          if (res.data) {
            common_vendor.index.showToast({ title: "验证成功", icon: "suthis.ccess", duration: 1e3 });
            this.commit(classId, startTime);
          } else {
            common_vendor.index.showToast({ title: "验证失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:199", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    },
    commit(classId, startTime2) {
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `//api/checkins/commit?userId=${encodeURIComponent(this.$globalData.username)}&classId=${encodeURIComponent(classId)}&startTime=${encodeURIComponent(startTime2)}`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:216", "后端返回数据:", res);
          if (res.data && res.data.state) {
            if (res.data.state === "IN_TIME") {
              common_vendor.index.showToast({ title: "准时", icon: "success", duration: 1e3 });
            } else if (res.data.state === "LATE") {
              common_vendor.index.showToast({ title: "迟到", icon: "none", duration: 1e3 });
            }
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:226", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.uncheckedList.length
  }, $data.uncheckedList.length ? {
    b: common_vendor.f($data.uncheckedList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.className),
        b: common_vendor.t(item.startTime),
        c: common_vendor.t(item.method),
        d: common_vendor.o(($event) => $options.onSignIn(item), index),
        e: common_vendor.o(($event) => $options.onLeave(item), index),
        f: index
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/UncheckedList/UncheckedList.js.map
