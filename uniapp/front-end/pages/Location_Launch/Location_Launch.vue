<template>
    <view>
        <map
            :latitude="latitude"
            :longitude="longitude"
            :markers="markers"
            @tap="handleMapTap"
            style="width: 100%; height: 500px;"
        ></map>
        <view><text>纬度: {{ latitude }}</text></view>
        <view><text>经度: {{ longitude }}</text></view>
        <button @click="getCurrentLocation">使用当前位置</button>
        <button @click="Launch">发起签到</button>
    </view>
</template>

<script>
export default {
    data() {
        return {
            latitude: 0,
            longitude: 0,
            markers: []
        };
    },
    onLoad() {
        this.getCurrentLocation();
    },
    methods: {
        getCurrentLocation() {
            wx.getLocation({
                type: 'gcj02', // 适用于微信地图
                isHighAccuracy: true, // 高精度模式
                success: (res) => {
                    this.latitude = res.latitude;
                    this.longitude = res.longitude;
                    this.updateMarkers();
                    wx.showToast({ title: '已获取当前位置', icon: 'success' });
                },
                fail: (err) => {
                    console.error('获取位置失败:', err);
                    wx.showToast({ title: '获取位置失败', icon: 'none' });
                }
            });
        },
        handleMapTap(e) {
            // 点击地图时更新位置
            this.latitude = e.detail.latitude;
            this.longitude = e.detail.longitude;
            this.updateMarkers();
            wx.showToast({ title: '已选择新位置', icon: 'success' });
        },
        updateMarkers() {
            this.markers = [{
                id: 1,
                latitude: this.latitude,
                longitude: this.longitude,
                title: '签到位置'
            }];
        }
    }
};
</script>

<style>
button {
    margin-top: 20px;
    width: 100%;
}
</style>