"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      class_id: "",
      reasons: [],
      loading: false
    };
  },
  onLoad(options) {
    this.class_id = decodeURIComponent(options.classid || "");
    this.loadData();
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true;
      try {
        const res = await common_vendor.wx$1.cloud.callContainer({
          config: { env: "prod-7glwxii4e6eb93d8" },
          path: `/GetReason?class_id=${encodeURIComponent(this.class_id)}`,
          header: {
            "X-WX-SERVICE": "reason",
            "content-type": "application/json"
          },
          method: "GET"
        });
        this.reasons = res.data || [];
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/leaveApproval/leaveApproval.vue:94", "加载失败:", err);
        common_vendor.index.showToast({
          title: "加载失败: " + (err.errMsg || "网络错误"),
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    async previewCloudImage(cloudPath) {
      common_vendor.index.showLoading({ title: "加载中...", mask: true });
      try {
        const res = await common_vendor.wx$1.cloud.getTempFileURL({
          fileList: [cloudPath]
        });
        common_vendor.wx$1.previewImage({
          current: res.fileList[0].tempFileURL,
          urls: [res.fileList[0].tempFileURL]
        });
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/leaveApproval/leaveApproval.vue:118", "预览失败:", err);
        common_vendor.index.showToast({
          title: "文件加载失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    },
    // 审批操作
    async approve(item) {
      common_vendor.index.showLoading({ title: "处理中...", mask: true });
      common_vendor.index.__f__("log", "at pages/leaveApproval/leaveApproval.vue:131", "审批请求体:", {
        sender_id: item.sender_id,
        class_id: this.class_id,
        start_time: item.start_time
      });
      try {
        await this.DeleteReason(item.reason_id);
        const res = await common_vendor.wx$1.cloud.callContainer({
          config: {
            env: "prod-7glwxii4e6eb93d8"
          },
          path: `/UpdateState`,
          header: {
            "X-WX-SERVICE": "reason",
            "content-type": "application/json"
          },
          method: "PUT",
          data: {
            sender_id: item.sender_id,
            class_id: this.class_id,
            start_time: item.start_time
          }
        });
        common_vendor.index.__f__("log", "at pages/leaveApproval/leaveApproval.vue:155", "后端返回数据:", res);
        if (res.data === true) {
          common_vendor.index.showToast({ title: "审批成功", icon: "success", duration: 1e3 });
          this.loadData();
        } else {
          common_vendor.index.showToast({ title: "审批失败", icon: "none", duration: 1e3 });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/leaveApproval/leaveApproval.vue:164", "请求失败:", err);
        common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
      }
    },
    async reject(item) {
      common_vendor.index.showLoading({ title: "处理中...", mask: true });
      try {
        await this.DeleteReason(item.reason_id);
        common_vendor.index.showToast({ title: "已拒绝", icon: "success" });
        this.loadData();
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/leaveApproval/leaveApproval.vue:176", "拒绝失败:", err);
        common_vendor.index.showToast({ title: "操作失败", icon: "none" });
      }
    },
    async DeleteReason(reasonId) {
      try {
        const res = await common_vendor.wx$1.cloud.callContainer({
          config: { env: "prod-7glwxii4e6eb93d8" },
          path: `/DeleteReason?reason_id=${encodeURIComponent(reasonId)}`,
          header: {
            "X-WX-SERVICE": "reason",
            "content-type": "application/json"
          },
          method: "DELETE"
        });
        return res.data === true;
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/leaveApproval/leaveApproval.vue:195", "请求失败:", err);
        throw err;
      }
    }
  }
};
if (!Array) {
  const _component_uni_load_more = common_vendor.resolveComponent("uni-load-more");
  _component_uni_load_more();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {
    b: common_vendor.p({
      status: "loading"
    })
  } : $data.reasons.length === 0 ? {
    d: common_assets._imports_0$5
  } : {
    e: common_vendor.f($data.reasons, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.sender_name),
        b: common_vendor.t(item.sender_id),
        c: common_vendor.t(item.start_time),
        d: common_vendor.t(item.word || "无说明"),
        e: item.photo_path
      }, item.photo_path ? {
        f: item.photo_path,
        g: common_vendor.o(($event) => $options.previewCloudImage(item.photo_path), item.reason_id)
      } : {}, {
        h: common_vendor.o(($event) => $options.approve(item), item.reason_id),
        i: common_vendor.o(($event) => $options.reject(item), item.reason_id),
        j: item.reason_id
      });
    })
  }, {
    c: $data.reasons.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/leaveApproval/leaveApproval.js.map
