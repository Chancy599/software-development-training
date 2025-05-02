<template>
    <view>
        <map
            :latitude="latitude"
            :longitude="longitude"
            :markers="[{ latitude, longitude }]"
            style="width: 100%; height: 500px;"
        ></map>
        <view><text>纬度: {{ latitude }}</text></view>
        <view><text>经度: {{ longitude }}</text></view>
        <button @click="checkIn">签到</button>
    </view>
</template>

<script>
export default {
    data() {
        return {
			classId: '',
			startTime: '',
            latitude: '',
            longitude: ''
        };
    },
    onLoad() {
		this.classId = decodeURIComponent(options.classId || '');
		this.startTime = decodeURIComponent(options.startTime || '');
        this.getLocation();
    },
    methods: {
        getLocation() {
            wx.getLocation({
                type: 'gcj02', // 适用于微信地图
                isHighAccuracy: true, // 高精度模式
                success: (res) => {
                    this.latitude = res.latitude;
                    this.longitude = res.longitude;
                },
                fail: (err) => {
                    console.error('获取位置失败:', err);
                }
            });
        },
		checkIn(classId, startTime) {
			wx.cloud.callContainer({
				config: { env: 'prod-7glwxii4e6eb93d8' },
				path: `/api/checkins/verify?userId=${encodeURIComponent(this.$globalData.username)}&classId=${encodeURIComponent(classId)}&startTime=${encodeURIComponent(startTime)}&method=GPS&longitude=${encodeURIComponent(this.longitude)}&latitude=${encodeURIComponent(this.latitude)}`,
				header: {
					'X-WX-SERVICE': 'clockin',
					'content-type': 'application/json'
				},
				method: 'POST',
				success: (res) => {
					console.log('定位签到返回:', res);
					if(res.data === true) {
						uni.showToast({ title: '签到成功', icon: 'success' });
						this.commit(classId, startTime);
					}
				},
				fail: (err) => {
					console.error('签到失败:', err);
					uni.showToast({ title: '签到失败，请稍后重试', icon: 'none' });
				}
			});
		},
		commit(classId, startTime) {
			wx.cloud.callContainer({
				config: {
					env: 'prod-7glwxii4e6eb93d8'
				},
				path: `//api/checkins/commit?userId=${encodeURIComponent(this.$globalData.username)}&classId=${encodeURIComponent(classId)}&startTime=${encodeURIComponent(startTime)}`,
				header: {
					'X-WX-SERVICE': 'clockin',
					'content-type': 'application/json'
				},
				method: 'GET',
				success: (res) => {
					console.log('后端返回数据:', res);
					if (res.data && res.data.state) {
						if (res.data.state === 'IN_TIME') {
							uni.showToast({ title: '准时', icon: 'success', duration: 1000 });
						} else if (res.data.state === 'LATE') {
							uni.showToast({ title: '迟到', icon: 'none', duration: 1000 });
						}
					}
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
}
</style>