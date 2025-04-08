<template>
	<view class="menu-container">
		<!-- 2x2 菜单布局 -->
		<view class="menu-row">
			<view class="menu-item" @click="handleMenuItemClick('startSign')">
				<text class="menu-icon iconfont">&#xe601;</text>
				<text class="menu-text">发起签到</text>
			</view>
			<view class="menu-item" @click="handleMenuItemClick('UncheckedList')">
				<text class="menu-icon iconfont">&#xe604;</text>
				<text class="menu-text">待签到表</text>
			</view>
		</view>
		<view class="menu-row">
			<view class="menu-item" @click="handleMenuItemClick('Check_Record')">
				<text class="menu-icon iconfont">&#xe603;</text>
				<text class="menu-text">查看记录</text>
			</view>
			<view class="menu-item" @click="handleMenuItemClick('mySettings')">
				<text class="menu-icon iconfont">&#xe604;</text>
				<text class="menu-text">我的设置</text>
			</view>
		</view>
		<view class="menu-row">
			<view class="menu-item" @click="handleMenuItemClick('OrgCreate')">
				<text class="menu-icon iconfont">&#xe603;</text>
				<text class="menu-text">新建组织</text>
			</view>
			<view class="menu-item" @click="handleMenuItemClick('OrgManage')">
				<text class="menu-icon iconfont">&#xe604;</text>
				<text class="menu-text">管理组织</text>
			</view>
		</view>
	</view>
</template>

<script>
	import fetchUserMixin from '@/mixins/fetchUserMixin.js';
	export default {
		methods: {
			mixins: [fetchUserMixin],
			// 处理菜单项点击
			handleMenuItemClick(item) {
				switch (item) {
					case 'startSign':
						// 跳转到发起签到页面
						uni.navigateTo({ url: '/pages/startSign/startSign' });
						break;
					case 'UncheckedList':
						// 跳转到待签到表页面
						uni.navigateTo({ url: '/pages/UncheckedList/UncheckedList' });
						break;
					case 'Check_Record':
						// 跳转到查看记录页面
						uni.navigateTo({ url: '/pages/Check_Record/Check_Record' });
						break;
					case 'mySettings':
						// 跳转到我的设置页面
						uni.navigateTo({ url: '/pages/mySettings/mySettings' });
						break;
					case 'OrgCreate':
						// 跳转到新建组织页面
						uni.navigateTo({ url: '/pages/OrgCreate/OrgCreate' });
						break;
					case 'OrgManage':
						// 跳转到管理组织页面
						uni.navigateTo({ url: '/pages/OrgManage/OrgManage' });
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