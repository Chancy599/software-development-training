"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classid: "",
      userid: "",
      memberInfo: null,
      loading: false,
      error: false,
      genderMap: {
        "MALE": "男",
        "FEMALE": "女"
      }
    };
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || "");
    this.userid = decodeURIComponent(options.userid || "");
    this.fetchMemberDetail();
  },
  methods: {
    // 获取成员详情
    async fetchMemberDetail() {
      this.loading = true;
      this.error = false;
      try {
        const res = await common_vendor.wx$1.cloud.callContainer({
          config: { env: "prod-7glwxii4e6eb93d8" },
          path: `/classMember/query/${encodeURIComponent(this.classid)}/${encodeURIComponent(this.userid)}`,
          header: {
            "X-WX-SERVICE": "query",
            "content-type": "application/json"
          },
          method: "GET"
        });
        this.memberInfo = res.data;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/checkMember_Plus/checkMember_Plus.vue:74", "查询详情失败:", err);
        this.error = true;
        common_vendor.index.showToast({
          title: "加载详情失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.memberInfo
  }, $data.memberInfo ? {
    b: common_vendor.t($data.memberInfo.id),
    c: common_vendor.t($data.memberInfo.name),
    d: common_vendor.t($data.genderMap[$data.memberInfo.gender] || $data.memberInfo.gender),
    e: common_vendor.t($data.memberInfo.contactInformation)
  } : {}, {
    f: $data.loading
  }, $data.loading ? {} : {}, {
    g: $data.error
  }, $data.error ? {
    h: common_vendor.o((...args) => $options.fetchMemberDetail && $options.fetchMemberDetail(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/checkMember_Plus/checkMember_Plus.js.map
