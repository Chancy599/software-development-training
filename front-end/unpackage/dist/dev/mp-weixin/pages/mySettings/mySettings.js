"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userData: {
        id: "",
        name: "",
        gender: "",
        contact_information: "",
        belong_information: []
      }
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      const username = common_vendor.index.getStorageSync("globalUsername");
      if (!username) {
        common_vendor.index.showToast({ title: "未获取到用户信息", icon: "none" });
        return;
      }
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
          common_vendor.index.__f__("log", "at pages/mySettings/mySettings.vue:67", "后端返回数据:", res);
          if (res.data) {
            this.userData = {
              id: res.data.id || "",
              name: res.data.name || "",
              gender: res.data.gender === "MALE" ? "男" : res.data.gender === "FEMALE" ? "女" : "",
              // 转换性别
              contact_information: res.data.contact_information || "",
              belong_information: res.data.belong_information || []
            };
          } else {
            common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
          }
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/mySettings/mySettings.vue:81", "请求失败:", err);
          common_vendor.index.showToast({ title: "网络异常，请稍后重试", icon: "none", duration: 1e3 });
        }
      });
    },
    // 处理跳转到签到记录页面
    handleRecord() {
      common_vendor.index.navigateTo({ url: "/pages/signRecord/signRecord" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.userData.id),
    b: common_vendor.t($data.userData.name),
    c: common_vendor.t($data.userData.gender),
    d: common_vendor.t($data.userData.contact_information),
    e: $data.userData.belong_information && $data.userData.belong_information.length
  }, $data.userData.belong_information && $data.userData.belong_information.length ? {
    f: common_vendor.f($data.userData.belong_information, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index
      };
    })
  } : {}, {
    g: common_vendor.o((...args) => $options.handleRecord && $options.handleRecord(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-951dd1b8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mySettings/mySettings.js.map
