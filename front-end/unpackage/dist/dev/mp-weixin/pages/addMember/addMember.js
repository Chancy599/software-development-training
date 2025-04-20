"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      classid: "",
      studentIdsInput: "",
      showResult: false,
      result: {
        successAddedCount: 0,
        conflictCount: 0,
        unFoundCount: 0,
        conflictIds: [],
        unFoundIds: []
      }
    };
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || "");
  },
  methods: {
    addMember() {
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
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
          // 云托管环境ID
        },
        path: `/classMember/add/${encodeURIComponent(this.classid)}`,
        header: {
          "X-WX-SERVICE": "query",
          "content-type": "application/json"
        },
        method: "POST",
        data: {
          studentIds
        },
        success: async (res) => {
          common_vendor.index.__f__("log", "at pages/addMember/addMember.vue:82", "后端返回数据:", res);
          this.result = {
            successAddedCount: res.data.successAddedCount || 0,
            conflictCount: res.data.conflictCount || 0,
            unFoundCount: res.data.unFoundCount || 0,
            conflictIds: res.data.conflictIds || [],
            unFoundIds: res.data.unFoundIds || []
          };
          this.showResult = true;
          const successIds = studentIds.filter(
            (id) => !this.result.conflictIds.includes(id) && !this.result.unFoundIds.includes(id)
          );
          try {
            const updatePromises = successIds.map((id) => this.updateBelong(id));
            await Promise.all(updatePromises);
            common_vendor.index.__f__("log", "at pages/addMember/addMember.vue:104", "所有学生归属更新完成");
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/addMember/addMember.vue:106", "部分学生归属更新失败:", error);
          }
          common_vendor.index.hideLoading();
          if (this.result.successAddedCount > 0) {
            common_vendor.index.showToast({
              title: `成功添加${this.result.successAddedCount}人`,
              icon: "success",
              duration: 1500
            });
          } else {
            common_vendor.index.showToast({
              title: "没有新学生被添加",
              icon: "none",
              duration: 2e3
            });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/addMember/addMember.vue:127", "请求失败:", err);
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "添加失败: " + (err.errMsg || "网络异常"),
            icon: "none",
            duration: 2e3
          });
        }
      });
    },
    async updateBelong(id) {
      return new Promise((resolve, reject) => {
        common_vendor.wx$1.cloud.callContainer({
          config: {
            env: "prod-7glwxii4e6eb93d8"
          },
          path: `/updateBelong?id=${encodeURIComponent(id)}&newBelong=${encodeURIComponent(this.classid)}`,
          header: {
            "X-WX-SERVICE": "userinfo",
            "content-type": "application/json"
          },
          method: "PUT",
          success: (res) => {
            common_vendor.index.__f__("log", "at pages/addMember/addMember.vue:150", `学生 ${id} 归属更新成功:`, res);
            resolve(res);
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/addMember/addMember.vue:154", `学生 ${id} 归属更新失败:`, err);
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
    c: common_vendor.o((...args) => $options.addMember && $options.addMember(...args)),
    d: $data.showResult
  }, $data.showResult ? common_vendor.e({
    e: common_vendor.t($data.result.successAddedCount),
    f: $data.result.conflictCount > 0
  }, $data.result.conflictCount > 0 ? {
    g: common_vendor.t($data.result.conflictCount),
    h: common_vendor.t($data.result.conflictIds.join(", "))
  } : {}, {
    i: $data.result.unFoundCount > 0
  }, $data.result.unFoundCount > 0 ? {
    j: common_vendor.t($data.result.unFoundCount),
    k: common_vendor.t($data.result.unFoundIds.join(", "))
  } : {}) : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/addMember/addMember.js.map
