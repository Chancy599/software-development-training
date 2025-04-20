<template>
  <view class="container">
    <!-- 成员列表标题 -->
    <view class="header">
      <text class="title">班级成员列表</text>
    </view>
    
    <!-- 成员列表 -->
    <view class="member-list">
      <view v-if="loading" class="loading">
        <text>加载中...</text>
      </view>
      
      <view v-else-if="members.length === 0" class="empty">
        <text>暂无成员数据</text>
      </view>
      
      <view v-else>
        <view 
          v-for="(member, index) in members" 
          :key="index" 
          class="member-item"
        >
          <view class="member-info">
            <text class="member-id">{{ member.id }}</text>
            <text class="member-name">{{ member.name }}</text>
          </view>
          <button 
            class="detail-btn" 
            @click="goToDetail(member.id)"
          >
            查看详情
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      classid: '',
      members: [],
      loading: false
    }
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || '');
    this.fetchMembers();
  },
  methods: {
    // 获取成员列表
    async fetchMembers() {
      this.loading = true;
      try {
        const res = await wx.cloud.callContainer({
          config: { env: 'prod-7glwxii4e6eb93d8' },
          path: `/classMember/query/${encodeURIComponent(this.classid)}`,
          header: {
            'X-WX-SERVICE': 'query',
            'content-type': 'application/json'
          },
          method: 'GET'
        });
        
        this.members = res.data || [];
      } catch (err) {
        console.error('查询失败:', err);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 跳转到详情页
    goToDetail(userid) {
      uni.navigateTo({
        url: `/pages/checkMember/checkMember?classid=${encodeURIComponent(this.classid)}&userid=${encodeURIComponent(userid)}`
      });
    }
  }
}
</script>

<style>
.container {
  padding: 15px;
}

.header {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}

.title {
  font-size: 18px;
  font-weight: bold;
}

.member-list {
  margin-top: 10px;
}

.member-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.member-info {
  display: flex;
  margin-bottom: 8px;
}

.member-id {
  width: 120px;
  color: #666;
}

.member-name {
  flex: 1;
}

.detail-btn {
  background-color: #007aff;
  color: white;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  width: 100px;
}

.loading, .empty {
  text-align: center;
  padding: 50px 0;
  color: #999;
}
</style>