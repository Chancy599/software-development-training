"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classid: "",
      studentIdsInput: "",
      showResult: false,
      result: {
        successDeletedCount: 0,
        unFoundCount: 0,
        deletedIds: []
      }
    };
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || "");
  },
  methods: {
    deleteMembers() {
      const studentIds = this.studentIdsInput.trim().split(/\s+/).filter((id) => id);
      if (studentIds.length === 0) {
        common_vendor.index.showToast({
          title: "请输入至少一个学生ID",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      common_vendor.index.showLoading({ title: "提交中...", mask: true });
      this.showResult = false;
      common_vendor.index.showModal({
        title: "确认删除",
        content: `确定要删除这 ${studentIds.length} 个学生吗？`,
        success: (confirm) => {
          if (confirm.confirm) {
            this.executeDelete(studentIds);
          } else {
            common_vendor.index.hideLoading();
          }
        }
      });
    },
    executeDelete(id) {
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/classMember/delete/${encodeURIComponent(this.classid)}`,
        header: {
          "X-WX-SERVICE": "query",
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          studentIds: id
        },
        success: (res) => {
          common_vendor.index.__f__("log", "at pages/deleteMember/deleteMember.vue:92", "删除结果:", res);
          common_vendor.index.hideLoading();
          this.result = {
            successDeletedCount: res.data.successDeletedCount || 0,
            unFoundCount: res.data.unFoundCount || 0,
            deletedIds: res.data.deletedIds || []
          };
          this.showResult = true;
          if (this.result.successDeletedCount > 0) {
            common_vendor.index.showToast({
              title: `成功删除${this.result.successDeletedCount}人`,
              icon: "success"
            });
          } else {
            common_vendor.index.showToast({
              title: "没有学生被删除",
              icon: "none"
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/deleteMember/deleteMember.vue:115", "删除失败:", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "删除失败: " + (err.errMsg || "网络异常"),
            icon: "none"
          });
        }
      });
    },
    async deleteBelong(id) {
      return new Promise((resolve, reject) => {
        common_vendor.wx$1.cloud.callContainer({
          config: {
            env: "prod-7glwxii4e6eb93d8"
          },
          path: `/deleteBelong?id=${encodeURIComponent(id)}&targetBelong=${encodeURIComponent(this.classid)}`,
          header: {
            "X-WX-SERVICE": "userinfo",
            "content-type": "application/json"
          },
          method: "DELETE",
          success: (res) => {
            common_vendor.index.__f__("log", "at pages/deleteMember/deleteMember.vue:137", `学生 ${id} 归属删除成功:`, res);
            resolve(res);
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/deleteMember/deleteMember.vue:141", `学生 ${id} 归属删除失败:`, err);
            reject(err);
          }
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.studentIdsInput,
    b: common_vendor.o(($event) => $data.studentIdsInput = $event.detail.value),
    c: common_vendor.o((...args) => $options.deleteMembers && $options.deleteMembers(...args)),
    d: $data.showResult
  }, $data.showResult ? common_vendor.e({
    e: common_vendor.t($data.result.successDeletedCount),
    f: $data.result.deletedIds.length > 0
  }, $data.result.deletedIds.length > 0 ? {
    g: common_vendor.t($data.result.deletedIds.join(", "))
  } : {}, {
    h: $data.result.unFoundCount > 0
  }, $data.result.unFoundCount > 0 ? {
    i: common_vendor.t($data.result.unFoundCount)
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/deleteMember/deleteMember.js.map
