<template>
	<view>
		<!-- 选择班级 -->
		<picker :range="this.$globalData.manageInfo_name" @change="onPickerChange">
			<view class="picker">
				选择班级：{{ selectedName || '请选择' }}
			</view>
		</picker>

		<!-- 查询按钮 -->
		<view class="btn-area">
			<button type="primary" @click="EnterClassToSelectRecord">查询签到信息</button>
		</view>

		<!-- 展示签到数据 -->
		<view v-if="recordList.length > 0">
			<view class="summary">总签到次数：{{ total }}</view>
			<view class="record" v-for="(item, index) in recordList" :key="index">
				<view>开始时间：{{ item.startTime }}</view>
				<view>签到方式：{{ methodMap[item.method] || item.method }}</view>
				<view>准时：{{ item.in_TIME }} | 迟到：{{ item.late }} | 未到：{{ item.absent }} | 请假：{{ item.request_LEAVE }}</view>
				<view class="detail-btn-wrap">
					<button size="mini" type="primary" @click="goToDetail(item.startTime)">查看详情</button>
				</view>
			</view>
		</view>

		<view v-else-if="queried">暂无签到记录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedName: '',
				classid: '',
				total: 0,
				recordList: [],
				queried: false, // 控制是否已经查询过
				methodMap: {
					FACE_SCAN: '刷脸签到',
					GPS: '定位签到',
					QRCODE: '二维码签到',
					CIPHER: '暗号签到'
				}
			}
		},
		methods: {
			onPickerChange(e) {
				const index = e.detail.value;
				this.selectedName = this.$globalData.manageInfo_name[index];
				this.classid = this.$globalData.manage_information[index];
			},
			EnterClassToSelectRecord() {
				if (!this.classid) {
					uni.showToast({ title: '请先选择班级', icon: 'none' });
					return;
				}
				uni.showLoading({ title: '加载中...' });
				wx.cloud.callContainer({
					config: {
						env: 'prod-7glwxii4e6eb93d8'
					},
					path: `/EnterClassToSelectRecord/${encodeURIComponent(this.classid)}`,
					header: {
						'X-WX-SERVICE': 'query',
						'content-type': 'application/json'
					},
					method: 'GET',
					success: (res) => {
						uni.hideLoading();
						console.log('后端返回数据:', res);
						if (res.data) {
							this.total = res.data.total || 0;
							this.recordList = res.data.records || [];
						} else {
							this.total = 0;
							this.recordList = [];
							uni.showToast({ title: '该班级不存在签到信息', icon: 'none' });
						}
						this.queried = true;
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('请求失败:', err);
						uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
					}
				});
			},
			goToDetail(startTime) {
				uni.navigateTo({
					url: `/pages/Organization_Records_Plus/Organization_Records_Plus?classid=${encodeURIComponent(this.classid)}&startTime=${encodeURIComponent(startTime)}`
				});
			}
		}
	}
</script>

<style scoped>
.picker {
	padding: 16rpx;
	border: 1px solid #ccc;
	border-radius: 8rpx;
	margin: 20rpx 0;
}

.btn-area {
	margin: 20rpx 0;
	text-align: center;
}

.summary {
	font-weight: bold;
	margin-bottom: 20rpx;
}

.record {
	padding: 20rpx;
	border-bottom: 1px solid #eee;
	font-size: 28rpx;
}
</style>