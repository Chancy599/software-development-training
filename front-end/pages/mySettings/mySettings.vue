<template>
  <view class="container">
    <view class="info-box">
      <text class="label">账号:</text> 
      <text class="value">{{ userData.id }}</text>
    </view>
    <view class="info-box">
      <text class="label">姓名:</text> 
      <text class="value">{{ userData.name }}</text>
    </view>
    <view class="info-box">
      <text class="label">性别:</text> 
      <text class="value">{{ userData.gender }}</text>
    </view>
    <view class="info-box">
      <text class="label">联系方式:</text> 
      <text class="value">{{ userData.contact_information }}</text>
    </view>
    <view class="info-box">
      <text class="label">归属组织:</text>
      <view v-for="(item, index) in userData.belong_information" :key="index">
        <text class="value">{{ item }}</text>
      </view>
    </view>
	<button @click="handleRecord">签到记录</button>
  </view>
</template>

<script>
const envId = 'prod-7glwxii4e6eb93d8'; // 微信云托管环境 ID

export default {
  data() {
    return {
      userData: {} // 初始化为空
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      wx.request({
        url: `https://${envId}.service.tcloudbase.com/user/12345`, // 你的云托管 API 地址
        method: 'GET',
        success: (res) => {
          this.userData = res.data;
        },
        fail: (err) => {
          console.error('请求用户数据失败:', err);
        }
      });
    }
	
	// 处理跳转到签到记录页面
	handleRecord() {
		uni.navigateTo({ url: '/pages/signRecord/signRecord' });
	}
  }
};
</script>

<style scoped>
/* 容器样式 */
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh; /* 适配全屏 */
}

/* 信息块样式 */
.info-box {
  background-color: #fff;
  padding: 20px; /* 增加内边距，让内容更舒适 */
  margin-bottom: 20px; /* 增大间隔，使信息块更分明 */
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

/* 标签文本 */
.label {
  font-weight: bold;
  font-size: 18px; /* 稍微增大字体，提升可读性 */
  color: #333;
  margin-bottom: 8px; /* 增大标签和值之间的间隔 */
}

/* 值文本 */
.value {
  font-size: 16px;
  color: #666;
}


</style>
