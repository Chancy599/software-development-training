<template>
	<view class="container">
		<!-- 组织选择器 -->
		<picker mode="selector" :range="belongInformation" @change="handleSelectOrganization">
			<view class="picker">
				当前选择: {{ selectedOrganization || '请选择组织' }}
			</view>
		</picker>

		<!-- 签到记录显示 -->
		<view v-if="checkInRecords.length > 0">
			<view class="record-title">签到记录（共 {{ totalRecords }} 条）</view>
			<view class="record-list">
				<view v-for="(record, index) in checkInRecords" :key="index" class="record-item">
					<text>签到编号: {{ record[0] }}</text>
					<text>签到开始时间: {{ record[1] }}</text>
					<text>签到时间: {{ record[2] }}</text>
					<text>签到状态: {{ record[3] }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',               // 用户名
				belongInformation: [],      // 组织信息
				selectedOrganization: '',   // 选中的组织
				checkInRecords: [],         // 签到记录
				totalRecords: 0             // 记录总数
			};
		},
		onLoad() {
			this.getUserBelongInformation();
		},
		methods: {
			// 获取用户所属组织
			getUserBelongInformation() {
				this.username = uni.getStorageSync('globalUsername'); // 获取存储的用户名
				if (!this.username) {
					uni.showToast({
						title: '未登录，请重新登录',
						icon: 'none'
					});
					return;
				}

				const envId = 'prod-7glwxii4e6eb93d8';
				const apiUrl = `https://${envId}.service.tcloudbase.com/getBelongInformation`;

				uni.request({
					url: apiUrl,
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					data: { username: this.username },
					success: (res) => {
						console.log('组织信息返回:', res);
						if (res.data.belong_information.length === 0) {
							uni.showToast({
								title: '你不归属于任何组织',
								icon: 'none'
							});
						} else {
							this.belongInformation = res.data.belong_information;
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({
							title: '获取组织信息失败',
							icon: 'none'
						});
					}
				});
			},

			// 处理用户选择组织
			handleSelectOrganization(event) {
				const index = event.detail.value;
				this.selectedOrganization = this.belongInformation[index];

				// 发送所选组织信息到后端
				this.sendSelectedOrganization();
			},

			// 发送用户选择的组织到后端，获取签到记录
			sendSelectedOrganization() {
				const envId = 'prod-7glwxii4e6eb93d8';
				const apiUrl = `https://${envId}.service.tcloudbase.com/getCheckInRecords`;

				uni.request({
					url: apiUrl,
					method: 'POST',
					header: {
						'content-type': 'application/json'
					},
					data: {
						username: this.username,
						organization: this.selectedOrganization
					},
					success: (res) => {
						console.log('签到记录返回:', res);
						if (res.data.records) {
							this.checkInRecords = res.data.records;
							this.totalRecords = res.data.total;
						} else {
							uni.showToast({
								title: '获取签到记录失败',
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
			}
		}
	}
</script>

<style>
	.container {
		padding: 20rpx;
	}
	.picker {
		padding: 20rpx;
		background-color: #f5f5f5;
		border-radius: 10rpx;
		margin-bottom: 30rpx;
		text-align: center;
	}
	.record-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.record-list {
		display: flex;
		flex-direction: column;
	}
	.record-item {
		background-color: #fff;
		padding: 20rpx;
		margin-bottom: 10rpx;
		border-radius: 10rpx;
		box-shadow: 0 2rpx 5rpx rgba(0, 0, 0, 0.1);
	}
</style>
