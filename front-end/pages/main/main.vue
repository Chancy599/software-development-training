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
			<view class="menu-item" @click="handleMenuItemClick('UncheckedList')">
				<text class="menu-icon iconfont">&#xe604;</text>
				<text class="menu-text">尚未签到</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
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
					case 'Check_Record':
						// 跳转到查看记录页面
						uni.navigateTo({ url: '/pages/Check_Record/Check_Record' });
						break;
					case 'mySettings':
						// 跳转到我的设置页面
						uni.navigateTo({ url: '/pages/mySettings/mySettings' });
						break;
					case 'mySettings':
						// 跳转到新建组织页面
						uni.navigateTo({ url: '/pages/OrgCreate/OrgCreate' });
						break;
					case 'mySettings':
						// 跳转到尚未签到页面
						uni.navigateTo({ url: '/pages/UncheckedList/UncheckedList' });
						break;
					default:
						uni.showToast({
							title: '功能暂未开放',
							icon: 'none'
						});
				}
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
							this.$globalData.belong_name = res.data.belong_name || [];
							this.$globalData.manage_name = res.data.manage_name || [];
						} else {
							uni.showToast({ title: '获取用户信息失败', icon: 'none' });
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
					}
				});
			}
		},
		onLoad() {
			this.fetchUserInfo();
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