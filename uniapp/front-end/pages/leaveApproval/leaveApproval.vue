<template>
    <view class="container">
        <!-- 标题栏 -->
        <view class="header">
            <text class="title">请假审批列表</text>
        </view>

        <!-- 列表内容 -->
        <scroll-view scroll-y class="list-scroll">
            <view v-if="loading" class="loading-state">
                <uni-load-more status="loading"></uni-load-more>
            </view>

            <view v-else-if="reasons.length === 0" class="empty-state">
                <image src="/static/empty.png" mode="aspectFit"></image>
                <text>暂无待审批的请假申请</text>
            </view>

            <view v-else class="reason-list">
                <view 
                    v-for="(item, index) in reasons" 
                    :key="item.reason_id" 
                    class="reason-card"
                >
                    <!-- 申请人信息 -->
                    <view class="user-section">
                        <view class="user-info">
                            <text class="name">姓名: {{ item.sender_name }}</text>
                            <text class="id">学号: {{ item.sender_id }}</text>
                        </view>
                        <text class="time">{{ item.start_time }}</text>
                    </view>

                    <!-- 请假原因 -->
                    <view class="reason-section">
                        <text class="label">请假原因:</text>
                        <text class="content">{{ item.word || '无说明' }}</text>
                    </view>

                    <!-- 证明材料 -->
                    <view class="photo-section" v-if="item.photo_path">
                        <text class="label">证明材料:</text>
                        <image 
                            :src="item.photo_path" 
                            mode="widthFix" 
                            class="proof-image"
                            @click="previewCloudImage(item.photo_path)"
                        ></image>
                    </view>
                    <view class="photo-section" v-else>
                        <text class="no-photo">未上传证明材料</text>
                    </view>

                    <!-- 操作按钮 -->
                    <view class="action-section">
                        <button @click="approve(item)" class="btn-approve">同意</button>
                        <button @click="reject(item)" class="btn-reject">拒绝</button>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            class_id: '',
            reasons: [],
            loading: false
        }
    },
    onLoad(options) {
        this.class_id = decodeURIComponent(options.classid || '');
        this.loadData();
    },
    methods: {
        // 加载数据
        async loadData() {
            this.loading = true;
            try {
                const res = await wx.cloud.callContainer({
                    config: { env: 'prod-7glwxii4e6eb93d8' },
                    path: `/GetReason?class_id=${encodeURIComponent(this.class_id)}`,
                    header: {
                        'X-WX-SERVICE': 'reason',
                        'content-type': 'application/json'
                    },
                    method: 'GET'
                });
                this.reasons = res.data || [];
            } catch (err) {
                console.error('加载失败:', err);
                uni.showToast({
                    title: '加载失败: ' + (err.errMsg || '网络错误'),
                    icon: 'none'
                });
            } finally {
                this.loading = false;
            }
        },

        async previewCloudImage(cloudPath) {
            uni.showLoading({ title: '加载中...', mask: true });
            try {
                // 获取临时可访问URL
                const res = await wx.cloud.getTempFileURL({
                    fileList: [cloudPath]
                });
                
                // 预览图片
                wx.previewImage({
                    current: res.fileList[0].tempFileURL,
                    urls: [res.fileList[0].tempFileURL]
                });
            } catch (err) {
                console.error('预览失败:', err);
                uni.showToast({
                    title: '文件加载失败',
                    icon: 'none'
                });
            } finally {
                uni.hideLoading();
            }
        },

        // 审批操作
        async approve(item) {
            uni.showLoading({ title: '处理中...', mask: true });
            try {
                await this.DeleteReason(item.reason_id);
                const res = await wx.cloud.callContainer({
                    config: {
                        env: 'prod-7glwxii4e6eb93d8'
                    },
                    path: `/UpdateState`,
                    header: {
                        'X-WX-SERVICE': 'reason',
                        'content-type': 'application/json'
                    },
                    method: 'PUT',
                    data: {
                        sender_id: item.sender_id,
                        class_id: item.class_id,
                        start_time: item.start_time
                    }
                });
                
                if (res.data === true) {
                    uni.showToast({ title: '审批成功', icon: 'success', duration: 1000 });
                    this.loadData();
                } else {
                    uni.showToast({ title: '审批失败', icon: 'none', duration: 1000 });
                }
            } catch (err) {
                console.error('请求失败:', err);
                uni.showToast({ title: '网络异常，请稍后重试', icon: 'none', duration: 1000 });
            }
        },

        async reject(item) {
            uni.showLoading({ title: '处理中...', mask: true });
            try {
                await this.DeleteReason(item.reason_id);
                uni.showToast({ title: '已拒绝', icon: 'success' });
                this.loadData();
            } catch (err) {
                console.error('拒绝失败:', err);
                uni.showToast({ title: '操作失败', icon: 'none' });
            }
        },
        
        async DeleteReason(reasonId) {
            try {
                const res = await wx.cloud.callContainer({
                    config: { env: 'prod-7glwxii4e6eb93d8' },
                    path: `/DeleteReason?reason_id=${encodeURIComponent(reasonId)}`,
                    header: {
                        'X-WX-SERVICE': 'reason',
                        'content-type': 'application/json'
                    },
                    method: 'DELETE'
                });
                
                return res.data === true;
            } catch (err) {
                console.error('请求失败:', err);
                throw err;
            }
        }
    }
}
</script>

<style>
.container {
    padding: 15px;
    height: 100vh;
    box-sizing: border-box;
    background-color: #f8f8f8;
}

.header {
    margin-bottom: 20px;
}

.title {
    font-size: 18px;
    font-weight: bold;
    display: block;
}

.list-scroll {
    height: calc(100vh - 100px);
}

.reason-list {
    padding-bottom: 20px;
}

.reason-card {
    background: #fff;
    border-radius: 12px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.user-section {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.user-info {
    flex: 1;
}

.name {
    font-weight: bold;
    display: block;
    margin-bottom: 2px;
}

.id {
    font-size: 12px;
    color: #999;
}

.time {
    font-size: 12px;
    color: #666;
}

.reason-section, .photo-section {
    margin-bottom: 12px;
}

.label {
    font-size: 14px;
    color: #666;
    margin-right: 8px;
}

.content {
    font-size: 15px;
    color: #333;
}

.proof-image {
    width: 100%;
    max-height: 200px;
    border-radius: 6px;
    margin-top: 8px;
    border: 1px solid #eee;
}

.no-photo {
    font-size: 12px;
    color: #999;
    font-style: italic;
}

.action-section {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.btn-approve, .btn-reject {
    margin-left: 10px;
    font-size: 14px;
    padding: 0 15px;
    height: 32px;
    line-height: 32px;
}

.btn-approve {
    background: #e1f3d8;
    color: #67c23a;
}

.btn-reject {
    background: #fde2e2;
    color: #f56c6c;
}

.loading-state, .empty-state {
    text-align: center;
    padding: 40px 0;
}

.empty-state image {
    width: 100px;
    height: 100px;
    opacity: 0.5;
    margin-bottom: 10px;
}

.empty-state text {
    display: block;
    color: #999;
}
</style>