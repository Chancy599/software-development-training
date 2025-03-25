<template>
	<view class="menu-container">
		<!-- 2x2 菜单布局 -->
		<view class="menu-row">
			<view class="menu-item" @click="handleMenuItemClick('startSign')">
				<text class="menu-icon iconfont">&#xe601;</text>
				<text class="menu-text">发起签到</text>
			</view>
			<view class="menu-item" @click="handleMenuItemClick('joinSign')">
				<text class="menu-icon iconfont">&#xe602;</text>
				<text class="menu-text">我要签到</text>
			</view>
		</view>
		<view class="menu-row">
			<view class="menu-item" @click="handleMenuItemClick('signRecord')">
				<text class="menu-icon iconfont">&#xe603;</text>
				<text class="menu-text">签到记录</text>
			</view>
			<view class="menu-item" @click="handleMenuItemClick('mySettings')">
				<text class="menu-icon iconfont">&#xe604;</text>
				<text class="menu-text">我的设置</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			// 处理菜单项点击
			handleMenuItemClick(item) {
				switch (item) {
					case 'startSign':
						// 跳转到发起签到页面
						uni.navigateTo({ url: '/pages/startSign/startSign' });
						break;
					case 'joinSign':
						// 跳转到我要签到页面
						uni.navigateTo({ url: '/pages/joinSign/joinSign' });
						break;
					case 'signRecord':
						// 跳转到签到记录页面
						uni.navigateTo({ url: '/pages/signRecord/signRecord' });
						break;
					case 'mySettings':
						// 跳转到我的设置页面
						uni.navigateTo({ url: '/pages/mySettings/mySettings' });
						break;
					default:
						uni.showToast({
							title: '功能暂未开放',
							icon: 'none'
						});
				}
			}
		}
	};
</script>

<style>
	.menu-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
		background-color: #f8f8f8;
	}

	.menu-row {
		display: flex;
		width: 100%;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.menu-item {
		width: 48%;
		background-color: #ffffff;
		border-radius: 10rpx;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
	}

	.menu-icon {
		font-size: 60rpx;
		color: #007aff;
		margin-bottom: 10rpx;
	}

	.menu-text {
		font-size: 32rpx;
		color: #333;
	}
</style>