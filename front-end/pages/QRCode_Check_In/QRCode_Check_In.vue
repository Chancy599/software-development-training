<template>
  <view class="container">
    <button @click="scanQRCode">扫码签到</button>
    <button @click="generateQRCode">生成签到二维码</button>

    <view v-if="attendanceData">
      <text>课程: {{ attendanceData.class_name }}</text>
      <text>签到码: {{ attendanceData.code }}</text>
      <text>生成时间: {{ attendanceData.timestamp }}</text>
      <text>过期时间: {{ attendanceData.expiry }}</text>
    </view>

    <image v-if="qrcodeImage" :src="qrcodeImage" mode="widthFix" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      attendanceData: null,
      qrcodeImage: ""
    };
  },
  methods: {
    // 扫描签到二维码
    scanQRCode() {
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          try {
            this.attendanceData = JSON.parse(res.result);
            wx.showToast({ title: "扫码成功", icon: "success" });
          } catch (error) {
            wx.showToast({ title: "解析失败，请重试", icon: "none" });
          }
        },
        fail: () => {
          wx.showToast({ title: "扫码失败", icon: "none" });
        }
      });
    },

    // 生成签到二维码
    generateQRCode() {
      wx.request({
        url: "https://prod-7glwxii4e6eb93d8.service.tcloudbase.com/generate_qrcode",
        method: "POST",
        header: {
          "Content-Type": "application/json",
          "X-WX-SERVICE": "QRCode"
        },
        data: {
          class_name: "Python编程",
          duration_minutes: 10
        },
        success: (res) => {
          if (res.data.file_path) {
            this.qrcodeImage = "https://prod-7glwxii4e6eb93d8.service.tcloudbase.com/" + res.data.file_path;
            wx.showToast({ title: "二维码已生成", icon: "success" });
          } else {
            wx.showToast({ title: "生成失败", icon: "none" });
          }
        },
        fail: () => {
          wx.showToast({ title: "请求失败", icon: "none" });
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
button {
  margin: 10px;
}
image {
  margin-top: 20px;
  width: 300px;
}
</style>
