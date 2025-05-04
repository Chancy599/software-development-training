<template>
    <view>
        <map
            :latitude="latitude"
            :longitude="longitude"
            :markers="markers"
            style="width: 100%; height: 500px;"
        ></map>
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
        updateMarkers() {
            this.markers = [{
                id: 0,
                latitude: this.latitude,
                longitude: this.longitude,
                width: 40,
                height: 40
            }];
        },
        checkIn() {
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
                    }
                },
                fail: (err) => {
                    console.error('签到失败:', err);
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
								content: '您已迟到，请下次注意时间。',
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
};
</script>

<style>
button {
    margin-top: 20px;
}
</style>
