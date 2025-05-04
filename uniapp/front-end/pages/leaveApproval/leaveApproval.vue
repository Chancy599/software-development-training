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
                            <text class="time">签到发起时间: {{ item.start_time }}</text>
                        </view>
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
                        class_id: this.class_id,
                        start_time: item.start_time
                    }
                });
                console.log('后端返回数据:', res);
                
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
/* 整体容器样式 */
.container {
    padding: 1.5rem;
    min-height: 100vh;
    box-sizing: border-box;
    background-color: #f6f9fc;
    font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
    color: #334155;
}

/* 标题栏样式 */
.header {
    margin-bottom: 1.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid #e2e8f0;
}

.title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e40af;
    letter-spacing: 0.025em;
    text-align: center;
}

/* 列表滚动区域样式 */
.list-scroll {
    height: calc(100vh - 100px);
}

/* 加载状态样式 */
.loading-state {
    text-align: center;
    padding: 2.5rem 0;
}

/* 空状态样式 */
.empty-state {
    text-align: center;
    padding: 3rem 0;
    color: #64748b;
    font-size: 1.125rem;
    font-weight: 500;
}

/* 请假申请卡片样式 */
.reason-list {
    display: grid;
    gap: 1.75rem;
}

.reason-card {
    background-color: #ffffff;
    border-radius: 1rem;
    padding: 1.75rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03);
    transition: all 0.3s ease;
    border-left: 4px solid #3b82f6;
}

.reason-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 申请人信息样式 */
.user-section {
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px dashed #e2e8f0;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
}

.id {
    font-size: 1rem;
    color: #64748b;
    font-weight: 500;
}

.time {
    font-size: 0.9375rem;
    color: #94a3b8;
    margin-top: 0.25rem;
}

/* 请假原因样式 */
.reason-section {
    margin-bottom: 1.25rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px dashed #e2e8f0;
}

.label {
    font-size: 1.0625rem;
    font-weight: 600;
    color: #475569;
    margin-right: 0.5rem;
    display: block;
    margin-bottom: 0.375rem;
}

.content {
    font-size: 1.0625rem;
    color: #334155;
    line-height: 1.5;
    padding-left: 0.375rem;
    display: block;
}

/* 证明材料样式 */
.photo-section {
    margin-bottom: 1.5rem;
}

.proof-image {
    width: 100%;
    max-height: 220px;
    object-fit: cover;
    border-radius: 0.75rem;
    margin-top: 0.625rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
}

.no-photo {
    font-size: 0.9375rem;
    color: #94a3b8;
    font-style: italic;
    display: block;
    padding: 0.625rem;
    background-color: #f8fafc;
    border-radius: 0.5rem;
    margin-top: 0.375rem;
    text-align: center;
}

/* 操作按钮样式 */
.action-section {
    display: flex;
    justify-content: flex-end;
    gap: 1.25rem;
    margin-top: 0.75rem;
}

.btn-approve,
.btn-reject {
    padding: 0.625rem 1.5rem;
    border-radius: 0.625rem;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
}

.btn-approve {
    background-color: #ecfdf5;
    color: #059669;
    box-shadow: 0 1px 2px 0 rgba(5, 150, 105, 0.1);
}

.btn-approve:hover {
    background-color: #d1fae5;
    transform: translateY(-2px);
}

.btn-reject {
    background-color: #fef2f2;
    color: #dc2626;
    box-shadow: 0 1px 2px 0 rgba(220, 38, 38, 0.1);
}

.btn-reject:hover {
    background-color: #fee2e2;
    transform: translateY(-2px);
}
</style>