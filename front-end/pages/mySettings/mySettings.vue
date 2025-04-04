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
	  <text class="label">管理组织:</text>
	  <view v-if="userData.manage_information && userData.manage_information.length">
		<view v-for="(item, index) in userData.manage_information" :key="index">
		  <text class="value">{{ item }}</text>
		</view>
	  </view>
	  <text v-else class="value">暂无</text>
	</view>
	<view class="info-box">
	  <text class="label">归属组织:</text>
	  <view v-if="userData.belong_information && userData.belong_information.length">
		<view v-for="(item, index) in userData.belong_information" :key="index">
		  <text class="value">{{ item }}</text>
		</view>
	  </view>
	  <text v-else class="value">暂无</text>
	</view>
    <button @click="handleRecord">签到记录</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userData: {
        id: '',
        name: '',
        gender: '',
        contact_information: '',
        belong_information: [],
		manage_information: []
      }
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      const username = uni.getStorageSync('globalUsername'); // 获取已存储的用户 ID
      if (!username) {
        uni.showToast({ title: '未获取到用户信息', icon: 'none' });
        return;
      }

      wx.cloud.callContainer({
        config: {
          env: 'prod-7glwxii4e6eb93d8' 
        },
        path: `/getInfo?id=${encodeURIComponent(username)}`, 
        header: {
          'X-WX-SERVICE': 'userinfo',
          'content-type': 'application/json'
        },
        method: 'GET',
        success: (res) => {
			console.log('后端返回数据:', res);
			if (res.data) {
				this.userData = {
				id: res.data.id || '',
				name: res.data.name || '',
				gender: res.data.gender === 'MALE' ? '男' : res.data.gender === 'FEMALE' ? '女' : '', // 转换性别
				contact_information: res.data.contact_information || '',
				belong_information: res.data.belong_information || [],
				manage_information: res.data.manage_information || []
				;
			} else {
				uni.showToast({ title: '获取用户信息失败', icon: 'none' });
			}
        },
        fail: (err) => {
          console.error('请求失败:', err);
          uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
        }
      });
    },

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
