<template>
  <view class="container">
    <!-- 2x2网格布局 -->
    <view class="grid-container">
      <!-- 第一行 -->
      <view class="grid-row">
        <view class="grid-item" @click="navigateTo('pages/Location_Check_In')">
          <image class="grid-icon" src="/static/Method/GPS.png"></image>
          <text class="grid-text">定位签到</text>
        </view>
        <view class="grid-item" @click="navigateTo('pages/Cipher_Check_In/Cipher_Check_In')">
          <image class="grid-icon" src="/static/Method/Cipher.png"></image>
          <text class="grid-text">暗号签到</text>
        </view>
      </view>
      
      <!-- 第二行 -->
      <view class="grid-row">
        <view class="grid-item" @click="navigateTo('pages/QRCode_Check_In/QRCode_Check_In')">
          <image class="grid-icon" src="/static/Method/QRCode.png"></image>
          <text class="grid-text">二维码签到</text>
        </view>
        <view class="grid-item" @click="navigateTo('pages/Face_Check_In/Face_Check_In')">
          <image class="grid-icon" src="/static/Method/Face.png"></image>
          <text class="grid-text">刷脸签到</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  methods: {
    navigateTo(path) {
      uni.navigateTo({
        url: `/${path}`
      });
    }
  }
}
</script>
<style>
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.grid-row {
  display: flex;
  justify-content: space-between;
  gap: 30rpx;
}

.grid-item {
  flex: 1;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.grid-item:active {
  transform: scale(0.98);
}

.grid-icon {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.grid-text {
  font-size: 32rpx;
  color: #333;
  font-weight: 500;
}
</style>