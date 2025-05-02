<template>
	<view class="content">
		<!-- 顶部标题 -->
		<view class="header">
			<text class="header-title">{{title}}</text>
			<view class="header-line"></view>
		</view>

		<!-- Logo -->
		<image class="logo" src="/static/logo.png" mode="aspectFit"></image>

		<!-- 登录表单 -->
		<view class="login-form">
			<view class="input-container">
				<input class="input" type="text" v-model="username" placeholder="请输入账号" />
			</view>
			
			<view class="input-container">
				<input class="input" type="password" v-model="password" placeholder="请输入密码" />
			</view>

			<!-- 注册链接 -->
			<view class="register-link" @click="handleRegister">
				<text>尚未注册？点击这里</text>
			</view>

			<button class="login-btn" :disabled="isLoggingIn" @click="handleLogin" :class="{'btn-active': !isLoggingIn}">
				{{ isLoggingIn ? '登录中...' : '登录' }}
				<view class="btn-loading" v-if="isLoggingIn"></view>
			</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '欢迎登录',
			username: '',
			password: '',
			isLoggingIn: false 
		};
	},
	methods: {
		handleLogin() {
			if (this.isLoggingIn) return;
			
			const { username, password } = this;
		
			if (!username || !password) {
				uni.showToast({
					title: '请输入账号和密码',
					icon: 'none',
					position: 'top'
				});
				return;
			}
			
			this.isLoggingIn = true; 
		
			// 调用微信云托管接口，使用 POST 请求
			wx.cloud.callContainer({
				config: {
					env: 'prod-7glwxii4e6eb93d8' // 云托管环境ID
				},
				path: `/login`,
				header: {
					'X-WX-SERVICE': 'userinfo',
					'content-type': 'application/json'
				},
				method: 'POST',
				data: {
					id: username,
					password: password
				},
				success: (res) => {
					console.log('后端返回数据:', res);
		
					if (res.data === true) {
						uni.showToast({ 
							title: '登录成功', 
							icon: 'success', 
							duration: 1000,
							mask: true
						});

						// 存入全局变量
						this.$globalData.username = username;
						
						// 设置全局变量
						this.fetchUserInfo();

						// 跳转主页面
						setTimeout(() => {
							uni.navigateTo({ 
								url: '/pages/main/main',
								animationType: 'slide-in-right',
								animationDuration: 300
							});
						}, 1000);
					} else {
						uni.showToast({ 
							title: '账号或密码错误', 
							icon: 'none', 
							duration: 1500,
							position: 'top'
						});
					}
				},
				fail: (err) => {
					console.error('请求失败:', err);
					uni.showToast({ 
						title: '网络异常，请稍后重试', 
						icon: 'none', 
						duration: 1500,
						position: 'top'
					});
				},
				complete: () => {
					this.isLoggingIn = false;
				}
			});
		},
		
		// 获取用户信息
		fetchUserInfo() {
			const username = this.$globalData.username;
			
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
						// 设置全局变量
						this.$globalData.name = res.data.name || '';
						this.$globalData.gender = res.data.gender || '';
						this.$globalData.contact_information = res.data.contact_information || '';
						this.$globalData.belong_information = res.data.belong_information || [];
						this.$globalData.manage_information = res.data.manage_information || [];
						this.$globalData.belongInfo_name = res.data.belongInfo_name || [];
						this.$globalData.manageInfo_name = res.data.manageInfo_name || [];
					} else {
						uni.showToast({ 
							title: '获取用户信息失败', 
							icon: 'none',
							position: 'top'
						});
					}
				},
				fail: (err) => {
					console.error('请求失败:', err);
					uni.showToast({ 
						title: '网络异常，请稍后重试', 
						icon: 'none', 
						duration: 1500,
						position: 'top'
					});
				}
			});
		},
		
		// 注册链接
		handleRegister() {
			uni.navigateTo({ 
				url: '/pages/register/register',
				animationType: 'slide-in-right',
				animationDuration: 300
			});
		}
	}
};
</script>

<style>
/* 基础样式 */
page {
	background-color: #f8f9fa;
	height: 100%;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	padding: 40rpx;
	height: 100%;
	box-sizing: border-box;
}

/* 头部样式 */
.header {
	width: 100%;
	text-align: center;
	margin-top: 60rpx;
	margin-bottom: 40rpx;
	position: relative;
}

.header-title {
	font-size: 48rpx;
	font-weight: 600;
	color: #333;
	letter-spacing: 2rpx;
}

.header-line {
	width: 120rpx;
	height: 6rpx;
	background: linear-gradient(to right, #4a90e2, #5bc0de);
	margin: 20rpx auto;
	border-radius: 3rpx;
}

/* Logo样式 */
.logo {
	height: 240rpx;
	width: 240rpx;
	margin: 40rpx auto;
	border-radius: 24rpx;
	box-shadow: 0 10rpx 30rpx rgba(75, 140, 226, 0.15);
	transition: transform 0.3s ease;
}

.logo:active {
	transform: scale(0.95);
}

/* 表单样式 */
.login-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	margin-top: 60rpx;
}

.input-container {
	width: 85%;
	height: 100rpx;
	margin-bottom: 40rpx;
	display: flex;
	align-items: center;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 0 30rpx;
	box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;
}

.input-container:active {
	transform: translateY(-2rpx);
	box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.1);
}

.input {
	flex: 1;
	height: 100%;
	font-size: 32rpx;
	color: #333;
}

.input::placeholder {
	color: #bbb;
	font-size: 30rpx;
}

/* 注册链接 */
.register-link {
	margin: 20rpx 0 50rpx;
	color: #7d7d7d;
	font-size: 28rpx;
	text-align: right;
	width: 85%;
}

.register-link text {
	color: #4a90e2;
	font-weight: 500;
	text-decoration: none;
	border-bottom: 1rpx solid transparent;
	transition: all 0.2s ease;
	padding-bottom: 4rpx;
}

.register-link text:active {
	color: #3a7bc8;
	border-bottom-color: #3a7bc8;
}

/* 登录按钮 */
.login-btn {
	width: 85%;
	height: 96rpx;
	background: linear-gradient(to right, #4a90e2, #5bc0de);
	color: #fff;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	font-weight: 500;
	border: none;
	outline: none;
	box-shadow: 0 8rpx 25rpx rgba(75, 140, 226, 0.3);
	position: relative;
	overflow: hidden;
	transition: all 0.3s ease;
}

.login-btn::after {
	border: none;
}

.login-btn.btn-active:active {
	transform: translateY(4rpx);
	box-shadow: 0 4rpx 15rpx rgba(75, 140, 226, 0.3);
}

.login-btn[disabled] {
	background: linear-gradient(to right, #a0c4f8, #a8e0f0);
	box-shadow: none;
}

.btn-loading {
	width: 40rpx;
	height: 40rpx;
	border: 4rpx solid rgba(255, 255, 255, 0.3);
	border-top-color: #fff;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	margin-left: 20rpx;
}

@keyframes spin {
	to { transform: rotate(360deg); }
}

/* 动画效果 */
@keyframes fadeIn {
	from { opacity: 0; transform: translateY(20rpx); }
	to { opacity: 1; transform: translateY(0); }
}

.header, .logo, .login-form {
	animation: fadeIn 0.6s ease-out forwards;
}

.login-form {
	animation-delay: 0.2s;
}
</style>