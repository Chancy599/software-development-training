<template>
  <view class="container">
    <!-- 顶部标题 -->
    <view class="header">
      <text class="title">请假申请</text>
    </view>
    
    <!-- 表单区域 -->
    <view class="form-container">
      
      <!-- 请假原因 -->
      <view class="form-item">
        <text class="label">请假原因：</text>
        <textarea 
          v-model="word" 
          placeholder="请输入请假原因" 
          class="reason-input"
          auto-height
        ></textarea>
      </view>
      
      <!-- 照片上传 -->
      <view class="form-item">
        <text class="label">证明材料：</text>
        <button @click="takePhoto" class="upload-btn">
          <uni-icons type="camera" size="16"></uni-icons>
          {{ photo_path ? '重新上传' : '拍照上传' }}
        </button>
        <image v-if="photo_path" :src="photo_path" class="preview-image"></image>
      </view>
    </view>
    
    <!-- 提交按钮 -->
    <button 
      @click="AddReason" 
      class="submit-btn"
      :disabled="!word || !photo_path"
    >
      提交申请
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      class_id: '',
      start_time: '',
      word: '',
      photo_path: ''
    }
  },
  onLoad(options) {
    this.class_id = decodeURIComponent(options.classId || '');
    this.start_time = decodeURIComponent(options.startTime || '');
  },
  methods: {
	AddReason() {
	  if (!this.word) {
	    return uni.showToast({ title: '请填写请假原因', icon: 'none' });
	  }
	  if (!this.photo_path) {
	    return uni.showToast({ title: '请上传证明材料', icon: 'none' });
	  }
	  
	  // 打印要发送的数据
	  const requestData = {
	    sender_id: this.$globalData.username,
	    class_id: this.class_id,
	    start_time: this.start_time,
	    word: this.word,
	    photo_path: this.photo_path
	  };
	  console.log('将要发送给后端的数据:', requestData);
	  
	  uni.showLoading({ title: '提交中...', mask: true });
	  
	  wx.cloud.callContainer({
	    config: { env: 'prod-7glwxii4e6eb93d8' },
	    path: `/AddReason`,
	    header: {
	      'X-WX-SERVICE': 'reason',
	      'content-type': 'application/json'
	    },
	    method: 'PUT',
	    data: requestData,  // 使用上面定义的数据对象
	    success: (res) => {
	      console.log('后端返回数据:', res);
	      uni.hideLoading();
	      
	      if (res.data === true) {
	        uni.showToast({ title: '申请成功', icon: 'success' });
	        setTimeout(() => {
	          uni.navigateTo({ url: '/pages/UncheckedList/UncheckedList' });
	        }, 1500);
	      } else {
	        uni.showToast({ title: '申请失败', icon: 'none' });
	      }
	    },
	    fail: (err) => {
	      console.error('请求失败:', err);
	      uni.hideLoading();
	      uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
	    }
	  });
	},
    
    takePhoto() {
      uni.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (chooseRes) => {
          const tempFilePath = chooseRes.tempFilePaths[0];
          const fileName = `LeaveList/${this.start_time}/${this.$globalData.username}.jpg`;
          
          uni.showLoading({ title: '上传中...', mask: true });
          
          wx.cloud.uploadFile({
            cloudPath: fileName,
            filePath: tempFilePath,
            success: (res) => {
              console.log('上传成功:', res.fileID);
              this.photo_path = res.fileID;
              uni.hideLoading();
              uni.showToast({ title: '上传成功', icon: 'success' });
            },
            fail: (err) => {
              console.error('上传失败:', err);
              uni.hideLoading();
              uni.showToast({ title: '上传失败，请重试', icon: 'none' });
            }
          });
        },
        fail: (err) => {
          console.error('拍照失败:', err);
          uni.showToast({ title: '拍照失败，请重试', icon: 'none' });
        }
      });
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  margin-bottom: 30px;
  text-align: center;
}

.title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.form-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 20px;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #666;
  font-weight: bold;
}

.value {
  font-size: 16px;
  color: #333;
}

.reason-input {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.upload-btn {
  background-color: #f0f0f0;
  color: #333;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  margin-bottom: 10px;
}

.preview-image {
  width: 100%;
  height: 200px;
  border-radius: 5px;
  margin-top: 10px;
}

.submit-btn {
  margin-top: 30px;
  background-color: #007aff;
  color: white;
  border-radius: 5px;
}

.submit-btn[disabled] {
  background-color: #cccccc;
  color: #666666;
}
</style>