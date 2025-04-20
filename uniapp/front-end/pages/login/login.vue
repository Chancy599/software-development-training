<template>
	<view class="content">
		<!-- 顶部标题 -->
		<view class="header">
			<text class="header-title">{{title}}</text>
		</view>

		<!-- Logo -->
		<image class="logo" src="/static/logo.png"></image>

		<!-- 登录表单 -->
		<view class="login-form">
			<input class="input" type="text" v-model="username" placeholder="请输入账号" />
			<input class="input" type="password" v-model="password" placeholder="请输入密码" />

			<!-- 注册链接 -->
			<view class="register-link" @click="handleRegister">
				<text>尚未注册？点击这里</text>
			</view>

			<button class="login-btn" @click="handleLogin">登录</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '欢迎登录',
			username: '',
			password: ''
		};
	},
	methods: {
		handleLogin() {
			const { username, password } = this;
		
			if (!username || !password) {
				uni.showToast({
					title: '请输入账号和密码',
					icon: 'none'
				});
				return;
			}
		
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
						uni.showToast({ title: '登录成功', icon: 'success', duration: 1000 });

						// 存入全局变量
						this.$globalData.username = username;
						
						// 设置全局变量
						this.fetchUserInfo();

						// 跳转主页面
						uni.navigateTo({ url: '/pages/main/main' });
					} else {
						uni.showToast({ title: '账号或密码错误', icon: 'none', duration: 1000 });
					}
				},
				fail: (err) => {
					console.error('请求失败:', err);
					uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
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
						uni.showToast({ title: '获取用户信息失败', icon: 'none' });
					}
				},
				fail: (err) => {
					console.error('请求失败:', err);
					uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
				}
			});
		},
		
		// 注册链接
		handleRegister() {
			uni.navigateTo({ url: '/pages/register/register' });
		}
	}
};
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.header {
	width: 100%;
	text-align: center;
	margin-top: 50rpx;
	margin-bottom: 50rpx;
}

.header-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin: 50rpx auto;
}

.login-form {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.input {
	width: 80%;
	height: 80rpx;
	margin-bottom: 30rpx;
	padding: 10rpx;
	border: 1rpx solid #ccc;
	border-radius: 10rpx;
}

.register-link {
	margin-bottom: 30rpx;
	color: #007AFF;
	text-decoration: underline;
	font-size: 28rpx;
}

.login-btn {
	width: 80%;
	height: 80rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 10rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 30rpx;
}
</style>
