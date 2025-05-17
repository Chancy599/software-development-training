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
			<text>{{ stateMap[item.method] }}</text>
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
			uncheckedList: [],
			stateMap: {
				IN_TIME: '准时',
				LATE: '迟到',
				ABSENT: '缺席',
				CREQUEST_LEAVE: '请假'
			}
		}
	},
	onShow() {
		this.Check_In();
	},
	methods: {
		Check_In() {
			wx.cloud.callContainer({
				config: { env: 'prod-7glwxii4e6eb93d8' },
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
					}
				},
				fail: (err) => {
					console.error('请求失败:', err);
					uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
				}
			});
		},
		onLeave(item) {
			uni.navigateTo({ 
				url: `/pages/leaveApplication/leaveApplication?classId=${encodeURIComponent(item.classId)}&startTime=${encodeURIComponent(item.startTime)}`
			});
		},
		onSignIn(item) {
			if (item.method === 'CIPHER') {
				this.onCipherClick(item.classId, item.startTime);
			}
			else if (item.method === 'GPS') {
				uni.navigateTo({
					url: `/pages/Location_Check_In/Location_Check_In?classId=${encodeURIComponent(item.classId)}&startTime=${encodeURIComponent(item.startTime)}`
				});
			} 
			else if (item.method === 'QRCODE') {
				this.onQRCodeSignIn(item.classId, item.startTime);
			} 
			else if (item.method === 'FACE_SCAN') {
				this.onFaceScanSignIn(item.classId, item.startTime)
			} 
			else {
				// 未知签到方式
				uni.showToast({ title: '暂不支持该签到方式', icon: 'none' });
			}
		},
		onCipherClick(classId, startTime) {
			uni.showModal({
				title: '暗号签到',
				editable: true,
				placeholderText: '请输入签到暗号',
				success: (res) => {
					if (res.confirm && res.content) {
						this.startCipherSignIn(classId, startTime,res.content);
					}
				}
			});
		},
		startCipherSignIn(classId, startTime, cipher) {
			wx.cloud.callContainer({
				config: { env: 'prod-7glwxii4e6eb93d8' },
				path: `/api/checkins/verify`,
				header: {
					'X-WX-SERVICE': 'clockin',
					'content-type': 'application/json'
				},
				data: {
					userId: this.$globalData.username,
					classId: classId,
					startTime: startTime,
					method: 'CIPHER',
					params: {
						cipher: cipher
					}
				},
				method: 'POST',
				success: (res) => {
					console.log('暗号签到返回:', res);
					if(res.data.success === true) {
						this.commit(classId, startTime);
					}
					this.Check_In(); // 签到成功后刷新列表
				},
				fail: (err) => {
					console.error('签到失败:', err);
				}
			});
		},
		onQRCodeSignIn(classId, startTime) {
			uni.scanCode({
				scanType: ['qrCode'], // 只扫二维码
				success: (res) => {
					try {
						const qrData = JSON.parse(res.result); // 尝试解析为JSON
						
						if(qrData.class_id === classId && qrData.start_time === startTime) {
							uni.showToast({ title: '扫码成功', icon: 'success' });
							this.commit(classId, startTime);
						}

					} catch (error) {
						console.error('二维码不是有效JSON:', error);
					}
				},
				fail: (err) => {
					console.error('扫码失败:', err);
				}
			});
		},
		onFaceScanSignIn(classId, startTime) {
			uni.chooseImage({
				count: 1,
				sourceType: ['camera'], // 使用相机拍照
				success: (chooseRes) => {
					const tempFilePath = chooseRes.tempFilePaths[0];
					const fileName = `FaceRecognition/temp.jpg`;
					
					// 上传到微信云存储
					wx.cloud.uploadFile({
						cloudPath: fileName, // 存储路径
						filePath: tempFilePath, // 本地路径
						success: (res) => {
							console.log('上传成功:', res.fileID);
							this.photoUrl = res.fileID; // 显示照片
							this.startFaceRecognition(classId, startTime);
						},
						fail: (err) => {
							console.error('上传失败:', err);
						}
					});
				},
				fail: (err) => {
					console.error('拍照失败:', err);
				}
			});
		},
		startFaceRecognition(classId, startTime) {
			wx.cloud.callContainer({
				config: {
					env: 'prod-7glwxii4e6eb93d8'
				},
				path: `/FaceCompare?userId=${encodeURIComponent(this.$globalData.username)}&classId=${encodeURIComponent(classId)}`,
				header: {
					'X-WX-SERVICE': 'facerecognition',
					'content-type': 'application/json'
				},
				method: 'GET',
				success: (res) => {
					console.log('后端返回数据:', res);
					if (res.data) {
						this.commit(classId, startTime);
					} else {
						uni.showToast({ title: '验证失败', icon: 'none' });
					}
				},
				fail: (err) => {
					console.error('请求失败:', err);
				}
			});
		},
        commit(classId, startTime) {
            wx.cloud.callContainer({
                config: {
                    env: 'prod-7glwxii4e6eb93d8'
                },
                path: `/api/checkins/commit`,
                header: {
                    'X-WX-SERVICE': 'clockin',
                    'content-type': 'application/json'
                },
                method: 'POST',
                data: {
                    userId: this.$globalData.username,
                    classId: classId,
                    startTime: startTime
                },
                success: (res) => {
                    console.log('后端返回数据:', res);
                    if (res.data && res.data.state) {
						if (res.data.state === 'IN_TIME') {
							uni.showModal({
								title: '签到成功',
								content: '您已准时签到！',
								showCancel: false
							});
						} else if (res.data.state === 'LATE') {
							uni.showModal({
								title: '签到提示',
								content: '您已迟到，请下次注意时间！',
								showCancel: false
							});
						}
                    }
                    setTimeout(() => {
                        uni.navigateBack(); 
                    }, 1000);
                },
                fail: (err) => {
                    console.error('请求失败:', err);
                    uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
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
