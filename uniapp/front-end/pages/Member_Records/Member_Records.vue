<template>
    <view>
        <!-- 选择班级 -->
        <picker :range="this.$globalData.manageInfo_name" @change="onPickerChange">
            <view class="picker">
                选择班级：{{ selectedName || '请选择' }}
            </view>
        </picker>

        <!-- 查询按钮 -->
        <view class="btn-area">
            <button type="primary" @click="EnterClassToSelectUser">查询成员签到情况</button>
        </view>

        <!-- 成员签到汇总 -->
        <view v-if="studentList.length > 0">
            <view class="summary">班级总人数：{{ total }}</view>
            <view class="record" v-for="(item, index) in studentList" :key="index">
                <view>姓名：{{ item.name }}</view>
                <view>学号：{{ item.userId }}</view>
                <view>准时：{{ item.in_TIME }} | 迟到：{{ item.late }} | 未到：{{ item.absent }} | 请假：{{ item.request_LEAVE }}</view>
                <view class="detail-link-wrap" @click="goToDetail(item.userId)">
                    <text class="detail-link">查看详情</text>
                </view>
            </view>
        </view>

        <view v-else-if="queried">暂无签到数据</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                selectedName: '',
                classid: '',
                total: 0,
                studentList: [],
                queried: false
            }
        },
        methods: {
            onPickerChange(e) {
                const index = e.detail.value;
                this.selectedName = this.$globalData.manageInfo_name[index];
                this.classid = this.$globalData.manage_information[index];
            },
            EnterClassToSelectUser() {
                if (!this.classid) {
                    uni.showToast({ title: '请先选择班级', icon: 'none' });
                    return;
                }
                uni.showLoading({ title: '加载中...' });
                wx.cloud.callContainer({
                    config: {
                        env: 'prod-7glwxii4e6eb93d8'
                    },
                    path: `/EnterClassToSelectUser/${encodeURIComponent(this.classid)}`,
                    header: {
                        'X-WX-SERVICE': 'query',
                        'content-type': 'application/json'
                    },
                    method: 'GET',
                    success: (res) => {
                        uni.hideLoading();
                        console.log('后端返回数据:', res);
                        if (res.data) {
                            this.total = res.data.total || 0;
                            this.studentList = res.data.students || [];
                        } else {
                            this.total = 0;
                            this.studentList = [];
                            uni.showToast({ title: '该班级无签到数据', icon: 'none' });
                        }
                        this.queried = true;
                    },
                    fail: (err) => {
                        uni.hideLoading();
                        console.error('请求失败:', err);
                        uni.showToast({ title: '网络异常，请稍后重试', icon: 'none' });
                    }
                });
            },
            goToDetail(userId) {
                uni.navigateTo({
                    url: `/pages/Member_Records_Plus/Member_Records_Plus?classid=${encodeURIComponent(this.classid)}&userId=${encodeURIComponent(userId)}`
                });
            }
        }
    }
</script>

<style scoped>
.picker {
    padding: 16rpx;
    border: 1px solid #ccc;
    border-radius: 8rpx;
    margin: 20rpx 0;
}

.btn-area {
    margin: 20rpx 0;
    text-align: center;
}

.summary {
    font-weight: bold;
    margin-bottom: 20rpx;
}

.record {
    padding: 20rpx;
    border-bottom: 1px solid #eee;
    font-size: 28rpx;
}

.detail-link-wrap {
    color: #007aff;
    cursor: pointer;
}

.detail-link {
    text-decoration: underline;
}
</style>
    