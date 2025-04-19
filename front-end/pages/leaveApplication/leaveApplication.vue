<template>
	<view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				class_id: '',
				start_time: '',
				word: '',
				photo_path: ''
			}
		},
		onLoad(options) {
		  this.class_id = decodeURIComponent(options.classId || '');
		  this.start_time = decodeURIComponent(options.startTime || '');
		},
		methods: {
			AddReason() {
				wx.cloud.callContainer({
					config: {
						env: 'prod-7glwxii4e6eb93d8' // 云托管环境ID
					},
					path: `/AddReason`,
					header: {
						'X-WX-SERVICE': 'reason',
						'content-type': 'application/json'
					},
					method: 'PUT',
					data: {
						sender_id: this.$globalData.
						password: password
					},
					success: (res) => {
						console.log('后端返回数据:', res);
						
						if (res.data === true) {
							uni.showToast({ title: '登录成功', icon: 'success', duration: 1000 });
				
							// 存入全局变量
							this.$globalData.username = username;
							
							// 设置全局变量
							this.fetchUserInfo();
				
							// 跳转主页面
							uni.navigateTo({ url: '/pages/main/main' });
						} else {
							uni.showToast({ title: '账号或密码错误', icon: 'none', duration: 1000 });
						}
					},
					fail: (err) => {
						console.error('请求失败:', err);
						uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
					}
				});
			}
		}
	}
</script>

<style>

</style>
