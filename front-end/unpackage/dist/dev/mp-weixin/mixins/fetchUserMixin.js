"use strict";
const common_vendor = require("../common/vendor.js");
const fetchUserMixin = {
  methods: {
    fetchUserInfo() {
      const username = this.$globalData.username;
      common_vendor.wx$1.cloud.callContainer({
        config: {
          env: "prod-7glwxii4e6eb93d8"
        },
        path: `/getInfo?id=${encodeURIComponent(username)}`,
        header: {
          "X-WX-SERVICE": "userinfo",
          "content-type": "application/json"
        },
        method: "GET",
        success: (res) => {
          if (res.data) {
            this.$globalData.name = res.data.name || "";
            this.$globalData.gender = res.data.gender || "";
            this.$globalData.contact_information = res.data.contact_information || "";
            this.$globalData.belong_information = res.data.belong_information || [];
            this.$globalData.manage_information = res.data.manage_information || [];
            this.$globalData.belong_name = res.data.belong_name || [];
            this.$globalData.manage_name = res.data.manage_name || [];
          } else {
            common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at mixins/fetchUserMixin.js:29", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    }
  },
  onPullDownRefresh() {
    this.fetchUserInfo();
    setTimeout(() => {
      common_vendor.index.stopPullDownRefresh();
    }, 500);
  }
};
exports.fetchUserMixin = fetchUserMixin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/mixins/fetchUserMixin.js.map
