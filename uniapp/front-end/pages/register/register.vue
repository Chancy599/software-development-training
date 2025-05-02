<template>
    <view class="content">
        <!-- 注册表单 -->
        <view class="register-form">
            <view class="form-item">
                <label class="label">账号</label>
                <input class="input" type="text" v-model="username" placeholder="请输入账号" />
            </view>
            <view class="form-item">
                <label class="label">密码</label>
                <input class="input" type="password" v-model="password" placeholder="请输入密码" />
            </view>
            <view class="row">
                <view class="form-item half">
                    <label class="label">姓名</label>
                    <input class="input" type="text" v-model="realName" placeholder="请输入姓名" />
                </view>
                <view class="form-item half">
                    <label class="label">性别</label>
                    <picker @change="handleGenderChange" :value="genderIndex" :range="genderOptions">
                        <view class="input picker">{{ genderOptions[genderIndex] }}</view>
                    </picker>
                </view>
            </view>
            <view class="form-item">
                <label class="label">联系方式</label>
                <input class="input" type="text" v-model="contact" placeholder="请输入联系方式" />
            </view>

            <!-- 拍照上传区域 -->
            <view class="photo-upload" @click="takePhoto" v-if="!photoUrl">
                <image class="camera-icon" src="/static/camera.png"></image>
                <text class="upload-text">点击拍照上传人脸</text>
            </view>

            <!-- 显示上传的照片 -->
            <image v-if="photoUrl" :src="photoUrl" class="uploaded-photo"></image>

            <!-- 注册按钮 -->
            <button class="register-btn" @click="handleRegister">注册</button>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            username: '',
            realName: '',
            password: '',
            genderOptions: ['男', '女'],
            genderIndex: 0,
            contact: '',
            photoUrl: ''
        };
    },
    methods: {
        handleGenderChange(event) {
            this.genderIndex = event.detail.value;
        },
        takePhoto() {
            const { username } = this;
            if (!username) {
                uni.showToast({ title: '请先输入账号', icon: 'none' });
                return;
            }
            uni.chooseImage({
                count: 1,
                sourceType: ['camera'],
                success: (chooseRes) => {
                    const tempFilePath = chooseRes.tempFilePaths[0];
                    const fileName = `FaceRecognition/${username}.jpg`;
                    wx.cloud.uploadFile({
                        cloudPath: fileName,
                        filePath: tempFilePath,
                        success: (res) => {
                            console.log('上传成功:', res.fileID);
                            this.photoUrl = res.fileID;
                            uni.showToast({ title: '照片上传成功', icon: 'success' });
                        },
                        fail: (err) => {
                            console.error('上传失败:', err);
                            uni.showToast({ title: '上传失败，请重试', icon: 'none' });
                        }
                    });
                },
                fail: (err) => {
                    console.error('拍照失败:', err);
                    uni.showToast({ title: '拍照失败，请重试', icon: 'none' });
                }
            });
        },
        handleRegister() {
            const { username, realName, password, genderIndex, contact } = this;
            if (!username || !realName || !password || !contact) {
                uni.showToast({ title: '请填写完整信息', icon: 'none' });
                return;
            }
            const gender = genderIndex === 0 ? 'MALE' : 'FEMALE';
            wx.cloud.callContainer({
                config: {
                    env: 'prod-7glwxii4e6eb93d8'
                },
                path: `/register`,
                header: {
                    'X-WX-SERVICE': 'userinfo',
                    'content-type': 'application/json'
                },
                method: 'POST',
                data: {
                    id: username,
                    name: realName,
                    password: password,
                    gender: gender,
                    contact_information: contact
                },
                success: (res) => {
                    console.log('后端返回数据:', res);
                    if (res.data === true) {
                        uni.showToast({ title: '注册成功', icon: 'success' });
                        uni.navigateTo({ url: '/pages/login/login' });
                    } else {
                        uni.showToast({ title: '账号已存在', icon: 'none', duration: 1000 });
                    }
                },
                fail: (err) => {
                    console.error('请求失败:', err);
                    uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
                }
            });
        },
        handleLogin() {
            uni.navigateTo({ url: '/pages/login/login' });
        }
    }
};
</script>
<style>
/* 全局容器 */
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 40rpx;
    min-height: 100vh;
    background: linear-gradient(180deg, #f5f7fa 0%, #e4e9f0 100%);
}

/* 表单容器 */
.register-form {
    width: 100%;
    max-width: 750rpx;
    background: #fff;
    border-radius: 24rpx;
    padding: 40rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

/* 表单项 */
.form-item {
    margin-bottom: 32rpx;
}

/* 标签 */
.label {
    display: block;
    font-size: 28rpx;
    color: #333;
    margin-bottom: 12rpx;
    font-weight: 500;
}

/* 输入框 */
.input {
    width: 100%;
    height: 96rpx;
    padding: 0 28rpx;
    border: none;
    border-radius: 12rpx;
    background: #f8f8f8;
    font-size: 32rpx;
    box-sizing: border-box;
    transition: all 0.3s;
}

.input:focus {
    background: #fff;
    box-shadow: 0 0 12rpx rgba(0, 122, 255, 0.3);
}

/* 行布局 */
.row {
    display: flex;
    justify-content: space-between;
}

/* 半宽表单项 */
.form-item.half {
    width: 48%;
}

/* 选择器 */
.picker {
    background: #f8f8f8;
    line-height: 96rpx;
    color: #333;
}

/* 拍照上传区域 */
.photo-upload {
    width: 240rpx;
    height: 240rpx;
    margin: 24rpx auto;
    border: 2rpx dashed #007AFF;
    border-radius: 16rpx;
    background: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
    cursor: pointer;
}

.photo-upload:hover {
    border-color: #00A1FF;
    background: #f0faff;
    transform: scale(1.02); /* 轻微放大 */
}

.camera-icon {
    width: 80rpx;
    height: 80rpx;
}

.upload-text {
    margin-top: 16rpx;
    font-size: 28rpx;
    color: #007AFF;
}

/* 上传的照片 */
.uploaded-photo {
    width: 240rpx;
    height: 240rpx;
    margin: 24rpx auto;
    border-radius: 16rpx;
    border: 2rpx solid #e6e6e6;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    display: block;
}

/* 注册按钮 */
.register-btn {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(90deg, #007AFF 0%, #00A1FF 100%);
    color: #fff;
    border-radius: 12rpx;
    font-size: 36rpx;
    font-weight: 500;
    margin-top: 24rpx;
    border: none;
    transition: all 0.3s;
}

.register-btn:hover {
    opacity: 0.9;
    transform: scale(1.02);
}

/* 响应式调整 */
@media screen and (max-width: 600rpx) {
    .register-form {
        padding: 32rpx;
    }
    .input {
        font-size: 28rpx;
    }
    .register-btn {
        font-size: 32rpx;
    }
    .photo-upload, .uploaded-photo {
        width: 200rpx;
        height: 200rpx;
    }
    .camera-icon {
        width: 64rpx;
        height: 64rpx;
    }
    .upload-text {
        font-size: 24rpx;
    }
}
</style>