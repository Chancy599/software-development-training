"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      selectedName: "",
      classid: ""
    };
  },
  methods: {
    onPickerChange(e) {
      const index = e.detail.value;
      this.selectedName = this.$globalData.manageInfo_name[index];
      this.classid = this.$globalData.manage_information[index];
    },
    navigateTo(page) {
      if (!this.classid) {
        common_vendor.index.showToast({
          title: "请先选择班级",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/${page}/${page}?classid=${encodeURIComponent(this.classid)}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.selectedName || "请选择"),
    b: this.$globalData.manageInfo_name,
    c: common_vendor.o((...args) => $options.onPickerChange && $options.onPickerChange(...args)),
    d: common_vendor.o(($event) => $options.navigateTo("addMember")),
    e: common_vendor.o(($event) => $options.navigateTo("checkMember")),
    f: common_vendor.o(($event) => $options.navigateTo("deleteMember")),
    g: common_vendor.o(($event) => $options.navigateTo("leaveApproval")),
    h: common_vendor.o(($event) => $options.navigateTo("OrgDelete"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/OrgManage/OrgManage.js.map
