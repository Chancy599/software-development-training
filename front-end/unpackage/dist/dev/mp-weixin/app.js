"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/main/main.js";
  "./pages/startSign/startSign.js";
  "./pages/joinSign/joinSign.js";
  "./pages/signRecord/signRecord.js";
  "./pages/mySettings/mySettings.js";
  "./pages/Location_Check_In/Location_Check_In.js";
  "./pages/Individual_Check_In/Individual_Check_In.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
    common_vendor.wx$1.cloud.init({
      env: "prod-7glwxii4e6eb93d8",
      // 你的云托管环境 ID
      traceUser: true
    });
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:15", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
