<template>
    <view class="container">
        <view class="header">
            <text class="title">定位签到</text>
            <text class="subtitle">请确认您的当前位置</text>
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
            <view class="location-icon">
                <uni-icons type="location-filled" size="20" color="#07C160"></uni-icons>
            </view>
            <view class="location-details">
                <text class="location-status">当前位置已确认</text>
                <text class="location-coord">经度: {{longitude.toFixed(6)}} 纬度: {{latitude.toFixed(6)}}</text>
            </view>
        </view>
        
        <button @click="checkIn" class="checkin-btn">
            <uni-icons type="checkbox-filled" size="20" color="#fff"></uni-icons>
            <text>立即签到</text>
        </button>
    </view>
</template>

<script>
export default {
    data() {
        return {
            classId: '',
            startTime: '',
            latitude: '',
            longitude: '',
            markers: []
        };
    },
    onLoad(options) {
        this.classId = decodeURIComponent(options.classId || '');
        this.startTime = decodeURIComponent(options.startTime || '');
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
            uni.showToast({ title: '已更新位置', icon: 'none' });
        },
        updateMarkers() {
            this.markers = [{
                id: 0,
                latitude: this.latitude,
                longitude: this.longitude,
                iconPath: '/static/location-marker.png',
                width: 40,
                height: 40,
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
        checkIn() {
            uni.showLoading({ title: '签到中...', mask: true });
            wx.cloud.callContainer({
                config: { env: 'prod-7glwxii4e6eb93d8' },
                path: `/api/checkins/verify`,
                header: {
                    'X-WX-SERVICE': 'clockin',
                    'content-type': 'application/json'
                },
                method: 'POST',
                data: {
                    userId: this.$globalData.username,
                    classId: this.classId,
                    startTime: this.startTime,
                    method: 'GPS',
                    params: {
                        longitude: this.longitude,
                        latitude: this.latitude
                    }
                },
                success: (res) => {
                    console.log('定位签到返回:', res);
                    if (res.data.success === true) {
                        this.commit(this.classId, this.startTime);
                    } else {
                        uni.hideLoading();
                        uni.showModal({
                            title: '签到失败',
                            content: res.data.message || '签到验证未通过',
                            showCancel: false
                        });
                    }
                },
                fail: (err) => {
                    console.error('签到失败:', err);
                    uni.hideLoading();
                    uni.showModal({
                        title: '签到失败',
                        content: '网络异常，请稍后重试',
                        showCancel: false
                    });
                }
            });
        },
        commit(classId, startTime) {
            wx.cloud.callContainer({
                config: { env: 'prod-7glwxii4e6eb93d8' },
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
                    uni.hideLoading();
                    console.log('后端返回数据:', res);
                    if (res.data && res.data.state) {
                        if (res.data.state === 'IN_TIME') {
                            uni.showModal({
                                title: '签到成功',
                                content: '您已准时签到！',
                                showCancel: false,
                                success: () => {
                                    uni.navigateBack();
                                }
                            });
                        } else if (res.data.state === 'LATE') {
                            uni.showModal({
                                title: '签到提示',
                                content: '您已迟到，请下次注意时间。',
                                showCancel: false,
                                success: () => {
                                    uni.navigateBack();
                                }
                            });
                        }
                    }
                },
                fail: (err) => {
                    uni.hideLoading();
                    console.error('请求失败:', err);
                    uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
                }
            });
        }
    }
};
</script>

<style>
.container {
    padding: 24rpx;
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-sizing: border-box;
    background-color: #f8f8f8;
}

.header {
    margin-bottom: 24rpx;
    padding: 16rpx 0;
}

.title {
    font-size: 40rpx;
    font-weight: 600;
    display: block;
    color: #333;
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
    border-radius: 16rpx;
    margin: 20rpx 0;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.location-info {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #f0f9f5;
    border-radius: 12rpx;
    margin: 16rpx 0 24rpx;
    border-left: 6rpx solid #07C160;
}

.location-icon {
    margin-right: 16rpx;
}

.location-details {
    display: flex;
    flex-direction: column;
}

.location-status {
    font-size: 28rpx;
    color: #07C160;
    font-weight: 500;
}

.location-coord {
    font-size: 24rpx;
    color: #666;
    margin-top: 4rpx;
    font-family: monospace;
}

.checkin-btn {
    background-color: #07C160;
    color: white;
    height: 96rpx;
    line-height: 96rpx;
    border-radius: 16rpx;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 24rpx;
    box-shadow: 0 4rpx 12rpx rgba(7, 193, 96, 0.3);
    transition: all 0.2s;
}

.checkin-btn:active {
    opacity: 0.9;
    transform: translateY(2rpx);
}

.checkin-btn text {
    margin-left: 12rpx;
}
</style>