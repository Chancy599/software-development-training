"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      selectedName: "",
      classid: "",
      total: 0,
      studentList: [],
      queried: false
    };
  },
  methods: {
    onPickerChange(e) {
      const index = e.detail.value;
      this.selectedName = this.$globalData.manageInfo_name[index];
      this.classid = this.$globalData.manage_information[index];
    },
    EnterClassToSelectUser() {
      if (!this.classid) {
        common_vendor.index.showToast({ title: "请先选择班级", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "加载中..." });
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/EnterClassToSelectUser/${encodeURIComponent(this.classid)}`,
        header: {
          "X-WX-SERVICE": "query",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("log", "at pages/Member_Records/Member_Records.vue:67", "后端返回数据:", res);
          if (res.data) {
            this.total = res.data.total || 0;
            this.studentList = res.data.students || [];
          } else {
            this.total = 0;
            this.studentList = [];
            common_vendor.index.showToast({ title: "该班级无签到数据", icon: "none" });
          }
          this.queried = true;
        },
        fail: (err) => {
          common_vendor.index.hideLoading();
          common_vendor.index.__f__("error", "at pages/Member_Records/Member_Records.vue:80", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
        }
      });
    },
    goToDetail(userId) {
      common_vendor.index.navigateTo({
        url: `/pages/Member_Records_Plus/Member_Records_Plus?classid=${encodeURIComponent(this.classid)}&userId=${encodeURIComponent(userId)}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.selectedName || "请选择"),
    b: this.$globalData.manageInfo_name,
    c: common_vendor.o((...args) => $options.onPickerChange && $options.onPickerChange(...args)),
    d: common_vendor.o((...args) => $options.EnterClassToSelectUser && $options.EnterClassToSelectUser(...args)),
    e: $data.studentList.length > 0
  }, $data.studentList.length > 0 ? {
    f: common_vendor.t($data.total),
    g: common_vendor.f($data.studentList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.userId),
        c: common_vendor.t(item.in_TIME),
        d: common_vendor.t(item.late),
        e: common_vendor.t(item.absent),
        f: common_vendor.t(item.request_LEAVE),
        g: common_vendor.o(($event) => $options.goToDetail(item.userId), index),
        h: index
      };
    })
  } : $data.queried ? {} : {}, {
    h: $data.queried
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-97eb7f9c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Member_Records/Member_Records.js.map
