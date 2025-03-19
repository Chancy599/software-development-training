<template>
	<view class="content">
		<!-- 顶部标题 -->
		<view class="header">
			<text class="header-title">{{title}}</text>
		</view>

		<!-- Logo -->
		<image class="logo" src="/static/logo.png"></image>

		<!-- 登录模式选择 -->
		<radio-group class="login-mode" @change="handleModeChange">
			<label>
				<radio value="admin" :checked="loginMode === 'admin'" /> 管理员
			</label>
			<label>
				<radio value="employee" :checked="loginMode === 'employee'" /> 员工
			</label>
		</radio-group>

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
				title: '登录页面',
				loginMode: 'admin', // 默认登录模式为管理员
				username: '', // 账号
				password: ''  // 密码
			}
		},
		onLoad() {

		},
		methods: {
			// 处理登录模式切换
			handleModeChange(e) {
				this.loginMode = e.detail.value;
			},
			// 处理登录按钮点击
			handleLogin() {
				const { loginMode, username, password } = this;
				console.log(`登录模式: ${loginMode}, 账号: ${username}, 密码: ${password}`);

				// 这里可以添加账号和密码的验证逻辑
				// 例如：调用API进行验证

				// 暂时只打印登录信息
				uni.showToast({
					title: '登录成功（模拟）',
					icon: 'none'
				});
			},
			// 处理注册链接点击
			handleRegister() {
				console.log('跳转到注册页面');
				// 这里可以添加跳转到注册页面的逻辑
				// 例如：uni.navigateTo({ url: '/pages/register/register' });
				uni.showToast({
					title: '跳转到注册页面（模拟）',
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

	.login-mode {
		margin-top: 50rpx;
		margin-bottom: 50rpx;
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

	/* 注册链接样式 */
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
	}
</style>