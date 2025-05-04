<template>
    <view class="container">
        <view class="header">
            <text class="title">签到位置设置</text>
            <text class="subtitle">请选择或确认签到地点</text>
        </view>
        
        <map
            :latitude="latitude"
            :longitude="longitude"
            :markers="markers"
            @tap="handleMapTap"
            class="map-container"
            show-location
            enable-zoom
        ></map>
        
        <view class="location-info" v-if="latitude && longitude">
            <view class="location-dot"></view>
            <text class="location-text">当前位置已选定</text>
            <text class="location-coord">{{latitude.toFixed(6)}}, {{longitude.toFixed(6)}}</text>
        </view>
        
        <view class="button-group">
            <button @click="getCurrentLocation" class="btn secondary">
                <text class="btn-icon">↻</text>
                <text>重新定位</text>
            </button>
            <button @click="Launch" class="btn primary">
                <text class="btn-icon">✓</text>
                <text>发起签到</text>
            </button>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            classid:'',
            duration:'',
            latitude: '', 
            longitude: '',
            markers: []
        };
    },
    onLoad(options) {
        this.classid = decodeURIComponent(options.classid || '');
        this.duration = decodeURIComponent(options.duration || '');
        this.getCurrentLocation();
    },
    methods: {
        getCurrentLocation() {
            uni.showLoading({ title: '获取位置中...', mask: true });
            wx.getLocation({
                type: 'gcj02',
                isHighAccuracy: true,
                success: (res) => {
                    this.latitude = res.latitude;
                    this.longitude = res.longitude;
                    this.updateMarkers();
                    uni.hideLoading();
                    uni.showToast({ title: '定位成功', icon: 'success' });
                },
                fail: (err) => {
                    console.error('获取位置失败:', err);
                    uni.hideLoading();
                    uni.showModal({
                        title: '定位失败',
                        content: '请检查是否授予定位权限，或手动选择位置',
                        showCancel: false
                    });
                }
            });
        },
        handleMapTap(e) {
            this.latitude = e.detail.latitude;
            this.longitude = e.detail.longitude;
            this.updateMarkers();
            uni.showToast({ title: '已选择新位置', icon: 'none', duration: 1000 });
        },
        updateMarkers() {
            this.markers = [{
                id: 1,
                latitude: this.latitude,
                longitude: this.longitude,
                title: '签到点',
                callout: {
                    content: '签到位置',
                    color: '#07C160',
                    fontSize: 14,
                    borderRadius: 10,
                    padding: 5,
                    display: 'ALWAYS'
                }
            }];
        },
        Launch() {
            uni.showLoading({ title: '发起签到中...', mask: true });
            wx.cloud.callContainer({
                config: { env: 'prod-7glwxii4e6eb93d8' },
                path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${this.duration}&method=GPS&longitude=${this.longitude}&latitude=${this.latitude}`,
                header: {
                    'X-WX-SERVICE': 'clockin',
                    'content-type': 'application/json'
                },
                method: 'POST',
                success: (res) => {
                    uni.hideLoading();
                    uni.showToast({ title: '签到已发起', icon: 'success' });
                    setTimeout(() => uni.navigateBack(), 1500);
                },
                fail: (err) => {
                    console.error('请求失败:', err);
                    uni.hideLoading();
                    uni.showModal({
                        title: '发起失败',
                        content: '网络异常，请稍后重试',
                        showCancel: false
                    });
                }
            });
        }
    }
};
</script>

<style>
.container {
    padding: 32rpx;
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-sizing: border-box;
    background-color: #f5f7fa;
}

.header {
    margin-bottom: 24rpx;
    padding: 16rpx 0;
}

.title {
    font-size: 42rpx;
    font-weight: 600;
    display: block;
    color: #333;
    letter-spacing: 0.5rpx;
}

.subtitle {
    font-size: 28rpx;
    color: #666;
    display: block;
    margin-top: 8rpx;
}

.map-container {
    width: 100%;
    height: 60vh;
    border-radius: 24rpx;
    margin: 24rpx 0;
    box-shadow: 0 8rpx 24rpx rgba(0,0,0,0.1);
    overflow: hidden;
    border: 1rpx solid #e0e6ed;
}

.location-info {
    display: flex;
    flex-direction: column;
    padding: 20rpx;
    background-color: #f0f9f5;
    border-radius: 16rpx;
    margin: 16rpx 0 24rpx;
    border-left: 6rpx solid #07C160;
}

.location-dot {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    background-color: #07C160;
    margin-right: 12rpx;
    box-shadow: 0 0 12rpx rgba(7,193,96,0.3);
    position: absolute;
}

.location-text {
    font-size: 28rpx;
    color: #07C160;
    font-weight: 500;
    margin-left: 36rpx;
}

.location-coord {
    font-size: 24rpx;
    color: #666;
    margin-top: 8rpx;
    margin-left: 36rpx;
    font-family: monospace;
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-top: auto;
    padding: 12rpx 0;
}

.btn {
    border-radius: 16rpx;
    font-size: 32rpx;
    height: 100rpx;
    line-height: 100rpx;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 16rpx rgba(0,0,0,0.08);
    border: none;
    position: relative;
    overflow: hidden;
}

.btn-icon {
    margin-right: 12rpx;
    font-size: 36rpx;
}

.btn.primary {
    background: linear-gradient(135deg, #07C160, #05a854);
    color: white;
    letter-spacing: 1rpx;
    font-weight: 500;
}

.btn.primary:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 12rpx rgba(7,193,96,0.3);
}

.btn.secondary {
    background-color: white;
    color: #07C160;
    border: 1rpx solid #e0e0e0;
    font-weight: 500;
}

.btn.secondary:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    background-color: #f5f5f5;
}

.btn::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.2);
    opacity: 0;
    transition: opacity 0.2s;
}

.btn:active::after {
    opacity: 1;
}
</style>