<template>
	<view class="content">
		<!-- 顶部标题 -->
		<view class="header">
			<text class="header-title">{{title}}</text>
		</view>

		<!-- Logo -->
		<image class="logo" src="/static/logo.png"></image>

		<!-- 注册表单 -->
		<view class="register-form">
			<input class="input" type="text" v-model="username" placeholder="请输入账号" />
			<input class="input" type="password" v-model="password" placeholder="请输入密码" />

			<!-- 注册链接 -->
			<view class="register-link" @click="handleRegister">
				<text>已有帐号？点击这里</text>
			</view>

			<button class="register-btn" @click="handleregister">注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '欢迎注册',
				username: '', // 账号
				password: ''  // 密码
			}
		},
		onLoad() {

		},
		methods: {
			// 处理注册按钮点击
			handleregister() {
				const { username, password } = this;
				console.log(`账号: ${username}, 密码: ${password}`);

				// 这里可以添加账号和密码的验证逻辑
				// 例如：调用API进行验证

                uni.navigateTo({ url: '/pages/login/login' });
			},
			// 处理注册链接点击
			handleRegister() {
				console.log('跳转到登录页面');
				// 这里添加跳转到登录页面的逻辑
				uni.navigateTo({ url: '/pages/login/login' });
				uni.showToast({
					title: '跳转到登录页面（模拟）',
					icon: 'none'
				});
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	/* 顶部标题样式 */
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
		margin-top: 50rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.register-form {
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

	/* 注册链接样式 */
	.register-link {
		margin-bottom: 30rpx;
		color: #007AFF;
		text-decoration: underline;
		font-size: 28rpx;
	}

	.register-btn {
		width: 80%;
		height: 80rpx;
		background-color: #007AFF;
		color: #fff;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>