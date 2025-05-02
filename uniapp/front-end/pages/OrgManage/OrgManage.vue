<template>
    <view class="container">
        <!-- 主内容区 -->
        <view class="content">
            <!-- 选择班级卡片 -->
            <view class="card">
                <view class="card-title">选择管理班级</view>
                <picker
                    :range="this.$globalData.manageInfo_name"
                    @change="onPickerChange"
                    aria-label="选择班级"
                >
                    <view class="picker">
                        {{ selectedName || '请点击选择班级' }}
                        <uni-icons type="right" size="20" color="#007AFF"></uni-icons>
                    </view>
                </picker>
            </view>

            <!-- 功能菜单网格 -->
            <view class="menu-grid">
                <view class="menu-item" @click="navigateTo('addMember')" aria-label="增加成员">
                    <text class="menu-emoji">🧑‍🤝‍🧑</text>
                    <text>增加成员</text>
                </view>
                <view class="menu-item" @click="navigateTo('checkMember')" aria-label="查询成员">
                    <text class="menu-emoji">🔍</text>
                    <text>查询成员</text>
                </view>
                <view class="menu-item" @click="handleDeleteOrg" aria-label="删除成员">
                    <text class="menu-emoji">🗑️</text>
                    <text>删除组织</text>
                </view>
                <view class="menu-item" @click="navigateTo('leaveApproval')" aria-label="请假审核">
                    <text class="menu-emoji">📝</text>
                    <text>请假审核</text>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            selectedName: '',
            classid: ''
        };
    },
    methods: {
        onPickerChange(e) {
            const index = e.detail.value;
            this.selectedName = this.$globalData.manageInfo_name[index];
            this.classid = this.$globalData.manage_information[index];
        },
        navigateTo(page) {
            if (!this.classid) {
                uni.showToast({
                    title: '请先选择班级',
                    icon: 'none',
                    duration: 1500
                });
                return;
            }
            uni.navigateTo({
                url: `/pages/${page}/${page}?classid=${encodeURIComponent(this.classid)}`
            });
        },
        handleDeleteOrg() {
            if (!this.classid) {
                uni.showToast({
                    title: '请先选择要删除的班级',
                    icon: 'none',
                    duration: 1500
                });
                return;
            }

            uni.showModal({
                title: '警告',
                content: `确定要删除班级【${this.selectedName}】吗？此操作将删除所有成员和签到记录，且不可恢复！`,
                confirmText: '确认删除',
                confirmColor: '#FF3B30',
                cancelText: '取消',
                success: (res) => {
                    if (res.confirm) {
                        this.deleteOrganization();
                    }
                }
            });
        },
        async deleteOrganization() {
            uni.showLoading({
                title: '正在删除...',
                mask: true
            });

            try {
                const res = await wx.cloud.callContainer({
                    config: {
                        env: 'prod-7glwxii4e6eb93d8'
                    },
                    path: `/classMember/deleteAll/${encodeURIComponent(this.classid)}`,
                    header: {
                        'X-WX-SERVICE': 'query',
                        'content-type': 'application/json'
                    },
                    method: 'GET'
                });

                if (res && res.data) {
                    const result = res.data;
                    await this.deleteManageBelong();
                    if (result.deletedClassMemberIds && result.deletedClassMemberIds.length > 0) {
                        await this.deleteMembersBelong(result.deletedClassMemberIds);
                    }

                    uni.hideLoading();

                    uni.showModal({
                        title: '删除成功',
                        content: `已删除班级 ${result.deletedClassId}\n删除成员: ${result.membersDeleted}人\n删除签到记录: ${result.checkinRecordsDeleted}条`,
                        showCancel: false,
                        success: () => {
                            const index = this.$globalData.manage_information.indexOf(this.classid);
                            if (index !== -1) {
                                this.$globalData.manage_information.splice(index, 1);
                                this.$globalData.manageInfo_name.splice(index, 1);
                            }
                            this.selectedName = '';
                            this.classid = '';
                        }
                    });
                } else {
                    throw new Error('返回数据格式不正确');
                }
            } catch (err) {
                uni.hideLoading();
                console.error('删除失败:', err);
                uni.showModal({
                    title: '删除失败',
                    content: err.message || '网络异常，请稍后重试',
                    showCancel: false
                });
            }
        },
        async deleteMembersBelong(memberIds) {
            try {
                const deletePromises = memberIds.map(id =>
                    this.deleteBelong(id).catch(e => {
                        console.error(`删除成员 ${id} 归属记录失败:`, e);
                        return null;
                    })
                );
                await Promise.all(deletePromises);
                console.log('所有成员归属记录删除完成');
            } catch (err) {
                console.error('删除成员归属记录时出错:', err);
                throw err;
            }
        },
        async deleteManageBelong() {
            try {
                await wx.cloud.callContainer({
                    config: {
                        env: 'prod-7glwxii4e6eb93d8'
                    },
                    path: `/deleteManageBelong?id=${encodeURIComponent(this.$globalData.username)}&targetBelong=${encodeURIComponent(this.classid)}`,
                    header: {
                        'X-WX-SERVICE': 'userinfo',
                        'content-type': 'application/json'
                    },
                    method: 'DELETE'
                });
                console.log('管理员归属删除成功');
            } catch (err) {
                console.error('管理员归属删除失败:', err);
                throw err;
            }
        },
        async deleteBelong(id) {
            try {
                await wx.cloud.callContainer({
                    config: {
                        env: 'prod-7glwxii4e6eb93d8'
                    },
                    path: `/deleteBelong?id=${encodeURIComponent(id)}&targetBelong=${encodeURIComponent(this.classid)}`,
                    header: {
                        'X-WX-SERVICE': 'userinfo',
                        'content-type': 'application/json'
                    },
                    method: 'DELETE'
                });
                console.log(`学生 ${id} 归属删除成功`);
            } catch (err) {
                console.error(`学生 ${id} 归属删除失败:`, err);
                throw err;
            }
        }
    }
};
</script>
<style>
/* 基础样式 */
page {
    height: 100%;
    background: linear-gradient(180deg, #f5f7fa 0%, #e4e9f0 100%); /* 统一渐变背景 */
}

/* 容器 */
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

/* 内容区域 */
.content {
    flex: 1;
    padding: 40rpx;
    overflow-y: auto;
}

/* 卡片样式 */
.card {
    background: #ffffff;
    border-radius: 24rpx; /* 更大圆角 */
    padding: 32rpx;
    margin-bottom: 32rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1); /* 柔和阴影 */
}

/* 卡片标题 */
.card-title {
    font-size: 32rpx;
    color: #333333;
    margin-bottom: 24rpx;
    font-weight: 500;
}

/* 选择器样式 */
.picker {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx;
    border-radius: 12rpx;
    background: #f8f8f8;
    font-size: 32rpx;
    color: #333333;
    transition: all 0.3s;
}

.picker:hover {
    background: #f0faff;
    box-shadow: 0 0 12rpx rgba(0, 122, 255, 0.3); /* 悬停阴影 */
}

.picker:active {
    background: #e6f0ff;
}

/* 菜单网格 */
.menu-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32rpx;
    margin-bottom: 32rpx;
}

/* 菜单项 */
.menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.menu-item:hover {
    transform: translateY(-8rpx); /* 悬停上移 */
    box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.15);
    background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%); /* 微妙渐变 */
}

.menu-item:active {
    transform: scale(0.98);
    background: #f0faff;
}

.menu-emoji {
    font-size: 48rpx; /* 增大表情符号 */
    margin-bottom: 16rpx;
}

.menu-item text {
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
}

/* 响应式调整 */
@media screen and (max-width: 600rpx) {
    .content {
        padding: 32rpx;
    }
    .card {
        padding: 24rpx;
        border-radius: 16rpx;
    }
    .card-title {
        font-size: 28rpx;
    }
    .picker {
        padding: 24rpx;
        font-size: 28rpx;
    }
    .menu-grid {
        gap: 24rpx;
    }
    .menu-item {
        padding: 24rpx;
        border-radius: 16rpx;
    }
    .menu-emoji {
        font-size: 40rpx;
    }
    .menu-item text {
        font-size: 28rpx;
    }
}
</style>