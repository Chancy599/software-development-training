"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classid: "",
      members: [],
      loading: false,
      buttonScale: null
    };
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || "");
    this.fetchMembers();
  },
  methods: {
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
        common_vendor.index.__f__("error", "at pages/checkMember/checkMember.vue:81", "查询失败:", err);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    goToDetail(userid) {
      common_vendor.index.navigateTo({
        url: `/pages/checkMember_Plus/checkMember_Plus?classid=${encodeURIComponent(this.classid)}&userid=${encodeURIComponent(userid)}`
      });
    },
    async deleteMember(id) {
      const confirmRes = await new Promise((resolve) => {
        common_vendor.index.showModal({
          title: "确认删除",
          content: "确定要删除该学生吗？",
          success: resolve
        });
      });
      if (!confirmRes.confirm) {
        return;
      }
      common_vendor.index.showLoading({ title: "删除中..." });
      try {
        await common_vendor.wx$1.cloud.callContainer({
          config: { env: "prod-7glwxii4e6eb93d8" },
          path: `/classMember/delete/${encodeURIComponent(this.classid)}`,
          header: {
            "X-WX-SERVICE": "query",
            "content-type": "application/json"
          },
          method: "DELETE",
          data: {
            studentIds: [id]
          }
        });
        await common_vendor.wx$1.cloud.callContainer({
          config: { env: "prod-7glwxii4e6eb93d8" },
          path: `/deleteBelong?id=${encodeURIComponent(id)}&targetBelong=${encodeURIComponent(this.classid)}`,
          header: {
            "X-WX-SERVICE": "userinfo",
            "content-type": "application/json"
          },
          method: "DELETE"
        });
        common_vendor.index.showToast({
          title: "成功删除该学生",
          icon: "success"
        });
        await this.fetchMembers();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/checkMember/checkMember.vue:145", "删除失败:", err);
        common_vendor.index.showToast({
          title: "删除失败: " + (err.errMsg || "网络异常"),
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    handleButtonTouchStart(id) {
      this.buttonScale = id;
    },
    handleButtonTouchEnd() {
      this.buttonScale = null;
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
        d: "scale(" + ($data.buttonScale === member.id ? "0.95" : "1") + ")",
        e: common_vendor.o(($event) => $options.handleButtonTouchStart(member.id), index),
        f: common_vendor.o(($event) => $options.handleButtonTouchEnd(member.id), index),
        g: common_vendor.o(($event) => $options.deleteMember(member.id), index),
        h: "scale(" + ($data.buttonScale === member.id ? "0.95" : "1") + ")",
        i: common_vendor.o(($event) => $options.handleButtonTouchStart(member.id), index),
        j: common_vendor.o(($event) => $options.handleButtonTouchEnd(member.id), index),
        k: index
      };
    })
  }, {
    b: $data.members.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/checkMember/checkMember.js.map
