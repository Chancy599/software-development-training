"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classid: "",
      userId: "",
      name: "",
      in_TIME: 0,
      late: 0,
      absent: 0,
      request_LEAVE: 0,
      checkins: [],
      queried: false,
      stateMap: {
        IN_TIME: "准时",
        LATE: "迟到",
        ABSENT: "缺席",
        REQUEST_LEAVE: "请假"
      }
    };
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || "");
    this.userId = decodeURIComponent(options.userId || "");
    this.EnterClassToSelectRecord();
  },
  methods: {
    EnterClassToSelectRecord() {
      common_vendor.index.showLoading({ title: "加载中..." });
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/EnterClassToSelectUser/${encodeURIComponent(this.classid)}/${encodeURIComponent(this.userId)}`,
        header: {
          "X-WX-SERVICE": "query",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("log", "at pages/Member_Records_Plus/Member_Records_Plus.vue:71", "后端返回数据:", res);
          if (res.data) {
            this.name = res.data.name || "";
            this.userId = res.data.userId || "";
            this.in_TIME = res.data.in_TIME || 0;
            this.late = res.data.late || 0;
            this.absent = res.data.absent || 0;
            this.request_LEAVE = res.data.request_LEAVE || 0;
            this.checkins = res.data.checkins || [];
          } else {
            this.checkins = [];
          }
          this.queried = true;
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/Member_Records_Plus/Member_Records_Plus.vue:88", "请求失败:", err);
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
    b: common_vendor.t($data.name),
    c: common_vendor.t($data.userId)
  } : {}, {
    d: $data.queried
  }, $data.queried ? {
    e: common_vendor.t($data.in_TIME),
    f: common_vendor.t($data.late),
    g: common_vendor.t($data.absent),
    h: common_vendor.t($data.request_LEAVE)
  } : {}, {
    i: $data.checkins.length > 0
  }, $data.checkins.length > 0 ? {
    j: common_vendor.f($data.checkins, (item, index, i0) => {
      return {
        a: common_vendor.t(item.startTime),
        b: common_vendor.t(item.valid_duration),
        c: common_vendor.t(item.actualTime || "未签到"),
        d: common_vendor.t($data.stateMap[item.state] || item.state),
        e: index
      };
    })
  } : $data.queried ? {} : {}, {
    k: $data.queried
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cc49c3cb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Member_Records_Plus/Member_Records_Plus.js.map
