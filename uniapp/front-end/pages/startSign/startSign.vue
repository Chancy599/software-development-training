<template>
    <view class="container">
        <!-- 选择班级卡片 -->
        <view class="card">
            <view class="card-title">选择签到班级</view>
            <picker :range="this.$globalData.manageInfo_name" @change="onPickerChange">
                <view class="picker">
                    {{ selectedName || '请点击选择班级' }}
                </view>
            </picker>
        </view>

        <view class="card">
            <view class="card-title">设置签到有效时长</view>
            <input 
                type="number" 
                v-model="duration" 
                placeholder="请输入有效时长(分钟)" 
                class="duration-input"
                @input="validateDuration"
            />
        </view>

        <!-- 2x2网格布局 -->
        <view class="grid-container">
            <view class="grid-row">
                <view class="grid-item" @click="onLocationClick">
                    <image class="grid-icon" src="/static/Method/GPS.png"></image>
                    <text class="grid-text">定位签到</text>
                </view>
                <view class="grid-item" @click="onCipherClick">
                    <image class="grid-icon" src="/static/Method/Cipher.png"></image>
                    <text class="grid-text">暗号签到</text>
                </view>
            </view>
            <view class="grid-row">
                <view class="grid-item" @click="onQRcodeClick">
                    <image class="grid-icon" src="/static/Method/QRCode.png"></image>
                    <text class="grid-text">二维码签到</text>
                </view>
                <view class="grid-item" @click="onFaceClick">
                    <image class="grid-icon" src="/static/Method/Face.png"></image>
                    <text class="grid-text">刷脸签到</text>
                </view>
            </view>
        </view>
		
		<view class="auto-link" @click="autoSign">
			<text>懒人模式</text>
		</view>

        <!-- 二维码模态视图 -->
		<view v-if="showQRCodeModalView" class="qr-modal">
			<view class="qr-modal-content">
				<!-- 如果二维码地址存在则显示二维码图像，否则显示加载中提示 -->
				<image 
					v-if="qrImageUrl" 
					:src="qrImageUrl" 
					class="qr-img" 
					mode="widthFix" 
				/>
				<view v-else class="qr-loading">二维码生成中，请稍候...</view>

				<view class="qr-actions">
					<button class="qr-btn save" @click="saveImage" :disabled="!qrImageUrl">保存图片</button>
					<button class="qr-btn cancel" @click="showQRCodeModalView = false">关闭</button>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            selectedName: '',
            classid: '',
            duration: '',
            cipher: '',
            start_time: '',
            file_id: '',
            qrImageUrl: '',
            showQRCodeModalView: false
        }
    },
    methods: {
        onPickerChange(e) {
            const index = e.detail.value;
            this.selectedName = this.$globalData.manageInfo_name[index];
            this.classid = this.$globalData.manage_information[index];
        },
        validateSelection() {
            if (!this.selectedName || !this.duration) {
                uni.showToast({
                    title: '请先选择班级并设置时长',
                    icon: 'none'
                });
                return false;
            }
            return true;
        },
        onLocationClick() {
            if (!this.validateSelection()) return;
            uni.navigateTo({
                url: `/pages/Location_Launch/Location_Launch?classid=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}`
            });
        },
        onCipherClick() {
            if (!this.validateSelection()) return;
            uni.showModal({
                title: '暗号签到',
                editable: true,
                placeholderText: '请输入签到暗号',
                success: (res) => {
                    if (res.confirm && res.content) {
                        this.cipher = res.content;
                        this.startCipherSignIn();
                    }
                }
            });
        },
        startCipherSignIn() {
            uni.showToast({ title: '暗号签到已发起', icon: 'success' });
            wx.cloud.callContainer({
                config: { env: 'prod-7glwxii4e6eb93d8' },
                path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}&method=CIPHER&cipher=${encodeURIComponent(this.cipher)}`,
                header: {
                    'X-WX-SERVICE': 'clockin',
                    'content-type': 'application/json'
                },
                method: 'POST',
                success: (res) => console.log('后端返回数据:', res),
                fail: (err) => {
                    console.error('请求失败:', err);
                    uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
                }
            });
        },
        onFaceClick() {
            if (!this.validateSelection()) return;
            uni.showModal({
                title: '刷脸签到',
                content: '是否确认发起刷脸签到？',
                success: (res) => {
                    if (res.confirm) this.startFaceSignIn();
                    else uni.showToast({ title: '已取消操作', icon: 'none' });
                }
            });
        },
        startFaceSignIn() {
            uni.showToast({ title: '刷脸签到已发起', icon: 'success' });
            wx.cloud.callContainer({
                config: { env: 'prod-7glwxii4e6eb93d8' },
                path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}&method=FACE_SCAN`,
                header: {
                    'X-WX-SERVICE': 'clockin',
                    'content-type': 'application/json'
                },
                method: 'POST',
                success: (res) => console.log('后端返回数据:', res),
                fail: (err) => {
                    console.error('请求失败:', err);
                    uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
                }
            });
        },
        onQRcodeClick() {
            if (!this.validateSelection()) return;
            uni.showModal({
                title: '二维码签到',
                content: '是否确认发起二维码签到？',
                success: (res) => {
                    if (res.confirm) this.startQRCodeSignIn();
                    else uni.showToast({ title: '已取消操作', icon: 'none' });
                }
            });
        },
		startQRCodeSignIn() {
			if (!this.validateSelection()) return;

			this.showQRCodeModalView = true; // 立即显示模态框
			this.qrImageUrl = ''; // 清空旧图像，防止闪烁

			uni.showToast({ title: '二维码签到已发起', icon: 'success' });

			wx.cloud.callContainer({
				config: { env: 'prod-7glwxii4e6eb93d8' },
				path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}&method=QRCODE`,
				header: {
					'X-WX-SERVICE': 'clockin',
					'content-type': 'application/json'
				},
				method: 'POST',
				success: (res) => {
					console.log('后端返回数据:', res);
					this.start_time = res.data.start_timestamp;
					this.generate_qrcode(); // 异步请求二维码
				},
				fail: (err) => {
					console.error('请求失败:', err);
					uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
					this.showQRCodeModalView = false; // 出错时关闭
				}
			});
		},
		generate_qrcode() {
			wx.cloud.callContainer({
				config: { env: 'prod-7glwxii4e6eb93d8' },
				path: '/generate_qrcode',
				header: {
					'X-WX-SERVICE': 'qrcode',
					'content-type': 'application/json'
				},
				method: 'POST',
				data: {
					class_id: this.classid,
					start_time: this.start_time
				},
				success: (res) => {
					console.log('后端返回数据:', res);
					this.file_id = res.data.file_id;
					 console.log('生成的 file_id:', this.file_id);

					// 拿 file_id 换真实临时链接
					wx.cloud.getTempFileURL({
						fileList: [this.file_id],
						success: (res) => {
							console.log('获取临时链接成功:', res);
							this.qrImageUrl = res.fileList[0].tempFileURL;
							this.showQRCodeModalView = true; // 显示模态框
						},
						fail: (err) => {
							console.error('获取临时链接失败:', err);
							uni.showToast({ title: '二维码生成失败', icon: 'none' });
						}
					});
				},
				fail: (err) => {
					console.error('请求失败:', err);
					uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
				}
			});
		},
		saveImage() {
			if (!this.file_id) {
				uni.showToast({ title: '暂无可保存的图片', icon: 'none' });
				return;
			}
			wx.cloud.downloadFile({
				fileID: this.file_id,
				success: (res) => {
					const tempFilePath = res.tempFilePath;
					uni.saveImageToPhotosAlbum({
						filePath: tempFilePath,
						success: () => {
							uni.showToast({ title: '保存成功', icon: 'success' });
						},
						fail: (err) => {
							console.error('保存失败:', err);
							uni.showToast({ title: '保存失败，请检查权限', icon: 'none' });
						}
					});
				},
				fail: (err) => {
					console.error('下载失败:', err);
					uni.showToast({ title: '下载失败', icon: 'none' });
				}
			});
		},
        downloadAndSaveImage() {
            wx.cloud.downloadFile({
                fileID: this.file_id,
                success: (res) => {
                    const tempFilePath = res.tempFilePath;
                    uni.saveImageToPhotosAlbum({
                        filePath: tempFilePath,
                        success: () => {
                            uni.showToast({ title: '保存成功', icon: 'success' });
                        },
                        fail: (err) => {
                            console.error('保存失败:', err);
                            uni.showToast({ title: '保存失败，请检查权限', icon: 'none' });
                        }
                    });
                },
                fail: (err) => {
                    console.error('下载失败:', err);
                    uni.showToast({ title: '下载失败', icon: 'none' });
                }
            });
        },
		autoSign() {
			if (!this.classid) {
				uni.showToast({ title: '请先选择班级', icon: 'none' });
				return;
			}
			wx.cloud.callContainer({
				config: { env: 'prod-7glwxii4e6eb93d8' },
				path: `/template/${encodeURIComponent(this.classid)}`,
				header: {
					'X-WX-SERVICE': 'query',
					'content-type': 'application/json'
				},
				method: 'GET',
				success: (res) => {
					console.log('后端返回数据:', res);
					if (res.data.isLastRecordExist) {
						this.duration = res.data.validDuration;
						const method = res.data.method;
						switch (method) {
							case 'CIPHER':
								this.onCipherClick();
								break;
							case 'GPS':
								uni.navigateTo({
									url: `/pages/Location_Launch/Location_Launch?classid=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}&latitude=${encodeURIComponent(res.data.latitude)}&longitude=${encodeURIComponent(res.data.longitude)}`
								});
								break;
							case 'QRCODE':
								this.onQRcodeClick();
								break;
							case 'FACE_SCAN':
								this.onFaceClick();
								break;
							default:
								console.warn('未知的处理方法:', method);
								uni.showToast({ title: '未知的签到方式', icon: 'none' });
						}
					} else {
						uni.showToast({ title: '上次没有签到哦~', icon: 'none' });
					}
				},
				fail: (err) => {
					console.error('请求失败:', err);
					uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
				}
			});
		}
    }
}
</script>

<style>
.container {
    padding: 20rpx;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.card {
    background-color: white;
    border-radius: 12px;
    padding: 18px;
    margin-bottom: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    border: 1px solid #f1f1f1;
}

.card-title {
    font-size: 15px;
    color: #5a6876;
    margin-bottom: 12px;
    font-weight: 500;
}

.picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px;
    border: 1px solid #e1e5eb;
    border-radius: 10px;
    font-size: 16px;
    color: #2c3e50;
    background-color: #f9fafb;
    transition: all 0.2s;
}

.picker:active {
    background-color: #f1f4f8;
}

.grid-container {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
}

.duration-input {
    padding: 14px;
    border: 1px solid #e1e5eb;
    border-radius: 10px;
    font-size: 16px;
    color: #2c3e50;
    background-color: #f9fafb;
}

.duration-input:focus {
    border-color: #2979ff;
    outline: none;
}

.grid-row {
    display: flex;
    justify-content: space-between;
    gap: 30rpx;
}

.grid-item {
    flex: 1;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 40rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
}

.grid-item:active {
    transform: scale(0.98);
}

.grid-icon {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 20rpx;
}

.grid-text {
    font-size: 32rpx;
    color: #333;
    font-weight: 500;
}

.auto-link {
    margin: 20rpx 0 50rpx;
    color: #007aff; /* 使用蓝色，常见于链接 */
    font-size: 28rpx; /* 适中的字体大小 */
    text-align: right; /* 右对齐 */
    width: 100%;
    cursor: pointer; /* 鼠标悬停时变为手型 */
    text-decoration: underline; /* 给文本加上下划线 */
}

.auto-link:hover {
    color: #005bb5; /* 悬浮时变深蓝色 */
}

/* 模态视图样式 */
.qr-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.qr-modal-content {
    background: #fff;
    padding: 40rpx;
    border-radius: 16rpx;
    text-align: center;
    width: 80%;
}

.qr-img {
    width: 100%;
    max-width: 500rpx;
    margin-bottom: 30rpx;
}

.qr-actions {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
}

.qr-btn {
    flex: 1;
    padding: 20rpx 0;
    font-size: 28rpx;
    border-radius: 10rpx;
    border: none;
}

.qr-btn.save {
    background-color: #007aff;
    color: #fff;
}

.qr-btn.cancel {
    background-color: #f1f1f1;
    color: #333;
}

.qr-loading {
    font-size: 28rpx;
    color: #888;
    margin-bottom: 30rpx;
    text-align: center;
}
</style>