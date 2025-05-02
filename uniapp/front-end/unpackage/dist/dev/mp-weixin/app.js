"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
  "./pages/main/main.js";
  "./pages/startSign/startSign.js";
  "./pages/mySettings/mySettings.js";
  "./pages/Location_Check_In/Location_Check_In.js";
  "./pages/Organization_Records/Organization_Records.js";
  "./pages/Member_Records/Member_Records.js";
  "./pages/My_Records/My_Records.js";
  "./pages/Check_Record/Check_Record.js";
  "./pages/Location_Launch/Location_Launch.js";
  "./pages/UncheckedList/UncheckedList.js";
  "./pages/OrgCreate/OrgCreate.js";
  "./pages/OrgManage/OrgManage.js";
  "./pages/Organization_Records_Plus/Organization_Records_Plus.js";
  "./pages/Member_Records_Plus/Member_Records_Plus.js";
  "./pages/addMember/addMember.js";
  "./pages/checkMember/checkMember.js";
  "./pages/leaveApplication/leaveApplication.js";
  "./pages/leaveApproval/leaveApproval.js";
  "./pages/checkMember_Plus/checkMember_Plus.js";
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
    common_vendor.index.__f__("log", "at App.vue:11", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:14", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$globalData = common_vendor.reactive({
    name: "",
    username: "",
    gender: "",
    contact_information: "",
    belong_information: [],
    manage_information: [],
    belongInfo_name: [],
    manageInfo_name: []
  });
  return { app };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
