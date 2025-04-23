<template>
    <view class="menu-container">
        <!-- 2x3 菜单布局 -->
        <view class="menu-row">
            <view class="menu-item" @click="handleMenuItemClick('startSign')">
                <image class="menu-icon" src="/static/Function/startSign.png"></image>
                <text class="menu-text">发起签到</text>
            </view>
            <view class="menu-item" @click="handleMenuItemClick('UncheckedList')">
                <image class="menu-icon" src="/static/Function/UncheckedList.png"></image>
                <text class="menu-text">待签到表</text>
            </view>
        </view>
        <view class="menu-row">
            <view class="menu-item" @click="handleMenuItemClick('Check_Record')">
                <image class="menu-icon" src="/static/Function/Check_Record.png"></image>
                <text class="menu-text">查看记录</text>
            </view>
            <view class="menu-item" @click="handleMenuItemClick('mySettings')">
                <image class="menu-icon" src="/static/Function/mySettings.png"></image>
                <text class="menu-text">我的设置</text>
            </view>
        </view>
        <view class="menu-row">
            <view class="menu-item" @click="handleMenuItemClick('OrgCreate')">
                <image class="menu-icon" src="/static/Function/OrgCreate.png"></image>
                <text class="menu-text">新建组织</text>
            </view>
            <view class="menu-item" @click="handleMenuItemClick('OrgManage')">
                <image class="menu-icon" src="/static/Function/OrgManage.png"></image>
                <text class="menu-text">管理组织</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    methods: {
        // 处理菜单项点击
        handleMenuItemClick(item) {
            switch (item) {
                case 'startSign':
                    uni.navigateTo({ url: '/pages/startSign/startSign' });
                    break;
                case 'UncheckedList':
                    uni.navigateTo({ url: '/pages/UncheckedList/UncheckedList' });
                    break;
                case 'Check_Record':
                    uni.navigateTo({ url: '/pages/Check_Record/Check_Record' });
                    break;
                case 'mySettings':
                    uni.navigateTo({ url: '/pages/mySettings/mySettings' });
                    break;
                case 'OrgCreate':
                    uni.navigateTo({ url: '/pages/OrgCreate/OrgCreate' });
                    break;
                case 'OrgManage':
                    uni.navigateTo({ url: '/pages/OrgManage/OrgManage' });
                    break;
                default:
                    uni.showToast({
                        title: '功能暂未开放',
                        icon: 'none'
                    });
            }
        }
    }
};
</script>

<style>
.menu-container {
    padding: 16px;
    background-color: #f8f9fa;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.menu-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.menu-item {
    width: 48%;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.menu-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.menu-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
}

.menu-text {
    font-size: 14px;
    font-weight: 500;
    color: #333333;
}
</style>