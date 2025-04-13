"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classid: "",
      startTime: "",
      in_TIME: 0,
      late: 0,
      absent: 0,
      request_LEAVE: 0,
      records: [],
      queried: false,
      stateMap: {
        IN_TIME: "刷脸签到",
        LATE: "迟到",
        ABSENT: "缺席",
        CREQUEST_LEAVE: "请假"
      }
    };
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || "");
    this.startTime = decodeURIComponent(options.startTime || "");
    this.EnterClassToSelectRecord();
  },
  methods: {
    EnterClassToSelectRecord() {
      common_vendor.index.showLoading({ title: "加载中..." });
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/EnterClassToSelectRecord/${encodeURIComponent(this.classid)}/${encodeURIComponent(this.startTime)}`,
        header: {
          "X-WX-SERVICE": "query",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("log", "at pages/Organization_Records_Plus/Organization_Records_Plus.vue:67", "后端返回数据:", res);
          if (res.data) {
            this.in_TIME = res.data.in_TIME || 0;
            this.late = res.data.late || 0;
            this.absent = res.data.absent || 0;
            this.request_LEAVE = res.data.request_LEAVE || 0;
            this.records = res.data.records || [];
          } else {
            this.records = [];
          }
          this.queried = true;
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/Organization_Records_Plus/Organization_Records_Plus.vue:82", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.queried
  }, $data.queried ? {
    b: common_vendor.t($data.in_TIME),
    c: common_vendor.t($data.late),
    d: common_vendor.t($data.absent),
    e: common_vendor.t($data.request_LEAVE)
  } : {}, {
    f: $data.records.length > 0
  }, $data.records.length > 0 ? {
    g: common_vendor.f($data.records, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.userId),
        c: common_vendor.t($data.stateMap[item.state] || item.state),
        d: common_vendor.t(item.startTime),
        e: common_vendor.t(item.validDuration),
        f: common_vendor.t(item.actualTime || "未签到"),
        g: index
      };
    })
  } : $data.queried ? {} : {}, {
    h: $data.queried
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5688b43e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Organization_Records_Plus/Organization_Records_Plus.js.map
