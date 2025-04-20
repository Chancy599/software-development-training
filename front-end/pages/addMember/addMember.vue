<template>
	<view class="container">
		<view class="input-area">
			<text>学生学号：</text>
			<textarea 
				v-model="studentIdsInput" 
				placeholder="例如：STU001 STU002 STU003"
				auto-height 
			></textarea>
		</view>
		<button type="primary" @click="addMember" class="submit-btn">添加成员</button>
		
		<!-- 结果显示区域 -->
		<view class="result-area" v-if="showResult">
			<view class="result-item success">
				<text>成功添加：{{result.successAddedCount}}人</text>
			</view>
			<view class="result-item conflict" v-if="result.conflictCount > 0">
				<text>已存在学生：{{result.conflictCount}}人</text>
				<text class="id-list">{{result.conflictIds.join(', ')}}</text>
			</view>
			<view class="result-item not-found" v-if="result.unFoundCount > 0">
				<text>未找到学生：{{result.unFoundCount}}人</text>
				<text class="id-list">{{result.unFoundIds.join(', ')}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				classid: '',
				studentIdsInput: '',
				showResult: false,
				result: {
					successAddedCount: 0,
					conflictCount: 0,
					unFoundCount: 0,
					conflictIds: [],
					unFoundIds: []
				}
			}
		},
		onLoad(options) {
			this.classid = decodeURIComponent(options.classid || '');
		},
		methods: {
			addMember() {
				// 处理输入：去除首尾空格，分割为数组，过滤空值
				const studentIds = this.studentIdsInput.trim()
					.split(/\s+/) // 按空格分割
					.filter(id => id); // 过滤空值
				
				if (studentIds.length === 0) {
					uni.showToast({ 
						title: '请输入至少一个学生ID', 
						icon: 'none', 
						duration: 2000 
					});
					return;
				}
				
				uni.showLoading({ title: '提交中...', mask: true });
				this.showResult = false;
				
				wx.cloud.callContainer({
					config: {
						env: 'prod-7glwxii4e6eb93d8' // 云托管环境ID
					},
					path: `/classMember/add/${encodeURIComponent(this.classid)}`,
					header: {
						'X-WX-SERVICE': 'query',
						'content-type': 'application/json'
					},
					method: 'POST',
					data: {
						studentIds: studentIds
					},
					success: async (res) => {
						console.log('后端返回数据:', res);
						
						// 处理返回结果
						this.result = {
							successAddedCount: res.data.successAddedCount || 0,
							conflictCount: res.data.conflictCount || 0,
							unFoundCount: res.data.unFoundCount || 0,
							conflictIds: res.data.conflictIds || [],
							unFoundIds: res.data.unFoundIds || []
						};
						this.showResult = true;
						
						// 找出成功添加的学生ID（不在conflictIds和unFoundIds中的）
						const successIds = studentIds.filter(id => 
							!this.result.conflictIds.includes(id) && 
							!this.result.unFoundIds.includes(id)
						);
						
						// 为每个成功添加的学生执行updateBelong
						try {
							const updatePromises = successIds.map(id => this.updateBelong(id));
							await Promise.all(updatePromises);
							console.log('所有学生归属更新完成');
						} catch (error) {
							console.error('部分学生归属更新失败:', error);
						}
						
						uni.hideLoading();
						
						// 根据结果显示不同提示
						if (this.result.successAddedCount > 0) {
							uni.showToast({ 
								title: `成功添加${this.result.successAddedCount}人`, 
								icon: 'success', 
								duration: 1500 
							});
						} else {
							uni.showToast({ 
								title: '没有新学生被添加', 
								icon: 'none', 
								duration: 2000 
							});
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.hideLoading();
						uni.showToast({ 
							title: '添加失败: ' + (err.errMsg || '网络异常'), 
							icon: 'none', 
							duration: 2000 
						});
					}
				});
			},
			async updateBelong(id) {
			  return new Promise((resolve, reject) => {
			    wx.cloud.callContainer({
			      config: {
			        env: 'prod-7glwxii4e6eb93d8'
			      },
			      path: `/updateBelong?id=${encodeURIComponent(id)}&newBelong=${encodeURIComponent(this.classid)}`,
			      header: {
			        'X-WX-SERVICE': 'userinfo',
			        'content-type': 'application/json'
			      },
			      method: 'PUT',
			      success: (res) => {
			        console.log(`学生 ${id} 归属更新成功:`, res);
			        resolve(res);
			      },
			      fail: (err) => {
			        console.error(`学生 ${id} 归属更新失败:`, err);
			        reject(err);
			      }
			    });
			  });
			}
		}
	}
</script>

<style>
	.container {
		padding: 20px;
	}
	.input-area {
		margin-bottom: 20px;
	}
	.submit-btn {
		margin-top: 20px;
	}
	.result-area {
		margin-top: 30px;
		border-top: 1px solid #eee;
		padding-top: 20px;
	}
	.result-item {
		margin-bottom: 15px;
		padding: 10px;
		border-radius: 5px;
	}
	.result-item.success {
		background-color: #f0f9eb;
		color: #67c23a;
	}
	.result-item.conflict {
		background-color: #fdf6ec;
		color: #e6a23c;
	}
	.result-item.not-found {
		background-color: #fef0f0;
		color: #f56c6c;
	}
	.id-list {
		display: block;
		margin-top: 5px;
		font-size: 14px;
		color: #666;
	}
</style>