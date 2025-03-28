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
				username: '', // 账号
				password: ''  // 密码
			}
		},
		onLoad() {

		},
		methods: {
			// 处理登录按钮点击
			handleLogin() {
			    const { username, password } = this;
			
			    if (!username || !password) {
			        uni.showToast({
			            title: '请输入账号和密码',
			            icon: 'none'
			        });
			        return;
			    }
			
			    // 你的云托管环境 ID
			    const envId = 'prod-7glwxii4e6eb93d8';
			
			    // 你的后端登录接口地址
			    const apiUrl = `https://${envId}.service.tcloudbase.com/login`;
			
			    // 发送请求到微信云托管后端
			    uni.request({
			        url: apiUrl, 
			        method: 'POST',
			        header: {
			            'content-type': 'application/json'
			        },
			        data: {
			            username,
			            password
			        },
			        success: (res) => {
			            console.log('后端返回数据:', res);
			            if (res.data.success) {
			                uni.showToast({
			                    title: '登录成功',
			                    icon: 'success'
			                });
							
							//将用户名存入全局变量（本地存储）
							uni.setStorageSync('globalUsername', username); // 使用同步存储
							
							//其他页面获取username
							//const username = uni.getStorageSync('globalUsername');
							//用户退出时清除全局变量
							//uni.removeStorageSync('globalUsername'); 
			
			                // 登录成功，跳转到主页面
			                uni.navigateTo({ url: '/pages/main/main' });
			            } else {
			                uni.showToast({
			                    title: '账号或密码错误，请重试',
			                    icon: 'none'
			                });
			            }
			        },
			        fail: (err) => {
			            console.error('请求失败:', err);
			            uni.showToast({
			                title: '请求失败，请检查网络',
			                icon: 'none'
			            });
			        }
			    });
			},
			
			// 处理跳转到注册页面
			handleRegister() {
				uni.navigateTo({ url: '/pages/register/register' });
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