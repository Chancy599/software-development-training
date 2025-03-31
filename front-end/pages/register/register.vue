<template>
	<view class="content">
		<!-- 顶部标题 -->
		<view class="header">
			<text class="header-title">{{ title }}</text>
		</view>

		<!-- Logo -->
		<image class="logo" src="/static/logo.png"></image>

		<!-- 注册表单 -->
		<view class="register-form">
			<input class="input" type="text" v-model="username" placeholder="请输入账号" />
			<input class="input" type="password" v-model="password" placeholder="请输入密码" />
			<view class="row">
				<input class="input half" type="text" v-model="realName" placeholder="请输入姓名" />
				<picker @change="handleGenderChange" :value="genderIndex" :range="genderOptions">
					<view class="input picker">{{ genderOptions[genderIndex] }}</view>
				</picker>
			</view>
			
			<input class="input" type="text" v-model="contact" placeholder="请输入联系方式" />

			<!-- 拍照按钮 -->
			<button class="photo-btn" @click="takePhoto">拍照上传</button>

			<!-- 显示上传的照片 -->
			<image v-if="photoUrl" :src="photoUrl" class="uploaded-photo"></image>

			<!-- 已有账号链接 -->
			<view class="register-link" @click="handleLogin">
				<text>已有帐号？点击这里</text>
			</view>

			<!-- 注册按钮 -->
			<button class="register-btn" @click="handleRegister">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '欢迎注册',
				username: '', // 账号
				realName: '', // 姓名
				password: '', // 密码
				genderOptions: ['男', '女'],
				genderIndex: 0, // 默认为男
				contact: '', // 联系方式
				photoUrl: '' // 存储上传照片的URL
			};
		},
		methods: {
			// 处理性别选择
			handleGenderChange(event) {
				this.genderIndex = event.detail.value;
			},

			// 处理拍照上传
			takePhoto() {
				const { username } = this;
				if (!username) {
					uni.showToast({ title: '请先输入账号', icon: 'none' });
					return;
				}

				uni.chooseImage({
					count: 1,
					sourceType: ['camera'], // 使用相机拍照
					success: (chooseRes) => {
						const tempFilePath = chooseRes.tempFilePaths[0];
						const fileName = `FaceRecognition/${username}.jpg`; // 文件名：username.jpg
						
						// 上传到微信云存储
						wx.cloud.uploadFile({
							cloudPath: fileName, // 存储路径
							filePath: tempFilePath, // 本地路径
							success: (res) => {
								console.log('上传成功:', res.fileID);
								this.photoUrl = res.fileID; // 显示照片
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

			// 处理注册按钮点击
			handleRegister() {
				const { username, realName, password, genderIndex, contact } = this;

				if (!username || !realName || !password || !contact) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}

				const gender = genderIndex === 0 ? 'MALE' : 'FEMALE';

				// 调用微信云托管接口，使用 GET 请求
				wx.cloud.callContainer({
					config: {
						env: 'prod-7glwxii4e6eb93d8' // 你的云托管环境ID
					},
					path: `/register`,
					header: {
						'X-WX-SERVICE': 'userinfo',
						'content-type': 'application/json'
					},
					method: 'POST',
					data:{
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

			// 处理跳转到登录页面
			handleLogin() {
				uni.navigateTo({ url: '/pages/login/login' });
			}
		}
	};
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		padding: 0 40rpx;
		box-sizing: border-box;
	}

	.header {
		width: 100%;
		text-align: center;
		margin: 60rpx 0 40rpx;
	}

	.header-title {
		font-size: 44rpx;
		font-weight: bold;
		color: #333;
	}

	.logo {
		height: 180rpx;
		width: 180rpx;
		margin: 20rpx 0 50rpx;
	}

	.register-form {
		width: 100%;
	}

	.input {
		width: 100%;
		height: 96rpx;
		margin-bottom: 32rpx;
		padding: 0 28rpx;
		border: 1rpx solid #e6e6e6;
		border-radius: 12rpx;
		font-size: 32rpx;
		box-sizing: border-box;
		background-color: #fff;
	}
	
	.row {
		display: flex;
		justify-content: space-between;
		width: 100%;
	}
	
	.half {
		width: 80%;
	}

	.photo-btn, .register-btn {
		width: 100%;
		height: 96rpx;
		background-color: #007AFF;
		color: #fff;
		border-radius: 12rpx;
		font-size: 36rpx;
		margin-top: 20rpx;
	}

	.uploaded-photo {
		width: 200rpx;
		height: 200rpx;
		margin-top: 20rpx;
		border-radius: 10rpx;
	}
</style>
