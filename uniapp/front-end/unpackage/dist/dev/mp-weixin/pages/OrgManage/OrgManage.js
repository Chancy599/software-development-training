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
          duration: 1500
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/${page}/${page}?classid=${encodeURIComponent(this.classid)}`
      });
    },
    handleDeleteOrg() {
      if (!this.classid) {
        common_vendor.index.showToast({
          title: "请先选择要删除的班级",
          icon: "none",
          duration: 1500
        });
        return;
      }
      common_vendor.index.showModal({
        title: "警告",
        content: `确定要删除班级【${this.selectedName}】吗？此操作将删除所有成员和签到记录，且不可恢复！`,
        confirmText: "确认删除",
        confirmColor: "#FF3B30",
        cancelText: "取消",
        success: (res) => {
          if (res.confirm) {
            this.deleteOrganization();
          }
        }
      });
    },
    async deleteOrganization() {
      common_vendor.index.showLoading({
        title: "正在删除...",
        mask: true
      });
      try {
        const res = await common_vendor.wx$1.cloud.callContainer({
          config: {
            env: "prod-7glwxii4e6eb93d8"
          },
          path: `/classMember/deleteAll/${encodeURIComponent(this.classid)}`,
          header: {
            "X-WX-SERVICE": "query",
            "content-type": "application/json"
          },
          method: "GET"
        });
        if (res && res.data) {
          const result = res.data;
          await this.deleteManageBelong();
          if (result.deletedClassMemberIds && result.deletedClassMemberIds.length > 0) {
            await this.deleteMembersBelong(result.deletedClassMemberIds);
          }
          common_vendor.index.hideLoading();
          common_vendor.index.showModal({
            title: "删除成功",
            content: `已删除班级 ${result.deletedClassId}
删除成员: ${result.membersDeleted}人
删除签到记录: ${result.checkinRecordsDeleted}条`,
            showCancel: false,
            success: () => {
              const index = this.$globalData.manage_information.indexOf(this.classid);
              if (index !== -1) {
                this.$globalData.manage_information.splice(index, 1);
                this.$globalData.manageInfo_name.splice(index, 1);
              }
              this.selectedName = "";
              this.classid = "";
            }
          });
        } else {
          throw new Error("返回数据格式不正确");
        }
      } catch (err) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/OrgManage/OrgManage.vue:139", "删除失败:", err);
        common_vendor.index.showModal({
          title: "删除失败",
          content: err.message || "网络异常，请稍后重试",
          showCancel: false
        });
      }
    },
    async deleteMembersBelong(memberIds) {
      try {
        const deletePromises = memberIds.map(
          (id) => this.deleteBelong(id).catch((e) => {
            common_vendor.index.__f__("error", "at pages/OrgManage/OrgManage.vue:151", `删除成员 ${id} 归属记录失败:`, e);
            return null;
          })
        );
        await Promise.all(deletePromises);
        common_vendor.index.__f__("log", "at pages/OrgManage/OrgManage.vue:156", "所有成员归属记录删除完成");
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/OrgManage/OrgManage.vue:158", "删除成员归属记录时出错:", err);
        throw err;
      }
    },
    async deleteManageBelong() {
      try {
        await common_vendor.wx$1.cloud.callContainer({
          config: {
            env: "prod-7glwxii4e6eb93d8"
          },
          path: `/deleteManageBelong?id=${encodeURIComponent(this.$globalData.username)}&targetBelong=${encodeURIComponent(this.classid)}`,
          header: {
            "X-WX-SERVICE": "userinfo",
            "content-type": "application/json"
          },
          method: "DELETE"
        });
        common_vendor.index.__f__("log", "at pages/OrgManage/OrgManage.vue:175", "管理员归属删除成功");
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/OrgManage/OrgManage.vue:177", "管理员归属删除失败:", err);
        throw err;
      }
    },
    async deleteBelong(id) {
      try {
        await common_vendor.wx$1.cloud.callContainer({
          config: {
            env: "prod-7glwxii4e6eb93d8"
          },
          path: `/deleteBelong?id=${encodeURIComponent(id)}&targetBelong=${encodeURIComponent(this.classid)}`,
          header: {
            "X-WX-SERVICE": "userinfo",
            "content-type": "application/json"
          },
          method: "DELETE"
        });
        common_vendor.index.__f__("log", "at pages/OrgManage/OrgManage.vue:194", `学生 ${id} 归属删除成功`);
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/OrgManage/OrgManage.vue:196", `学生 ${id} 归属删除失败:`, err);
        throw err;
      }
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.selectedName || "请点击选择班级"),
    b: common_vendor.p({
      type: "right",
      size: "20",
      color: "#007AFF"
    }),
    c: this.$globalData.manageInfo_name,
    d: common_vendor.o((...args) => $options.onPickerChange && $options.onPickerChange(...args)),
    e: common_vendor.o(($event) => $options.navigateTo("addMember")),
    f: common_vendor.o(($event) => $options.navigateTo("checkMember")),
    g: common_vendor.o((...args) => $options.handleDeleteOrg && $options.handleDeleteOrg(...args)),
    h: common_vendor.o(($event) => $options.navigateTo("leaveApproval"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/OrgManage/OrgManage.js.map
