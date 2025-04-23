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
		<view class="menu-item" @click="handleDeleteOrg">
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
			},
			handleDeleteOrg() {
				if (!this.classid) {
					uni.showToast({
						title: '请先选择要删除的班级',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				
				uni.showModal({
					title: '警告',
					content: `确定要删除班级【${this.selectedName}】吗？此操作将删除所有成员和签到记录，且不可恢复！`,
					confirmText: '确认删除',
					confirmColor: '#FF0000',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							this.deleteOrganization();
						}
					}
				});
			},
			async deleteOrganization() {
				uni.showLoading({
					title: '正在删除...',
					mask: true
				});
				
				try {
					// 1. 删除班级及其成员数据
					const res = await wx.cloud.callContainer({
						config: {
							env: 'prod-7glwxii4e6eb93d8'
						},
						path: `/classMember/deleteAll/${encodeURIComponent(this.classid)}`,
						header: {
							'X-WX-SERVICE': 'query',
							'content-type': 'application/json'
						},
						method: 'GET'
					});
					
					if (res && res.data) {
						const result = res.data;
						
						// 2. 删除管理员的归属记录
						await this.deleteManageBelong();
						
						// 3. 删除所有成员的归属记录
						if (result.deletedClassMemberIds && result.deletedClassMemberIds.length > 0) {
							await this.deleteMembersBelong(result.deletedClassMemberIds);
						}
						
						uni.hideLoading();
						
						uni.showModal({
							title: '删除成功',
							content: `已删除班级 ${result.deletedClassId}\n删除成员: ${result.membersDeleted}人\n删除签到记录: ${result.checkinRecordsDeleted}条`,
							showCancel: false,
							success: () => {
								// 更新全局数据，移除已删除的班级
								const index = this.$globalData.manage_information.indexOf(this.classid);
								if (index !== -1) {
									this.$globalData.manage_information.splice(index, 1);
									this.$globalData.manageInfo_name.splice(index, 1);
								}
								
								// 重置当前选择
								this.selectedName = '';
								this.classid = '';
							}
						});
					} else {
						throw new Error('返回数据格式不正确');
					}
				} catch (err) {
					uni.hideLoading();
					console.error('删除失败:', err);
					uni.showModal({
						title: '删除失败',
						content: err.message || '网络异常，请稍后重试',
						showCancel: false
					});
				}
			},
			async deleteMembersBelong(memberIds) {
				try {
					// 并行执行所有删除请求
					const deletePromises = memberIds.map(id => 
						this.deleteBelong(id).catch(e => {
							console.error(`删除成员 ${id} 归属记录失败:`, e);
							return null; // 即使单个失败也不中断整个流程
						})
					);
					
					await Promise.all(deletePromises);
					console.log('所有成员归属记录删除完成');
				} catch (err) {
					console.error('删除成员归属记录时出错:', err);
					throw err;
				}
			},
			async deleteManageBelong() {
				try {
					await wx.cloud.callContainer({
						config: {
							env: 'prod-7glwxii4e6eb93d8'
						},
						path: `/deleteManageBelong?id=${encodeURIComponent(this.$globalData.username)}&targetBelong=${encodeURIComponent(this.classid)}`,
						header: {
							'X-WX-SERVICE': 'userinfo',
							'content-type': 'application/json'
						},
						method: 'DELETE'
					});
					console.log('管理员归属删除成功');
				} catch (err) {
					console.error('管理员归属删除失败:', err);
					throw err;
				}
			},
			async deleteBelong(id) {
				try {
					await wx.cloud.callContainer({
						config: {
							env: 'prod-7glwxii4e6eb93d8'
						},
						path: `/deleteBelong?id=${encodeURIComponent(id)}&targetBelong=${encodeURIComponent(this.classid)}`,
						header: {
							'X-WX-SERVICE': 'userinfo',
							'content-type': 'application/json'
						},
						method: 'DELETE'
					});
					console.log(`学生 ${id} 归属删除成功`);
				} catch (err) {
					console.error(`学生 ${id} 归属删除失败:`, err);
					throw err;
				}
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