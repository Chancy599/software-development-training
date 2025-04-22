<template>
	<view class="container">
		<view v-if="uncheckedList.length" class="card" v-for="(item, index) in uncheckedList" :key="index">
			<text class="label">课程名称：</text> 
			<text>{{ item.className }}</text> 
			<view class="spacer"></view>
			
			<text class="label">开始时间：</text>
			<text>{{ item.startTime }}</text>
			<view class="spacer"></view>
			
			<text class="label">签到方式：</text>
			<text>{{ item.method }}</text>
			<view class="spacer"></view>

			<!-- 按钮区域 -->
			<view class="action-buttons">
				<button type="primary" size="mini" @click="onSignIn(item)">签到</button>
				<button type="default" size="mini" @click="onLeave(item)">请假</button>
			</view>
		</view>

		<view v-else class="empty">
			<text>暂无未签到课程</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				uncheckedList: []
			}
		},
		onLoad() {
			this.Check_In();
		},
		methods: {
			Check_In() {
				wx.cloud.callContainer({
					config: {
						env: 'prod-7glwxii4e6eb93d8'
					},
					path: `/EnterClassToSelectUser/GetUncheckedList?userId=${encodeURIComponent(this.$globalData.username)}`,
					header: {
						'X-WX-SERVICE': 'query',
						'content-type': 'application/json'
					},
					method: 'GET',
					success: (res) => {
						console.log('后端返回数据:', res);
						if (Array.isArray(res.data) && res.data.length > 0) {
							this.uncheckedList = res.data;
						} else {
							this.uncheckedList = [];
							uni.showToast({ title: '暂无未签到课程', icon: 'none' });
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
					}
				});
			},
			onLeave(item) {
				uni.navigateTo({ 
					url: `/pages/leaveApplication/leaveApplication?classId=${item.classId}&startTime=${encodeURIComponent(item.startTime)}`
					});
			},
			onSignIn(item) {
				const method = item.method;

				const methodToPage = {
					GPS: '/pages/Location_Check_In/Location_Check_In',
					CIPHER: '/pages/Cipher_Check_In/Cipher_Check_In',
					FACE_SCAN: '/pages/Face_Check_In/Face_Check_In',
					QRCODE: '/pages/QRCode_Check_In/QRCode_Check_In'
				};

				const targetPage = methodToPage[method];

				if (targetPage) {
					uni.navigateTo({
						url: `${targetPage}?classId=${item.classId}&startTime=${encodeURIComponent(item.startTime)}`
					});
				} else {
					uni.showToast({
						title: '未知的签到方式',
						icon: 'none'
					});
				}
			}
		}
	}
</script>

<style>
.container {
	padding: 20rpx;
}

.card {
	background-color: #f8f8f8;
	padding: 20rpx;
	margin-bottom: 20rpx;
	border-radius: 12rpx;
	box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.1);
}

.label {
	font-weight: bold;
	margin-right: 10rpx;
}

.spacer {
	height: 10rpx;
}

.empty {
	text-align: center;
	color: #999;
	margin-top: 50rpx;
	font-size: 28rpx;
}

.action-buttons {
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
	margin-top: 20rpx;
}
</style>
