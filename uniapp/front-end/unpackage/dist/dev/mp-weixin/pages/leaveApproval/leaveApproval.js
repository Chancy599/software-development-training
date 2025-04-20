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
    approve(reasonId) {
      common_vendor.index.showLoading({ title: "处理中...", mask: true });
      this.DeleteReason(reasonId);
    },
    reject(reasonId) {
      common_vendor.index.showLoading({ title: "处理中...", mask: true });
      this.DeleteReason(reasonId);
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
        common_vendor.index.__f__("log", "at pages/leaveApproval/leaveApproval.vue:151", "后端返回数据:", res);
        common_vendor.index.hideLoading();
        if (res.data === true) {
          common_vendor.index.showToast({
            icon: "success"
          });
          this.loadData();
        } else {
          common_vendor.index.showToast({ title: "操作失败", icon: "none" });
        }
      } catch (err) {
        common_vendor.index.__f__("error", "at pages/leaveApproval/leaveApproval.vue:164", "请求失败:", err);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none" });
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
    d: common_assets._imports_0$3
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
        h: common_vendor.o(($event) => $options.approve(item.reason_id), item.reason_id),
        i: common_vendor.o(($event) => $options.reject(item.reason_id), item.reason_id),
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
