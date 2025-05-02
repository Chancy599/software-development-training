"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      className: "",
      classId: "",
      studentInput: ""
    };
  },
  methods: {
    // 将空格分隔的字符串转为数组
    parseStudentInput(input) {
      if (!input)
        return [];
      input = input.replace(/\s+/g, " ");
      return input.split(" ").map((item) => item.trim()).filter((item) => item.length > 0);
    },
    async NewClass() {
      if (!this.className) {
        common_vendor.index.showToast({ title: "请输入班级名称", icon: "none" });
        return;
      }
      const students = this.parseStudentInput(this.studentInput);
      if (students.length === 0) {
        common_vendor.index.showToast({ title: "请输入至少一个学生学号", icon: "none" });
        return;
      }
      common_vendor.index.showLoading({ title: "正在创建...", mask: true });
      try {
        const classRes = await this.createClass(students);
        this.classId = classRes.data.id;
        await this.updateManageBelong();
        const updatePromises = students.map((studentId) => this.updateBelong(studentId));
        await Promise.all(updatePromises);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: `成功创建班级 ${this.className}`,
          icon: "success",
          duration: 2e3
        });
        this.$globalData.manager_information.push(this.classId);
        this.$globalData.manageInfo_name.push(this.className);
        this.className = "";
        this.classId = "";
        this.studentInput = "";
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/OrgCreate/OrgCreate.vue:89", "创建班级失败:", error);
        common_vendor.index.showToast({
          title: "操作失败：" + (error.errMsg || "服务器错误"),
          icon: "none",
          duration: 2e3
        });
      }
    },
    createClass(students) {
      return new Promise((resolve, reject) => {
        common_vendor.wx$1.cloud.callContainer({
          config: {
            env: "prod-7glwxii4e6eb93d8"
          },
          path: `/api/classes?className=${encodeURIComponent(this.className)}&managerId=${encodeURIComponent(this.$globalData.username)}`,
          header: {
            "X-WX-SERVICE": "clockin",
            "content-type": "application/json"
          },
          method: "POST",
          data: students,
          success: resolve,
          fail: reject
        });
      });
    },
    async updateManageBelong() {
      return new Promise((resolve, reject) => {
        common_vendor.wx$1.cloud.callContainer({
          config: {
            env: "prod-7glwxii4e6eb93d8"
          },
          path: `/updateManageBelong?id=${encodeURIComponent(this.$globalData.username)}&newBelong=${encodeURIComponent(this.classId)}`,
          header: {
            "X-WX-SERVICE": "userinfo",
            "content-type": "application/json"
          },
          method: "PUT",
          success: (res) => {
            common_vendor.index.__f__("log", "at pages/OrgCreate/OrgCreate.vue:130", "管理员归属更新成功:", res);
            resolve(res);
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/OrgCreate/OrgCreate.vue:134", "管理员归属更新失败:", err);
            reject(err);
          }
        });
      });
    },
    async updateBelong(id) {
      return new Promise((resolve, reject) => {
        common_vendor.wx$1.cloud.callContainer({
          config: {
            env: "prod-7glwxii4e6eb93d8"
          },
          path: `/updateBelong?id=${encodeURIComponent(id)}&newBelong=${encodeURIComponent(this.classId)}`,
          header: {
            "X-WX-SERVICE": "userinfo",
            "content-type": "application/json"
          },
          method: "PUT",
          success: (res) => {
            common_vendor.index.__f__("log", "at pages/OrgCreate/OrgCreate.vue:154", `学生 ${id} 归属更新成功:`, res);
            resolve(res);
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/OrgCreate/OrgCreate.vue:158", `学生 ${id} 归属更新失败:`, err);
            reject(err);
          }
        });
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.className,
    b: common_vendor.o(($event) => $data.className = $event.detail.value),
    c: $data.studentInput,
    d: common_vendor.o(($event) => $data.studentInput = $event.detail.value),
    e: common_vendor.o((...args) => $options.NewClass && $options.NewClass(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/OrgCreate/OrgCreate.js.map
