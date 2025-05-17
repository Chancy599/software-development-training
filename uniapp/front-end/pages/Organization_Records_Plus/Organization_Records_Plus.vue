<template>
	<view class="container">
		<view class="summary" v-if="queried">
			<view>准时：{{ in_TIME }}</view>
			<view>迟到：{{ late }}</view>
			<view>未到：{{ absent }}</view>
			<view>请假：{{ request_LEAVE }}</view>
		</view>

		<view v-if="records.length > 0">
			<view class="record" v-for="(item, index) in records" :key="index">
				<view>姓名：{{ item.name }}</view>
				<view>ID：{{ item.userId }}</view>
				<view>签到状态：{{ stateMap[item.state] || item.state }}</view>
				<view>签到开始时间：{{ item.startTime }}</view>
				<view>有效时间：{{ item.validDuration }} 分钟</view>
				<view>实际签到时间：{{ item.actualTime || '未签到' }}</view>
			</view>
		</view>

		<view v-else-if="queried">
			暂无详细签到记录
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classid: '',
				startTime: '',
				in_TIME: 0,
				late: 0,
				absent: 0,
				request_LEAVE: 0,
				records: [],
				queried: false,
				stateMap: {
					IN_TIME: '准时',
					LATE: '迟到',
					ABSENT: '缺席',
					CREQUEST_LEAVE: '请假'
				}
			}
		},
		onLoad(options) {
			this.classid = decodeURIComponent(options.classid || '');
			this.startTime = decodeURIComponent(options.startTime || '');
			this.EnterClassToSelectRecord();
		},
		methods: {
			EnterClassToSelectRecord() {
				uni.showLoading({ title: '加载中...' });
				wx.cloud.callContainer({
					config: {
						env: 'prod-7glwxii4e6eb93d8'
					},
					path: `/EnterClassToSelectRecord/${encodeURIComponent(this.classid)}/${encodeURIComponent(this.startTime)}`,
					header: {
						'X-WX-SERVICE': 'query',
						'content-type': 'application/json'
					},
					method: 'GET',
					success: (res) => {
						uni.hideLoading();
						console.log('后端返回数据:', res);

						if (res.data) {
							this.in_TIME = res.data.in_TIME || 0;
							this.late = res.data.late || 0;
							this.absent = res.data.absent || 0;
							this.request_LEAVE = res.data.request_LEAVE || 0;
							this.records = res.data.records || [];
						} else {
							this.records = [];
						}
						this.queried = true;
					},
					fail: (err) => {
						uni.hideLoading();
						console.error('请求失败:', err);
						uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
					}
				});
			}
		}
	}
</script>

<style scoped>
.container {
	padding: 24rpx;
}

.summary {
	margin-bottom: 30rpx;
	font-weight: bold;
	font-size: 28rpx;
}

.record {
	margin-bottom: 24rpx;
	padding: 20rpx;
	border: 1px solid #eee;
	border-radius: 12rpx;
	background-color: #f9f9f9;
}
</style>
