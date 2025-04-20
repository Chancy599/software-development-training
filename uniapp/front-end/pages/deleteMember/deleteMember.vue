<template>
  <view class="container">
    <view class="input-area">
      <text>学生学号：</text>
      <textarea 
        v-model="studentIdsInput" 
        placeholder="例如：STU001 STU002 STU003"
        auto-height
      ></textarea>
    </view>
    <button type="warn" @click="deleteMembers" class="submit-btn">删除成员</button>
    
    <!-- 删除结果显示区域 -->
    <view class="result-area" v-if="showResult">
      <view class="result-item success">
        <text>成功删除：{{result.successDeletedCount}}人</text>
        <text class="id-list" v-if="result.deletedIds.length > 0">
          已删除学生：{{result.deletedIds.join(', ')}}
        </text>
      </view>
      <view class="result-item not-found" v-if="result.unFoundCount > 0">
        <text>未找到学生：{{result.unFoundCount}}人</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      classid: '',
      studentIdsInput: '',
      showResult: false,
      result: {
        successDeletedCount: 0,
        unFoundCount: 0,
        deletedIds: []
      }
    }
  },
  onLoad(options) {
    this.classid = decodeURIComponent(options.classid || '');
  },
  methods: {
    deleteMembers() {
      // 处理输入：去除首尾空格，分割为数组，过滤空值
      const studentIds = this.studentIdsInput.trim()
        .split(/\s+/) 
        .filter(id => id);
      
      if (studentIds.length === 0) {
        uni.showToast({ 
          title: '请输入至少一个学生ID', 
          icon: 'none', 
          duration: 2000 
        });
        return;
      }
      
      uni.showLoading({ title: '提交中...', mask: true });
      this.showResult = false;
      
      // 先确认操作
      uni.showModal({
        title: '确认删除',
        content: `确定要删除这 ${studentIds.length} 个学生吗？`,
        success: (confirm) => {
          if (confirm.confirm) {
            this.executeDelete(studentIds);
          } else {
            uni.hideLoading();
          }
        }
      });
    },
    executeDelete(studentIds) {
      wx.cloud.callContainer({
        config: {
          env: 'prod-7glwxii4e6eb93d8'
        },
        path: `/classMember/delete/${encodeURIComponent(this.classid)}`,
        header: {
          'X-WX-SERVICE': 'query',
          'content-type': 'application/json'
        },
        method: 'POST',
        data: {
          studentIds: studentIds
        },
        success: (res) => {
          console.log('删除结果:', res);
          uni.hideLoading();
          
          this.result = {
            successDeletedCount: res.data.successDeletedCount || 0,
            unFoundCount: res.data.unFoundCount || 0,
            deletedIds: res.data.deletedIds || []
          };
          this.showResult = true;
          
          if (this.result.successDeletedCount > 0) {
            uni.showToast({ 
              title: `成功删除${this.result.successDeletedCount}人`, 
              icon: 'success'
            });
          } else {
            uni.showToast({ 
              title: '没有学生被删除', 
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('删除失败:', err);
          uni.hideLoading();
          uni.showToast({ 
            title: '删除失败: ' + (err.errMsg || '网络异常'), 
            icon: 'none'
          });
        }
      });
    },
	async deleteBelong(id) {
	  return new Promise((resolve, reject) => {
	    wx.cloud.callContainer({
	      config: {
	        env: 'prod-7glwxii4e6eb93d8'
	      },
	      path: `/deleteBelong?id=${encodeURIComponent(id)}&targetBelong=${encodeURIComponent(this.classid)}`,
	      header: {
	        'X-WX-SERVICE': 'userinfo',
	        'content-type': 'application/json'
	      },
	      method: 'DELETE',
	      success: (res) => {
	        console.log(`学生 ${id} 归属删除成功:`, res);
	        resolve(res);
	      },
	      fail: (err) => {
	        console.error(`学生 ${id} 归属删除失败:`, err);
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
  padding: 20px;
}
.input-area {
  margin-bottom: 20px;
}
.submit-btn {
  margin-top: 20px;
  background-color: #f56c6c;
  color: white;
}
.result-area {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.result-item {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
}
.result-item.success {
  background-color: #f0f9eb;
  color: #67c23a;
}
.result-item.not-found {
  background-color: #fef0f0;
  color: #f56c6c;
}
.id-list {
  display: block;
  margin-top: 5px;
  font-size: 14px;
  color: #666;
}
</style>