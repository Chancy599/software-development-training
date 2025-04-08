<template>
  <view class="container">
    <view class="button" @click="goToPage('Organization_Records')">组织签到</view>
    <view class="button" @click="goToPage('Member_Records')">成员签到</view>
    <view class="button" @click="goToPage('My_Records')">我的签到</view>
  </view>
</template>

<script>
export default {
  methods: {
    goToPage(pageName) {
      uni.navigateTo({
        url: `/pages/${pageName}/${pageName}`
      });
    }
  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
.button {
  width: 200rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  margin: 20rpx 0;
  background-color: #007aff;
  color: white;
  border-radius: 10rpx;
  font-size: 32rpx;
}
</style>
