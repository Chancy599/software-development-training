<template>
	<view class="container">
		<!-- 选择班级 -->
		<picker :range="this.$globalData.manageInfo_name" @change="onPickerChange">
			<view class="picker">
				选择班级：{{ selectedName || '请选择' }}
			</view>
		</picker>
		<view class="menu-item" @click="navigateTo('addMember')">
			<text>增加成员</text>
		</view>
		<view class="menu-item" @click="navigateTo('checkMember')">
			<text>查询成员</text>
		</view>
		<view class="menu-item" @click="navigateTo('deleteMember')">
			<text>删除成员</text>
		</view>
		<view class="menu-item" @click="navigateTo('leaveApproval')">
			<text>请假审核</text>
		</view>
		<view class="menu-item" @click="navigateTo('OrgDelete')">
			<text>删除组织</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedName: '',
				classid: ''
			}
		},
		methods: {
			onPickerChange(e) {
				const index = e.detail.value;
				this.selectedName = this.$globalData.manageInfo_name[index];
				this.classid = this.$globalData.manage_information[index];
			},
			navigateTo(page) {
				if (!this.classid) {
					uni.showToast({
						title: '请先选择班级',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				uni.navigateTo({
					url: `/pages/${page}/${page}?classid=${encodeURIComponent(this.classid)}`
				});
			}
		}
	}
</script>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
	
	.picker {
		padding: 16rpx;
		border: 1px solid #ccc;
		border-radius: 8rpx;
		margin: 20rpx 0;
	}
	
	.menu-item {
		width: 80%;
		height: 100px;
		background-color: #007AFF;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 15px 0;
		border-radius: 10px;
		font-size: 18px;
	}
	
	.menu-item:active {
		background-color: #0062CC;
	}
</style>