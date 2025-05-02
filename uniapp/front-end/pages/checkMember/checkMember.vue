<template>
    <view class="container">
        <!-- 页面标题 -->
        <view class="page-title">成员列表</view>
        <!-- 成员列表 -->
        <view class="member-list">
            <view v-if="loading" class="loading">
                <text>加载中...</text>
            </view>

            <view v-else-if="members.length === 0" class="empty">
                <text>暂无成员数据</text>
            </view>

            <view v-else>
                <view 
                    v-for="(member, index) in members" 
                    :key="index" 
                    class="member-item"
                >
                    <view class="member-info">
                        <text class="member-id">{{ member.id }}</text>
                        <text class="member-name">{{ member.name }}</text>
                    </view>
                    <view class="button-group">
                        <button 
                            class="detail-btn" 
                            @click="goToDetail(member.id)"
                            :style="{ transform: 'scale(' + (buttonScale === member.id ? '0.95' : '1') + ')' }"
                            @touchstart="handleButtonTouchStart(member.id)"
                            @touchend="handleButtonTouchEnd(member.id)"
                        >
                            查看
                        </button>
                        <button 
                            class="delete-btn"
                            @click="deleteMember(member.id)"
                            :style="{ transform: 'scale(' + (buttonScale === member.id ? '0.95' : '1') + ')' }"
                            @touchstart="handleButtonTouchStart(member.id)"
                            @touchend="handleButtonTouchEnd(member.id)"
                        >
                            删除
                        </button>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            classid: '',
            members: [],
            loading: false,
            buttonScale: null
        };
    },
    onLoad(options) {
        this.classid = decodeURIComponent(options.classid || '');
        this.fetchMembers();
    },
    methods: {
        async fetchMembers() {
            this.loading = true;
            try {
                const res = await wx.cloud.callContainer({
                    config: { env: 'prod-7glwxii4e6eb93d8' },
                    path: `/classMember/query/${encodeURIComponent(this.classid)}`,
                    header: {
                        'X-WX-SERVICE': 'query',
                        'content-type': 'application/json'
                    },
                    method: 'GET'
                });

                this.members = res.data || [];
            } catch (err) {
                console.error('查询失败:', err);
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            } finally {
                this.loading = false;
            }
        },

        goToDetail(userid) {
            uni.navigateTo({
                url: `/pages/checkMember_Plus/checkMember_Plus?classid=${encodeURIComponent(this.classid)}&userid=${encodeURIComponent(userid)}`
            });
        },

        async deleteMember(id) {
            const confirmRes = await new Promise((resolve) => {
                uni.showModal({
                    title: '确认删除',
                    content: '确定要删除该学生吗？',
                    success: resolve
                });
            });

            if (!confirmRes.confirm) {
                return;
            }

            uni.showLoading({ title: '删除中...' });

            try {
                // 第一个删除请求：删除 classMember
                await wx.cloud.callContainer({
                    config: { env: 'prod-7glwxii4e6eb93d8' },
                    path: `/classMember/delete/${encodeURIComponent(this.classid)}`,
                    header: {
                        'X-WX-SERVICE': 'query',
                        'content-type': 'application/json'
                    },
                    method: 'DELETE',
                    data: {
                        studentIds: [id]
                    }
                });

                // 第二个删除请求：删除归属关系
                await wx.cloud.callContainer({
                    config: { env: 'prod-7glwxii4e6eb93d8' },
                    path: `/deleteBelong?id=${encodeURIComponent(id)}&targetBelong=${encodeURIComponent(this.classid)}`,
                    header: {
                        'X-WX-SERVICE': 'userinfo',
                        'content-type': 'application/json'
                    },
                    method: 'DELETE'
                });

                uni.showToast({
                    title: '成功删除该学生',
                    icon: 'success'
                });

                await this.fetchMembers(); // 刷新成员列表
            } catch (err) {
                console.error('删除失败:', err);
                uni.showToast({
                    title: '删除失败: ' + (err.errMsg || '网络异常'),
                    icon: 'none'
                });
            } finally {
                uni.hideLoading();
            }
        },

        handleButtonTouchStart(id) {
            this.buttonScale = id;
        },

        handleButtonTouchEnd() {
            this.buttonScale = null;
        }
    }
};
</script>

<style>
.container {
    padding: 20px;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.page-title {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
}

.member-list {
    margin-top: 12px;
}

.member-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
    transition: transform 0.2s, box-shadow 0.2s;
}

.member-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.member-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.member-id {
    color: #666;
    font-size: 14px;
}

.member-name {
    color: #333;
    font-size: 16px;
    font-weight: 500;
}

.button-group {
    display: flex;
    gap: 10px;
}

.detail-btn {
    background-color: #007aff;
    color: white;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    transition: background-color 0.2s, transform 0.2s;
}

.detail-btn:hover {
    background-color: #005ecb;
}

.delete-btn {
    background-color: #ff3b30;
    color: white;
    font-size: 14px;
    padding: 8px 16px;
    border-radius: 6px;
    border: none;
    transition: background-color 0.2s, transform 0.2s;
}

.delete-btn:hover {
    background-color: #d32f2f;
}

.loading, .empty {
    text-align: center;
    padding: 60px 0;
    color: #999;
    font-size: 16px;
}
</style>
