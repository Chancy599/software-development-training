<template>
	<view class="content">
		<view class="app-header">
			<image class="logo" src="/static/logo.png"></image>
			<text class="title">{{ title }}</text>
		</view>
		
		<view class="main-content">
			<view class="welcome-message">
				<text class="welcome-text">欢迎使用打卡君</text>
				<text class="sub-text">高效便捷的考勤管理助手</text>
			</view>
		</view>
		
		<!-- 创作团队 -->
		<view class="team-info">
			<text>创作团队：陈曦 王崇博 闫旭明 王翔</text>
		</view>
		
		<!-- 点击按钮 -->
		<view class="action-btn" @click="handleClick">
			<text class="btn-text">点击进入</text>
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
	methods: {
		handleClick() {
			uni.showToast({
				title: '即将跳转...',
				icon: 'none'
			});
			setTimeout(() => {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}, 1000);
		}
	}
}
</script>

<style>
.content {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	padding: 100rpx 40rpx 80rpx;
	min-height: 100vh;
	background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
	box-sizing: border-box;
}

.app-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-bottom: 30rpx;
	border-radius: 30rpx;
	box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.12);
	transition: transform 0.3s ease;
}

.logo:active {
	transform: scale(0.95);
}

.title {
	font-size: 48rpx;
	color: #333;
	font-weight: bold;
	letter-spacing: 2rpx;
}

.main-content {
	width: 100%;
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.welcome-message {
	text-align: center;
	margin-bottom: 60rpx;
}

.welcome-text {
	font-size: 36rpx;
	font-weight: 600;
	color: #333;
	margin-bottom: 20rpx;
	display: block;
}

.sub-text {
	font-size: 28rpx;
	color: #666;
	display: block;
}

.team-info {
	margin: 40rpx 0;
	font-size: 24rpx;
	color: #777;
	text-align: center;
}

.action-btn {
	width: 70%;
	max-width: 500rpx;
	height: 90rpx;
	background: linear-gradient(to right, #4a89dc, #5ca0f2);
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 20rpx rgba(74, 137, 220, 0.3);
	margin-top: 40rpx;
	transition: transform 0.2s ease;
}

.action-btn:active {
	transform: scale(0.97);
}

.btn-text {
	color: white;
	font-size: 32rpx;
	font-weight: 500;
	letter-spacing: 2rpx;
}
</style>