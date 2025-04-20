<template>
  <view class="container">
    <view class="input-group">
      <text>班级名称：</text>
      <input v-model="className" placeholder="例如：软件工程1班" />
    </view>
    
    <view class="input-group">
      <text>学生学号：</text>
      <textarea 
        v-model="studentInput" 
        placeholder="例如：STU001 STU002 STU003" 
        auto-height 
      />
    </view>
    
    <button @click="NewClass" type="primary">创建班级</button>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        className: "",
        classId: "",
        studentInput: ""
      }
    },
    methods: {
      // 将空格分隔的字符串转为数组
      parseStudentInput(input) {
        if (!input) return [];
        
        // 1. 替换所有空白字符为空格（包括全角空格、换行等）
        input = input.replace(/\s+/g, ' ');
        
        // 2. 按空格分割并去除空项
        return input.split(' ')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      },
      
      async NewClass() {
        if (!this.className) {
          uni.showToast({ title: '请输入班级名称', icon: 'none' });
          return;
        }
        
        const students = this.parseStudentInput(this.studentInput);
        
        if (students.length === 0) {
          uni.showToast({ title: '请输入至少一个学生学号', icon: 'none' });
          return;
        }

        uni.showLoading({ title: '正在创建...', mask: true });
        
        try {
          // 创建班级
          const classRes = await this.createClass(students);
          this.classId = classRes.data.id;
          
          // 更新管理员的班级归属
          await this.updateManageBelong();
          
          // 并行更新所有学生的班级归属
          const updatePromises = students.map(studentId => this.updateBelong(studentId));
          await Promise.all(updatePromises);
          
          uni.hideLoading();
          uni.showToast({ 
            title: `成功创建班级 ${this.className}`,
            icon: 'success',
            duration: 2000 
          });
		  
		  // 更新全局变量
		  this.$globalData.manager_information.push(this.classId);
		  this.$globalData.manageInfo_name.push(this.className);
          
          // 清空表单
          this.className = "";
          this.classId = "";
          this.studentInput = "";
        } catch (error) {
          uni.hideLoading();
          console.error('创建班级失败:', error);
          uni.showToast({ 
            title: '操作失败：' + (error.errMsg || '服务器错误'),
            icon: 'none',
            duration: 2000
          });
        }
      },
      
      createClass(students) {
        return new Promise((resolve, reject) => {
          wx.cloud.callContainer({
            config: {
              env: 'prod-7glwxii4e6eb93d8'
            },
            path: `/api/classes?className=${encodeURIComponent(this.className)}&managerId=${encodeURIComponent(this.$globalData.username)}`,
            header: {
              'X-WX-SERVICE': 'clockin',
              'content-type': 'application/json'
            },
            method: 'POST',
            data: students, 
            success: resolve,
            fail: reject
          });
        });
      },
      
      async updateManageBelong() {
        return new Promise((resolve, reject) => {
          wx.cloud.callContainer({
            config: {
              env: 'prod-7glwxii4e6eb93d8'
            },
            path: `/updateManageBelong?id=${encodeURIComponent(this.$globalData.username)}&newBelong=${encodeURIComponent(this.classId)}`,
            header: {
              'X-WX-SERVICE': 'userinfo',
              'content-type': 'application/json'
            },
            method: 'PUT',
            success: (res) => {
              console.log('管理员归属更新成功:', res);
              resolve(res);
            },
            fail: (err) => {
              console.error('管理员归属更新失败:', err);
              reject(err);
            }
          });
        });
      },
      
      async updateBelong(id) {
        return new Promise((resolve, reject) => {
          wx.cloud.callContainer({
            config: {
              env: 'prod-7glwxii4e6eb93d8'
            },
            path: `/updateBelong?id=${encodeURIComponent(id)}&newBelong=${encodeURIComponent(this.classId)}`,
            header: {
              'X-WX-SERVICE': 'userinfo',
              'content-type': 'application/json'
            },
            method: 'PUT',
            success: (res) => {
              console.log(`学生 ${id} 归属更新成功:`, res);
              resolve(res);
            },
            fail: (err) => {
              console.error(`学生 ${id} 归属更新失败:`, err);
              reject(err);
            }
          });
        });
      }
    }
  }
</script>

<style>
  .container {
    padding: 20rpx;
  }
  .input-group {
    margin-bottom: 30rpx;
  }
  .input-group text {
    display: block;
    margin-bottom: 10rpx;
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
  }
  .input-group input,
  .input-group textarea {
    width: 100%;
    padding: 20rpx;
    border: 1rpx solid #ddd;
    border-radius: 8rpx;
    background-color: #f9f9f9;
  }
  button {
    margin-top: 40rpx;
    background-color: #007aff;
    color: white;
  }
</style>