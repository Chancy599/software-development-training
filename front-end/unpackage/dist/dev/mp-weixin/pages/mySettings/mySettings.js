"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userData: this.initUserData()
    };
  },
  created() {
    this.syncGlobalData();
  },
  methods: {
    // 初始化用户数据结构
    initUserData() {
      return {
        id: "",
        name: "",
        gender: "",
        contact_information: "",
        belongInfo_name: [],
        manageInfo_name: []
      };
    },
    // 同步全局数据
    syncGlobalData() {
      if (!this.$globalData) {
        common_vendor.index.__f__("warn", "at pages/mySettings/mySettings.vue:61", "全局数据未初始化");
        return;
      }
      this.userData = {
        id: this.$globalData.username || "",
        name: this.$globalData.name || "",
        gender: this.formatGender(this.$globalData.gender),
        contact_information: this.$globalData.contact_information || "",
        belongInfo_name: this.$globalData.belongInfo_name || [],
        manageInfo_name: this.$globalData.manageInfo_name || []
      };
    },
    // 格式化性别显示
    formatGender(gender) {
      const map = { MALE: "男", FEMALE: "女" };
      return map[gender] || "";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c, _d;
  return common_vendor.e({
    a: common_vendor.t($data.userData.id),
    b: common_vendor.t($data.userData.name),
    c: common_vendor.t($data.userData.gender),
    d: common_vendor.t($data.userData.contact_information),
    e: (_a = $data.userData.manageInfo_name) == null ? void 0 : _a.length
  }, ((_b = $data.userData.manageInfo_name) == null ? void 0 : _b.length) ? {
    f: common_vendor.f($data.userData.manageInfo_name, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    })
  } : {}, {
    g: (_c = $data.userData.belongInfo_name) == null ? void 0 : _c.length
  }, ((_d = $data.userData.belongInfo_name) == null ? void 0 : _d.length) ? {
    h: common_vendor.f($data.userData.belongInfo_name, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mySettings/mySettings.js.map
