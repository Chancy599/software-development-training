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
		
        <view class="button-group">
            <button @click="getCurrentLocation" class="btn secondary">重新定位</button>
            <button @click="Launch" class="btn primary">发起签到</button>
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
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-sizing: border-box;
}

.header {
    margin-bottom: 20rpx;
    padding: 20rpx 0;
}

.title {
    font-size: 36rpx;
    font-weight: bold;
    display: block;
}

.subtitle {
    font-size: 26rpx;
    color: #888;
    display: block;
    margin-top: 10rpx;
}

.map-container {
    width: 100%;
    height: 60vh;
    border-radius: 16rpx;
    margin: 20rpx 0;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-top: auto;
}

.btn {
    border-radius: 12rpx;
    font-size: 32rpx;
    height: 90rpx;
    line-height: 90rpx;
    transition: all 0.2s;
}

.btn.primary {
    background-color: #07C160;
    color: white;
}

.btn.secondary {
    background-color: white;
    color: #07C160;
    border: 1rpx solid #07C160;
}

.btn:active {
    opacity: 0.8;
    transform: scale(0.98);
}
</style>