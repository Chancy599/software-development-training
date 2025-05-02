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
/* 全局容器 */
.menu-container {
    padding: 40rpx;
    min-height: 100vh;
    background: linear-gradient(180deg, #f5f7fa 0%, #e4e9f0 100%); /* 与注册页面一致的渐变背景 */
    display: flex;
    flex-direction: column;
    gap: 32rpx; /* 行间距 */
}

/* 菜单行 */
.menu-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 32rpx; /* 卡片间距 */
}

/* 菜单项 */
.menu-item {
    width: 48%;
    background: #ffffff;
    border-radius: 24rpx; /* 更大的圆角 */
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1); /* 柔和阴影 */
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32rpx;
    transition: all 0.3s ease; /* 动画过渡 */
}

.menu-item:hover {
    transform: translateY(-8rpx); /* 悬停时上移 */
    box-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.15); /* 增强阴影 */
    background: linear-gradient(180deg, #ffffff 0%, #f8faff 100%); /* 微妙渐变 */
}

/* 图标 */
.menu-icon {
    width: 96rpx; /* 增大图标 */
    height: 96rpx;
    margin-bottom: 16rpx;
    transition: transform 0.3s ease;
}

.menu-item:hover .menu-icon {
    transform: scale(1.1); /* 图标轻微放大 */
}

/* 文本 */
.menu-text {
    font-size: 32rpx; /* 增大字体 */
    font-weight: 500;
    color: #333333;
}

/* 响应式调整 */
@media screen and (max-width: 600rpx) {
    .menu-container {
        padding: 32rpx;
        gap: 24rpx;
    }
    .menu-row {
        gap: 24rpx;
    }
    .menu-item {
        padding: 24rpx;
        border-radius: 16rpx;
    }
    .menu-icon {
        width: 80rpx;
        height: 80rpx;
    }
    .menu-text {
        font-size: 28rpx;
    }
}

/* 无障碍支持 */
.menu-item:active {
    background: #f0faff; /* 点击反馈 */
}
</style>