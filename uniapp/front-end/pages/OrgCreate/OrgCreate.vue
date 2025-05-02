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
        :style="{ minHeight: '100rpx' }"
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
  padding: 30rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
  max-width: 100%;
  box-sizing: border-box;
}

.input-group {
  margin-bottom: 40rpx;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
}

.input-group text {
  display: block;
  margin-bottom: 15rpx;
  font-size: 32rpx;
  color: #222;
  font-weight: 600;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 25rpx;
  border: 2rpx solid #ccc;
  border-radius: 10rpx;
  background-color: #fff;
  font-size: 28rpx;
  line-height: 40rpx; /* 增加行高，确保文字垂直居中且显示完整 */
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  overflow-x: auto;
  word-break: break-all;
}

.input-group input {
  height: 100rpx; /* 显式设置 input 高度，确保单行文字显示完整 */
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: #007aff;
  outline: none;
}

button {
  margin-top: 50rpx;
  background-color: #007aff;
  color: white;
  padding: 25rpx;
  border-radius: 10rpx;
  font-size: 32rpx;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
    