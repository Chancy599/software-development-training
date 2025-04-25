<template>
    <view>
        <map
            :latitude="latitude"
            :longitude="longitude"
            :markers="markers"
            @tap="handleMapTap"
            style="width: 100%; height: 500px;"
        ></map>
        <button @click="getCurrentLocation">使用当前位置</button>
        <button @click="Launch">发起签到</button>
    </view>
</template>

<script>
export default {
    data() {
        return {
			classid:'',
			duration:'',
            latitude: 0,
            longitude: 0,
            markers: []
        };
    },
    onLoad() {
		this.classid = decodeURIComponent(options.classid || '');
		this.duration = decodeURIComponent(options.duration || '');
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
        },
		Launch() {
			uni.showToast({
			    title: '定位签到已发起',
			    icon: 'success'
			});
			wx.cloud.callContainer({
				config: {
					env: 'prod-7glwxii4e6eb93d8' // 云托管环境ID
				},
				path: `/api/checkins/start?classId=${encodeURIComponent(this.classid)}&duration=${encodeURIComponent(this.duration)}&method=GPS&longitude=${encodeURIComponent(this.longitude)}&latitude=${encodeURIComponent(this.latitude)}`,
				header: {
					'X-WX-SERVICE': 'clockin',
					'content-type': 'application/json'
				},
				method: 'POST',
				success: (res) => {
					console.log('后端返回数据:', res);
				},
				fail: (err) => {
					console.error('请求失败:', err);
					uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
				}
			});
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