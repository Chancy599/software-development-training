<template>
	<view>
		<picker :range="this.$globalData.manageInfo_name" @change="onPickerChange">
			<view class="picker">
				选择班级：{{ selectedName || '请选择' }}
			</view>
		</picker>

		<view>对应信息：{{ classid }}</view>
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
			}
		}
	}
</script>

<style scoped>
.picker {
	padding: 16rpx;
	border: 1px solid #ccc;
	border-radius: 8rpx;
}
</style>
