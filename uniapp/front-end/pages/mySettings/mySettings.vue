<template>
    <view class="container">
        <view class="profile-card">
            <view class="avatar-section">
                <image class="avatar" src="/static/user.png" mode="aspectFill"></image>
                <text class="name">{{ userData.name || '未设置' }}</text>
            </view>
            <view class="info-section">
                <view class="info-item">
                    <text class="label">账号</text>
                    <text class="value">{{ userData.id || '未设置' }}</text>
                </view>
                <view class="info-item">
                    <text class="label">性别</text>
                    <text class="value">{{ userData.gender || '未设置' }}</text>
                </view>
                <view class="info-item">
                    <text class="label">联系方式</text>
                    <text class="value">{{ userData.contact_information || '未设置' }}</text>
                </view>
                <view class="info-item">
                    <text class="label">管理组织</text>
                    <view v-if="userData.manageInfo_name?.length" class="value-group">
                        <text class="value" v-for="(item, index) in userData.manageInfo_name" :key="index">{{ item }}</text>
                    </view>
                    <text v-else class="value">暂无</text>
                </view>
                <view class="info-item">
                    <text class="label">归属组织</text>
                    <view v-if="userData.belongInfo_name?.length" class="value-group">
                        <text class="value" v-for="(item, index) in userData.belongInfo_name" :key="index">{{ item }}</text>
                    </view>
                    <text v-else class="value">暂无</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            userData: this.initUserData()
        };
    },
    created() {
        this.syncGlobalData();
    },
    methods: {
        // 初始化用户数据结构
        initUserData() {
            return {
                id: '',
                name: '',
                gender: '',
                contact_information: '',
                belongInfo_name: [],
                manageInfo_name: []
            };
        },
        // 同步全局数据
        syncGlobalData() {
            if (!this.$globalData) {
                console.warn('全局数据未初始化');
                return;
            }
            this.userData = {
                id: this.$globalData.username || '',
                name: this.$globalData.name || '',
                gender: this.formatGender(this.$globalData.gender),
                contact_information: this.$globalData.contact_information || '',
                belongInfo_name: this.$globalData.belongInfo_name || [],
                manageInfo_name: this.$globalData.manageInfo_name || []
            };
        },
        // 格式化性别显示
        formatGender(gender) {
            const map = { MALE: '男', FEMALE: '女' };
            return map[gender] || '';
        }
    }
};
</script>

<style>
.container {
    padding: 24px;
    background-color: #f5f6f5;
    min-height: 100vh;
    display: flex;
    justify-content: center;
}

.profile-card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 24px;
    width: 100%;
    max-width: 480px;
}

.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
}

.avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 3px solid #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    margin-bottom: 12px;
}

.name {
    font-size: 20px;
    font-weight: 600;
    color: #333333;
    text-align: center;
}

.info-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f2f5;
}

.info-item:last-child {
    border-bottom: none;
}

.label {
    width: 80px;
    font-size: 15px;
    font-weight: 500;
    color: #333333;
    flex-shrink: 0;
}

.value {
    font-size: 15px;
    color: #555555;
    flex: 1;
    line-height: 24px;
}

.value-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
</style>