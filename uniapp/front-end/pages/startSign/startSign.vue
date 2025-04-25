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
            <!-- 第一行 -->
            <view class="grid-row">
                <view class="grid-item">
                    <image class="grid-icon" src="/static/Method/GPS.png"></image>
                    <text class="grid-text">定位签到</text>
                </view>
                <view class="grid-item" @click="showCipherDialog">
                    <image class="grid-icon" src="/static/Method/Cipher.png"></image>
                    <text class="grid-text">暗号签到</text>
                </view>
            </view>
            <!-- 第二行 -->
            <view class="grid-row">
                <view class="grid-item">
                    <image class="grid-icon" src="/static/Method/QRCode.png"></image>
                    <text class="grid-text">二维码签到</text>
                </view>
                <view class="grid-item">
                    <image class="grid-icon" src="/static/Method/Face.png"></image>
                    <text class="grid-text">刷脸签到</text>
                </view>
            </view>
        </view>
        
        <!-- 暗号输入弹窗 -->
        <uni-popup ref="cipherPopup" type="dialog">
            <uni-popup-dialog 
                mode="input" 
                title="输入签到暗号" 
                placeholder="请输入任意暗号"
                @confirm="confirmCipher"
            ></uni-popup-dialog>
        </uni-popup>
    </view>
</template>

<script>
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue'
import uniPopupDialog from '@dcloudio/uni-ui/lib/uni-popup-dialog/uni-popup-dialog.vue'

export default {
    components: { 
        uniPopup, 
        uniPopupDialog 
    },
    data() {
        return {
            selectedName: '',
            classid: '',
            duration: ''
        }
    },
    methods: {
        onPickerChange(e) {
            const index = e.detail.value;
            this.selectedName = this.$globalData.manageInfo_name[index];
            this.classid = this.$globalData.manage_information[index];
        },
        validateDuration(e) {
            let value = parseInt(e.detail.value);
            if (isNaN(value)) {
                this.duration = '';
                return;
            }
            if (value < 1) {
                this.duration = 1;
                uni.showToast({
                    title: '时长不能小于1分钟',
                    icon: 'none'
                });
            }
        },
        showCipherDialog() {
            if (!this.validateSelection()) return;
            this.$refs.cipherPopup.open();
        },
        confirmCipher(value) {
            if (!value || value.trim() === '') {
                uni.showToast({
                    title: '暗号不能为空',
                    icon: 'none'
                });
                return;
            }
            this.launchSignIn('cipher', value);
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
        launchSignIn(methodType, cipher) {
            const params = {
                classId: this.classid,
                duration: this.duration,
                signMethod: methodType,
                cipher: methodType === 'cipher' ? cipher : null
            };
            
            uni.showLoading({ title: '正在发起签到...' });
            
            uni.request({
                url: '你的签到API地址',
                method: 'POST',
                data: params,
                success: (res) => {
                    uni.hideLoading();
                    if (res.data.code === 200) {
                        uni.showToast({ title: '签到发起成功' });
                    } else {
                        uni.showToast({ title: res.data.message || '签到失败', icon: 'none' });
                    }
                },
                fail: (err) => {
                    uni.hideLoading();
                    uni.showToast({ title: '网络错误', icon: 'none' });
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
</style>