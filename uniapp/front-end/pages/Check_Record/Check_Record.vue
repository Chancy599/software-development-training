<template>
    <view class="container">
        <view class="card-container">
            <view class="card" @click="goToPage('Organization_Records')">
                <view class="icon-wrapper org-icon">
                    <text class="icon">📊</text>
                </view>
                <text class="card-title">组织签到</text>
                <text class="card-desc">查看组织内成员的签到记录与统计</text>
            </view>
            
            <view class="card" @click="goToPage('Member_Records')">
                <view class="icon-wrapper member-icon">
                    <text class="icon">👥</text>
                </view>
                <text class="card-title">成员签到</text>
                <text class="card-desc">管理团队成员的签到情况与数据</text>
            </view>
            
            <view class="card" @click="goToPage('My_Records')">
                <view class="icon-wrapper my-icon">
                    <text class="icon">📝</text>
                </view>
                <text class="card-title">我的签到</text>
                <text class="card-desc">查看个人签到历史与统计数据</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    methods: {
        goToPage(pageName) {
            uni.navigateTo({
                url: `/pages/${pageName}/${pageName}`
            });
        }
    }
};
</script>

<style>
page {
    height: 100vh;
    overflow: hidden;
}

.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh; /* 确保容器占满视口高度 */
    background-color: #f5f7fa;
    padding: 24px 16px;
    overflow: hidden; /* 已存在，保留以明确 */
    box-sizing: border-box;
	height: 100vh; /* 设置高度为视窗高度 */
	overflow: hidden; /* 禁止滚动 */
	position: fixed; /* 固定位置 */
	top: 10;
	left: 0;
    right: 0;
	bottom: 10;
}

.card-container {
    width: 100%;
    max-width: 540px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden; /* 已存在，保留以明确 */
    flex: 1; /* 让 card-container 占满可用空间 */
}

.card {
    background-color: #ffffff;
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    flex-shrink: 0; /* 防止卡片缩小 */
}

.card:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 8px;
    background: linear-gradient(to bottom, #4a6cf7, #6c8dff);
    border-top-right-radius: 16px;
    border-bottom-right-radius: 16px;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
}

.org-icon {
    background: linear-gradient(135deg, #4a6cf7, #6c8dff);
}

.member-icon {
    background: linear-gradient(135deg, #4CAF50, #8BC34A);
}

.my-icon {
    background: linear-gradient(135deg, #FF9800, #FFEB3B);
}

.icon {
    font-size: 32px;
}

.card-title {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.card-desc {
    font-size: 14px;
    color: #666;
    text-align: center;
}
</style>
