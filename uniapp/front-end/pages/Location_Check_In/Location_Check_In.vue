<template>
  <view>
    <map
      :latitude="latitude"
      :longitude="longitude"
      :markers="[{ latitude, longitude }]"
      style="width: 100%; height: 500px;"
    ></map>
    <view><text>纬度: {{ latitude }}</text></view>
	<view><text>经度: {{ longitude }}</text></view>
    <button @tap="checkIn">签到</button>
  </view>
</template>

<script>
const envId = 'prod-7glwxii4e6eb93d8'; // 微信云托管环境 ID

export default {
  data() {
    return {
      latitude: 0,
      longitude: 0
    };
  },
  mounted() {
    this.getLocation();
  },
  methods: {
    getLocation() {
      wx.getLocation({
        type: 'gcj02', // 适用于微信地图
        isHighAccuracy: true, // 高精度模式
        success: (res) => {
          this.latitude = res.latitude;
          this.longitude = res.longitude;
        },
        fail: (err) => {
          console.error('获取位置失败:', err);
        }
      });
    },
    checkIn() {
      if (this.latitude && this.longitude) {
        wx.cloud.callFunction({
          name: 'checkIn',
          env: envId, // 设置云托管环境ID
          data: {
            latitude: this.latitude,
            longitude: this.longitude
          },
          success: res => {
            wx.showToast({ title: '签到成功', icon: 'success' });
          },
          fail: err => {
            wx.showToast({ title: '签到失败', icon: 'none' });
            console.error('签到失败:', err);
          }
        });
      } else {
        wx.showToast({ title: '未获取到位置', icon: 'none' });
      }
    }
  }
};
</script>

<style>
button {
  margin-top: 20px;
}
</style>
