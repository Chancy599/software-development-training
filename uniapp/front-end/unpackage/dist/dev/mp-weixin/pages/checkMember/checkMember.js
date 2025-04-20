"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classid: "",
      members: [],
      loading: false
    };
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || "");
    this.fetchMembers();
  },
  methods: {
    // 获取成员列表
    async fetchMembers() {
      this.loading = true;
      try {
        const res = await common_vendor.wx$1.cloud.callContainer({
          config: { env: "prod-7glwxii4e6eb93d8" },
          path: `/classMember/query/${encodeURIComponent(this.classid)}`,
          header: {
            "X-WX-SERVICE": "query",
            "content-type": "application/json"
          },
          method: "GET"
        });
        this.members = res.data || [];
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/checkMember/checkMember.vue:70", "查询失败:", err);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    // 跳转到详情页
    goToDetail(userid) {
      common_vendor.index.navigateTo({
        url: `/pages/checkMember/checkMember?classid=${encodeURIComponent(this.classid)}&userid=${encodeURIComponent(userid)}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {} : $data.members.length === 0 ? {} : {
    c: common_vendor.f($data.members, (member, index, i0) => {
      return {
        a: common_vendor.t(member.id),
        b: common_vendor.t(member.name),
        c: common_vendor.o(($event) => $options.goToDetail(member.id), index),
        d: index
      };
    })
  }, {
    b: $data.members.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/checkMember/checkMember.js.map
