<template>
	<view class="content" @click="handleClick">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
		<!-- 增加提示文字 -->
		<view class="hint-text">
			<text>请点击任意处继续</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '打卡君'
			}
		},
		onLoad() {

		},
		methods: {
			// 点击事件处理
			handleClick() {
				uni.showToast({
					title: '即将跳转...',
					icon: 'none'
				});
				// 这里可以添加跳转逻辑，例如跳转到登录页面
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/login/login' // 跳转到登录页面
					});
				}, 1000); // 1秒后跳转
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
		height: 100vh; /* 确保内容居中 */
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 50rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	/* 提示文字样式 */
	.hint-text {
		margin-top: 50rpx;
		font-size: 28rpx;
		color: #888;
		text-align: center;
	}
</style>