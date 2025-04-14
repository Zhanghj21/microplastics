<template>
  <div class="app-container">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <div class="logo">
          <span class="icon">🔬</span>
          <h1>微塑料健康评估</h1>
        </div>
        <div class="language-selector">
          <select v-model="selectedLanguage" @change="changeLanguage">
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 导航进度条 -->
    <div class="progress-bar">
      <div class="progress" :style="{ width: progressWidth + '%' }"></div>
      <div class="page-indicator">{{ currentStep }}/6</div>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content" ref="mainContent">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in" @after-enter="scrollToTop">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>关于我们</h4>
          <p>致力于提供准确的微塑料暴露评估，帮助您了解日常生活中的微塑料摄入情况。</p>
        </div>
        <div class="footer-section">
          <h4>联系方式</h4>
          <p>📧 Email: plasticountai@163.com</p>
          <p>📱 Tel: +86 123-4567-8900</p>
        </div>
        <div class="footer-section">
          <h4>友情链接</h4>
          <div class="footer-links">
            <a href="https://www.epa.gov/" target="_blank">环境保护署（EPA，美国）</a>
            <a href="https://www.who.int" target="_blank">世界卫生组织（WHO）</a>
            <a href="https://oceana.org" target="_blank">海洋保护协会（Oceana）</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 微塑料健康评估系统 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const route = useRoute()
    const mainContent = ref(null)
    const selectedLanguage = ref('zh')
    
    const routeSteps = {
      'introduction': 0,
      'watersource': 1,
      'food': 2,
      'air': 3,
      'dailyitems': 4,
      'clothing': 5,
      'diet': 6,
      'result': 0
    }

    const currentStep = computed(() => {
      const step = routeSteps[route.name?.toLowerCase()] || 0
      return step > 0 ? step : 0
    })

    const progressWidth = computed(() => {
      return currentStep.value > 0 ? (currentStep.value / 6) * 100 : 0
    })

    const showProgress = computed(() => {
      const step = routeSteps[route.name?.toLowerCase()] || 0
      return step > 0 && step <= 6
    })

    const scrollToTop = () => {
      if (mainContent.value) {
        mainContent.value.scrollTop = 0
      }
      window.scrollTo(0, 0)
    }

    const changeLanguage = () => {
      // 这里可以添加语言切换的逻辑
      console.log('Language changed to:', selectedLanguage.value)
    }

    return {
      currentStep,
      progressWidth,
      showProgress,
      mainContent,
      scrollToTop,
      selectedLanguage,
      changeLanguage
    }
  }
}
</script>

<style>
:root {
  --tiffany-blue: #81D8D0;
  --tiffany-dark: #66ABA4;
  --tiffany-light: #A7E8E2;
  --text-primary: #2C3E50;
  --text-secondary: #666;
  --error-color: #E74C3C;
  --success-color: #2ECC71;
  --font-size-base: 20px;
  --font-size-lg: 24px;
  --font-size-xl: 28px;
  --font-size-xxl: 48px;
}

body {
  font-size: var(--font-size-lg);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

.app-container {
  min-height: 100vh;
  background: radial-gradient(circle at center, #ffffff 0%, #E0F5F4 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
}

/* Banner 样式 */
.banner {
  background: linear-gradient(135deg, var(--tiffany-dark) 0%, var(--tiffany-blue) 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  height: 80px; /* 设置固定高度 */
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100%; /* 继承父元素高度 */
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.icon {
  font-size: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.logo h1 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: bold;
  padding: 8px 0;
}

.language-selector {
  display: none;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.language-selector select {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: var(--font-size-base);
  cursor: pointer;
  outline: none;
}

.language-selector select option {
  background: var(--tiffany-dark);
  color: white;
}

/* 主要内容区域 */
.main-content {
  flex: 1 0 auto;
  padding: 20px;
  margin-top: 100px; /* 根据banner高度调整 */
  margin-bottom: 40px;
  min-height: auto;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* Footer 样式 */
.footer {
  background: var(--text-primary);
  color: white;
  padding: 40px 0 0;
  flex-shrink: 0;
  width: 100%;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section h4 {
  color: var(--tiffany-light);
  margin-bottom: 20px;
  font-size: var(--font-size-lg);
}

.footer-section p {
  margin: 10px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-base);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: var(--tiffany-light);
}

.footer-bottom {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
}

/* 进度条样式 */
.progress-bar {
  position: fixed;
  top: 80px; /* 根据banner高度调整 */
  left: 0;
  width: 100%;
  height: 4px;
  background: rgba(129, 216, 208, 0.2);
  z-index: 1000;
  display: v-bind("showProgress ? 'block' : 'none'");
}

.progress {
  height: 100%;
  background: var(--tiffany-blue);
  transition: width 0.3s ease;
}

.page-indicator {
  position: fixed;
  top: 90px; /* 根据banner高度调整 */
  right: 20px;
  background: var(--tiffany-dark);
  color: white;
  padding: 6px 16px;
  border-radius: 15px;
  font-size: var(--font-size-lg);
  display: v-bind("showProgress ? 'block' : 'none'");
}

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 全局输入框样式 */
input {
  font-size: var(--font-size-lg) !important;
}

/* 全局标签样式 */
label {
  font-size: var(--font-size-lg) !important;
}

/* 全局按钮样式 */
button {
  font-size: var(--font-size-lg) !important;
}

/* 全局标题样式 */
h1 {
  font-size: var(--font-size-xxl) !important;
}

h2 {
  font-size: var(--font-size-xl) !important;
}

h3 {
  font-size: var(--font-size-lg) !important;
}

/* 全局文本样式 */
p {
  font-size: var(--font-size-lg) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  :root {
    --font-size-base: 12px;
    --font-size-lg: 14px;
    --font-size-xl: 16px;
    --font-size-xxl: 20px;
  }

  .banner {
    height: 60px; /* 移动端更小的高度 */
  }

  .logo h1 {
    padding: 5px 0;
  }

  .language-selector select {
    font-size: var(--font-size-base);
    padding: 2px 4px;
  }

  .main-content {
    margin-top: 80px; /* 移动端更小的margin */
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 0 15px;
  }

  .footer-section {
    text-align: center;
  }

  .footer-links {
    align-items: center;
  }

  .progress-bar {
    top: 60px; /* 移动端进度条位置 */
  }

  .page-indicator {
    top: 70px; /* 移动端页码指示器位置 */
  }
}
</style> 