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
      <view v-if="userData.manageInfo_name?.length">
        <text class="value" v-for="(item, index) in userData.manageInfo_name" :key="index">{{ item }}</text>
      </view>
      <text v-else class="value">暂无</text>
    </view>
    <view class="info-box">
      <text class="label">归属组织:</text>
      <view v-if="userData.belongInfo_name?.length">
        <text class="value" v-for="(item, index) in userData.belongInfo_name" :key="index">{{ item }}</text>
      </view>
      <text v-else class="value">暂无</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userData: this.initUserData()
    }
  },
  created() {
    this.syncGlobalData()
  },
  methods: {
    // 初始化用户数据结构
    initUserData() {
      return {
        id: '',
        name: '',
        gender: '',
        contact_information: '',
        belongInfo_name: [],
        manageInfo_name: []
      }
    },
    // 同步全局数据
    syncGlobalData() {
      if (!this.$globalData) {
        console.warn('全局数据未初始化')
        return
      }
      
      this.userData = {
        id: this.$globalData.username || '',
        name: this.$globalData.name || '',
        gender: this.formatGender(this.$globalData.gender),
        contact_information: this.$globalData.contact_information || '',
        belongInfo_name: this.$globalData.belongInfo_name || [],
        manageInfo_name: this.$globalData.manageInfo_name || []
      }
    },
    // 格式化性别显示
    formatGender(gender) {
      const map = { MALE: '男', FEMALE: '女' }
      return map[gender] || ''
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.info-box {
  background-color: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.label {
  font-weight: bold;
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.value {
  font-size: 16px;
  color: #666;
  display: block;
  margin-top: 4px;
}

.value + .value {
  margin-top: 8px;
}
</style>