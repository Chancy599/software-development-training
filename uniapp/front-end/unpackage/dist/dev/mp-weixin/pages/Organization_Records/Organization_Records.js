"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      selectedName: "",
      classid: "",
      total: 0,
      recordList: [],
      queried: false,
      // 控制是否已经查询过
      methodMap: {
        FACE_SCAN: "刷脸签到",
        GPS: "定位签到",
        QRCODE: "二维码签到",
        CIPHER: "暗号签到"
      }
    };
  },
  methods: {
    onPickerChange(e) {
      const index = e.detail.value;
      this.selectedName = this.$globalData.manageInfo_name[index];
      this.classid = this.$globalData.manage_information[index];
    },
    EnterClassToSelectRecord() {
      if (!this.classid) {
        common_vendor.index.showToast({ title: "请先选择班级", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "加载中..." });
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/EnterClassToSelectRecord/${encodeURIComponent(this.classid)}`,
        header: {
          "X-WX-SERVICE": "query",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("log", "at pages/Organization_Records/Organization_Records.vue:73", "后端返回数据:", res);
          if (res.data) {
            this.total = res.data.total || 0;
            this.recordList = res.data.records || [];
          } else {
            this.total = 0;
            this.recordList = [];
            common_vendor.index.showToast({ title: "该班级不存在签到信息", icon: "none" });
          }
          this.queried = true;
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/Organization_Records/Organization_Records.vue:86", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    },
    goToDetail(startTime) {
      common_vendor.index.navigateTo({
        url: `/pages/Organization_Records_Plus/Organization_Records_Plus?classid=${encodeURIComponent(this.classid)}&startTime=${encodeURIComponent(startTime)}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.selectedName || "请选择"),
    b: this.$globalData.manageInfo_name,
    c: common_vendor.o((...args) => $options.onPickerChange && $options.onPickerChange(...args)),
    d: common_vendor.o((...args) => $options.EnterClassToSelectRecord && $options.EnterClassToSelectRecord(...args)),
    e: $data.recordList.length > 0
  }, $data.recordList.length > 0 ? {
    f: common_vendor.t($data.total),
    g: common_vendor.f($data.recordList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.startTime),
        b: common_vendor.t($data.methodMap[item.method] || item.method),
        c: common_vendor.t(item.in_TIME),
        d: common_vendor.t(item.late),
        e: common_vendor.t(item.absent),
        f: common_vendor.t(item.request_LEAVE),
        g: common_vendor.o(($event) => $options.goToDetail(item.startTime), index),
        h: index
      };
    })
  } : $data.queried ? {} : {}, {
    h: $data.queried
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-544370a6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Organization_Records/Organization_Records.js.map
