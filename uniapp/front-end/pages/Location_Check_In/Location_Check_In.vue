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
            latitude: 0,
            longitude: 0
        };
    },
    mounted() {
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
        }
    }
};
</script>

<style>
button {
    margin-top: 20px;
}
</style>