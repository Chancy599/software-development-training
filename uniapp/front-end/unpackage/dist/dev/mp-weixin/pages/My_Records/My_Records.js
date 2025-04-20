"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      selectedName: "",
      classid: "",
      recordList: [],
      queried: false,
      in_TIME: 0,
      late: 0,
      absent: 0,
      request_LEAVE: 0,
      stateMap: {
        "ON_TIME": "准时",
        "LATE": "迟到",
        "ABSENT": "未到",
        "LEAVE": "请假"
      }
    };
  },
  methods: {
    onPickerChange(e) {
      const index = e.detail.value;
      this.selectedName = this.$globalData.belongInfo_name[index];
      this.classid = this.$globalData.belong_information[index];
    },
    EnterIdToSelectClass() {
      if (!this.classid) {
        common_vendor.index.showToast({ title: "请先选择班级", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "加载中..." });
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/EnterIdToSelectClass/${encodeURIComponent(this.$globalData.username)}/${encodeURIComponent(this.classid)}`,
        header: {
          "X-WX-SERVICE": "query",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("log", "at pages/My_Records/My_Records.vue:82", "后端返回数据:", res);
          if (res.data) {
            this.recordList = res.data.records || [];
            this.in_TIME = res.data.in_TIME || 0;
            this.late = res.data.late || 0;
            this.absent = res.data.absent || 0;
            this.request_LEAVE = res.data.request_LEAVE || 0;
          } else {
            this.resetData();
            common_vendor.index.showToast({ title: "该班级不存在签到信息", icon: "none" });
          }
          this.queried = true;
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/My_Records/My_Records.vue:98", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    },
    resetData() {
      this.recordList = [];
      this.in_TIME = 0;
      this.late = 0;
      this.absent = 0;
      this.request_LEAVE = 0;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.selectedName || "请选择"),
    b: this.$globalData.belongInfo_name,
    c: common_vendor.o((...args) => $options.onPickerChange && $options.onPickerChange(...args)),
    d: common_vendor.o((...args) => $options.EnterIdToSelectClass && $options.EnterIdToSelectClass(...args)),
    e: $data.queried
  }, $data.queried ? {
    f: common_vendor.t($data.in_TIME),
    g: common_vendor.t($data.late),
    h: common_vendor.t($data.absent),
    i: common_vendor.t($data.request_LEAVE)
  } : {}, {
    j: $data.recordList.length > 0
  }, $data.recordList.length > 0 ? {
    k: common_vendor.f($data.recordList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.startTime),
        b: common_vendor.t(item.validDuration),
        c: common_vendor.t(item.actualTime || "未签到"),
        d: common_vendor.t($data.stateMap[item.state] || item.state),
        e: index
      };
    })
  } : $data.queried ? {} : {}, {
    l: $data.queried
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e89e0f0f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/My_Records/My_Records.js.map
