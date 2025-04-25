<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
				wx.cloud.init({
				env: 'prod-7glwxii4e6eb93d8', // 你的云托管环境 ID
				traceUser: true
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
