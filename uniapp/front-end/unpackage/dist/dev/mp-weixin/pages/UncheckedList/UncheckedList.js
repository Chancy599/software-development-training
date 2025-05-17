"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      uncheckedList: [],
      stateMap: {
        GPS: "定位签到",
        CIPHER: "暗号签到",
        QRCODE: "二维码签到",
        FACE_SCAN: "刷脸签到"
      }
    };
  },
  onShow() {
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
          common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:56", "后端返回数据:", res);
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.uncheckedList = res.data;
          } else {
            this.uncheckedList = [];
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:64", "请求失败:", err);
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
        this.onFaceScanSignIn(item.classId, item.startTime);
      } else {
        common_vendor.index.showToast({ title: "暂不支持该签到方式", icon: "none" });
      }
    },
    onCipherClick(classId, startTime) {
      common_vendor.index.showModal({
        title: "暗号签到",
        editable: true,
        placeholderText: "请输入签到暗号",
        success: (res) => {
          if (res.confirm && res.content) {
            this.startCipherSignIn(classId, startTime, res.content);
          }
        }
      });
    },
    startCipherSignIn(classId, startTime, cipher) {
      common_vendor.wx$1.cloud.callContainer({
        config: { env: "prod-7glwxii4e6eb93d8" },
        path: `/api/checkins/verify`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        data: {
          userId: this.$globalData.username,
          classId,
          startTime,
          method: "CIPHER",
          params: {
            cipher
          }
        },
        method: "POST",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:125", "暗号签到返回:", res);
          if (res.data.success === true) {
            this.commit(classId, startTime);
          }
          this.Check_In();
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:132", "签到失败:", err);
        }
      });
    },
    onQRCodeSignIn(classId, startTime) {
      common_vendor.index.scanCode({
        scanType: ["qrCode"],
        // 只扫二维码
        success: (res) => {
          try {
            const qrData = JSON.parse(res.result);
            if (qrData.class_id === classId && qrData.start_time === startTime) {
              common_vendor.index.showToast({ title: "扫码成功", icon: "success" });
              this.commit(classId, startTime);
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:149", "二维码不是有效JSON:", error);
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:153", "扫码失败:", err);
        }
      });
    },
    onFaceScanSignIn(classId, startTime) {
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
              common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:170", "上传成功:", res.fileID);
              this.photoUrl = res.fileID;
              this.startFaceRecognition(classId, startTime);
            },
            fail: (err) => {
              common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:175", "上传失败:", err);
            }
          });
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:180", "拍照失败:", err);
        }
      });
    },
    startFaceRecognition(classId, startTime) {
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
          common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:196", "后端返回数据:", res);
          if (res.data) {
            this.commit(classId, startTime);
          } else {
            common_vendor.index.showToast({ title: "验证失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:204", "请求失败:", err);
        }
      });
    },
    commit(classId, startTime) {
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/api/checkins/commit`,
        header: {
          "X-WX-SERVICE": "clockin",
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          userId: this.$globalData.username,
          classId,
          startTime
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:225", "后端返回数据:", res);
          if (res.data && res.data.state) {
            if (res.data.state === "IN_TIME") {
              common_vendor.index.showModal({
                title: "签到成功",
                content: "您已准时签到！",
                showCancel: false
              });
            } else if (res.data.state === "LATE") {
              common_vendor.index.showModal({
                title: "签到提示",
                content: "您已迟到，请下次注意时间！",
                showCancel: false
              });
            }
          }
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1e3);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:246", "请求失败:", err);
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
        c: common_vendor.t($data.stateMap[item.method]),
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
