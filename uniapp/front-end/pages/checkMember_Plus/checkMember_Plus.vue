<template>
  <view class="container">
    <!-- 学生详情卡片 -->
    <view class="detail-card" v-if="memberInfo">
      <view class="detail-item">
        <text class="label">学号：</text>
        <text class="value">{{ memberInfo.id }}</text>
      </view>
      <view class="detail-item">
        <text class="label">姓名：</text>
        <text class="value">{{ memberInfo.name }}</text>
      </view>
      <view class="detail-item">
        <text class="label">性别：</text>
        <text class="value">{{ genderMap[memberInfo.gender] || memberInfo.gender }}</text>
      </view>
      <view class="detail-item">
        <text class="label">联系方式：</text>
        <text class="value">{{ memberInfo.contactInformation }}</text>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading">
      <text>加载中...</text>
    </view>

    <!-- 错误状态 -->
    <view v-if="error" class="error">
      <text>加载失败，请重试</text>
      <button @click="fetchMemberDetail" class="retry-btn">重新加载</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      classid: '',
      userid: '',
      memberInfo: null,
      loading: false,
      error: false,
      genderMap: {
        'MALE': '男',
        'FEMALE': '女'
      }
    }
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || '');
    this.userid = decodeURIComponent(options.userid || '');
    this.fetchMemberDetail();
  },
  methods: {
    // 获取成员详情
    async fetchMemberDetail() {
      this.loading = true;
      this.error = false;
      try {
        const res = await wx.cloud.callContainer({
          config: { env: 'prod-7glwxii4e6eb93d8' },
          path: `/classMember/query/${encodeURIComponent(this.classid)}/${encodeURIComponent(this.userid)}`,
          header: {
            'X-WX-SERVICE': 'query',
            'content-type': 'application/json'
          },
          method: 'GET'
        });
        
        this.memberInfo = res.data;
      } catch (err) {
        console.error('查询详情失败:', err);
        this.error = true;
        uni.showToast({
          title: '加载详情失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style>
/* 保持原有样式不变 */
.container {
  padding: 20px;
}

.detail-card {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-item {
  display: flex;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.detail-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.label {
  width: 80px;
  color: #666;
  font-weight: bold;
}

.value {
  flex: 1;
}

.loading, .error {
  text-align: center;
  padding: 50px 0;
  color: #999;
}

.retry-btn {
  margin-top: 15px;
  background-color: #007aff;
  color: white;
  width: 120px;
}
</style>