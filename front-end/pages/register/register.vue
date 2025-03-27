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

			<!-- 已有账号链接 -->
			<view class="register-link" @click="handleLogin">
				<text>已有帐号？点击这里</text>
			</view>

			<!-- 注册按钮 -->
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
				realName: '', // 姓名
				password: '', // 密码
				genderOptions: ['男', '女'],
				genderIndex: 0, // 默认为男
				contact: '', // 联系方式
			};
		},
		methods: {
			// 处理性别选择
			handleGenderChange(event) {
				this.genderIndex = event.detail.value;
			},

			// 处理注册按钮点击
			handleregister() {
				const { username, realName, password, genderIndex, contact } = this;

				if (!username || !realName || !password || !contact) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}

				const gender = genderIndex === 0 ? 'MALE' : 'FEMALE';

				// 你的微信云托管环境 ID
				const envId = 'prod-7glwxii4e6eb93d8';
				const apiUrl = `https://${envId}.service.tcloudbase.com/register`;

				// 发送注册请求
				uni.request({
					url: apiUrl,
					method: 'POST',
					header: { 'content-type': 'application/json' },
					data: { username, realName, password, gender, contact },
					success: (res) => {
						if (res.data.success) {
							uni.showToast({
								title: '注册成功',
								icon: 'success'
							});
							uni.navigateTo({ url: '/pages/login/login' });
						} else {
							uni.showToast({
								title: '注册失败，账号已存在',
								icon: 'none'
							});
						}
					},
					fail: () => {
						uni.showToast({
							title: '请求失败，请检查网络',
							icon: 'none'
						});
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
	
	.picker {
		display: flex;
		align-items: center;
		height: 96rpx;
		padding: 0 28rpx;
		border: 1rpx solid #e6e6e6;
		border-radius: 12rpx;
		background-color: #fff;
		color: #333;
		font-size: 32rpx;
	}

	.register-link {
		margin: 20rpx 0 40rpx;
		color: #007AFF;
		text-decoration: underline;
		font-size: 28rpx;
		text-align: center;
	}

	.register-btn {
		width: 100%;
		height: 96rpx;
		line-height: 96rpx;
		background-color: #007AFF;
		color: #fff;
		border-radius: 12rpx;
		font-size: 36rpx;
		margin-top: 20rpx;
	}
</style>