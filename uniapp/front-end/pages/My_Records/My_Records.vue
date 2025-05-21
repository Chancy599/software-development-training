<template>
	<view>
		<!-- 选择组织 -->
		<picker :range="this.$globalData.belongInfo_name" @change="onPickerChange">
			<view class="picker">
				选择组织：{{ selectedName || '请选择' }}
			</view>
		</picker>

		<!-- 查询按钮 -->
		<view class="btn-area">
			<button type="primary" @click="EnterIdToSelectClass">查询签到信息</button>
		</view>
		
		<view class="summary" v-if="queried">
			<view>准时：{{ in_TIME }}次</view>
			<view>迟到：{{ late }}次</view>
			<view>未到：{{ absent }}次</view>
			<view>请假：{{ request_LEAVE }}次</view>
		</view>

		<!-- 展示签到数据 -->
		<view v-if="recordList.length > 0">
			<view class="record" v-for="(item, index) in recordList" :key="index">
				<view>开始时间：{{ item.startTime }}</view>
				<view>有效时长：{{ item.validDuration }}分钟</view>
				<view>实际签到时间：{{ item.actualTime || '未签到' }}</view>
				<view>签到状态：{{ stateMap[item.state] }}</view>
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
			recordList: [],
			queried: false,
			in_TIME: 0,
			late: 0,
			absent: 0,
			request_LEAVE: 0,
			stateMap: {
				'IN_TIME': '准时',
				'LATE': '迟到',
				'ABSENT': '未到',
				'REQUEST_LEAVE': '请假'
			}
		};
	},
	methods: {
		onPickerChange(e) {
			const index = e.detail.value;
			this.selectedName = this.$globalData.belongInfo_name[index];
			this.classid = this.$globalData.belong_information[index];
		},
		EnterIdToSelectClass() {
			if (!this.classid) {
				uni.showToast({ title: '请先选择班级', icon: 'none' });
				return;
			}

			uni.showLoading({ title: '加载中...' });

			wx.cloud.callContainer({
				config: {
					env: 'prod-7glwxii4e6eb93d8'
				},
				path: `/EnterIdToSelectClass/${encodeURIComponent(this.$globalData.username)}/${encodeURIComponent(this.classid)}`,
				header: {
					'X-WX-SERVICE': 'query',
					'content-type': 'application/json'
				},
				method: 'GET',
				success: (res) => {
					uni.hideLoading();
					console.log('后端返回数据:', res);

					if (res.data) {
						this.recordList = res.data.records || [];
						this.in_TIME = res.data.in_TIME || 0;
						this.late = res.data.late || 0;
						this.absent = res.data.absent || 0;
						this.request_LEAVE = res.data.request_LEAVE || 0;
					} else {
						this.resetData();
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
		resetData() {
			this.recordList = [];
			this.in_TIME = 0;
			this.late = 0;
			this.absent = 0;
			this.request_LEAVE = 0;
		}
	}
};
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
