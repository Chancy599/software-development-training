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
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/EnterClassToSelectUser/GetUncheckedList?userId=${encodeURIComponent(this.$globalData.username)}`,
        header: {
          "X-WX-SERVICE": "query",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/UncheckedList/UncheckedList.vue:52", "后端返回数据:", res);
          if (Array.isArray(res.data) && res.data.length > 0) {
            this.uncheckedList = res.data;
          } else {
            this.uncheckedList = [];
            common_vendor.index.showToast({ title: "暂无未签到课程", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/UncheckedList/UncheckedList.vue:61", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    },
    onLeave(item) {
      common_vendor.index.navigateTo({
        url: `/pages/leaveApplication/leaveApplication?classId=${item.classId}&startTime=${encodeURIComponent(item.startTime)}`
      });
    },
    onSignIn(item) {
      const method = item.method;
      const methodToPage = {
        GPS: "/pages/Location_Check_In/Location_Check_In",
        CIPHER: "/pages/Cipher_Check_In/Cipher_Check_In",
        FACE_SCAN: "/pages/Face_Check_In/Face_Check_In",
        QRCODE: "/pages/QRCode_Check_In/QRCode_Check_In"
      };
      const targetPage = methodToPage[method];
      if (targetPage) {
        common_vendor.index.navigateTo({
          url: `${targetPage}?classId=${item.classId}&startTime=${encodeURIComponent(item.startTime)}`
        });
      } else {
        common_vendor.index.showToast({
          title: "未知的签到方式",
          icon: "none"
        });
      }
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
