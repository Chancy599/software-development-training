export default {
  methods: {
    fetchUserInfo() {
      const username = this.$globalData.username;
      wx.cloud.callContainer({
        config: {
          env: 'prod-7glwxii4e6eb93d8'
        },
        path: `/getInfo?id=${encodeURIComponent(username)}`,
        header: {
          'X-WX-SERVICE': 'userinfo',
          'content-type': 'application/json'
        },
        method: 'GET',
        success: (res) => {
          if (res.data) {
            this.$globalData.name = res.data.name || '';
            this.$globalData.gender = res.data.gender || '';
            this.$globalData.contact_information = res.data.contact_information || '';
            this.$globalData.belong_information = res.data.belong_information || [];
            this.$globalData.manage_information = res.data.manage_information || [];
            this.$globalData.belong_name = res.data.belong_name || [];
            this.$globalData.manage_name = res.data.manage_name || [];
          } else {
            uni.showToast({ title: '获取用户信息失败', icon: 'none' });
          }
        },
        fail: (err) => {
          console.error('请求失败:', err);
          uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
        }
      });
    }
  },
  onPullDownRefresh() {
    this.fetchUserInfo();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 500);
  }
}
