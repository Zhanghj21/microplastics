<template>
  <div class="app-container">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <div class="logo">
          <span class="icon">🔬</span>
          <h1 :class="{ 'en-title': locale === 'en' }">{{ $t('introduction.title') }}</h1>
        </div>
        <LanguageSwitch class="language-switch" />
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
          <h4>{{ $t('footer.about') }}</h4>
          <p>{{ $t('footer.aboutDesc') }}</p>
        </div>
        <div class="footer-section">
          <h4>{{ $t('footer.contact') }}</h4>
          <p>📧 Email: plasticountai@163.com</p>
          <p>📱 Tel: +86 13901921755</p>
        </div>
        <div class="footer-section">
          <h4>{{ $t('footer.links') }}</h4>
          <div class="footer-links">
            <a href="https://www.epa.gov/" target="_blank">{{ $t('footer.epa') }}</a>
            <a href="https://www.who.int" target="_blank">{{ $t('footer.who') }}</a>
            <a href="https://oceana.org" target="_blank">{{ $t('footer.oceana') }}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2024 {{ $t('footer.copyright') }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitch from './components/LanguageSwitch.vue'

export default {
  name: 'App',
  components: {
    LanguageSwitch
  },
  setup() {
    const route = useRoute()
    const mainContent = ref(null)
    const { locale } = useI18n()
    
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

    onMounted(() => {
      const savedLocale = localStorage.getItem('locale')
      if (savedLocale) {
        locale.value = savedLocale
      }
    })

    return {
      currentStep,
      progressWidth,
      showProgress,
      mainContent,
      scrollToTop,
      locale
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
  height: 80px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.banner-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;
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
  padding: 0;
  white-space: pre-line;
  line-height: 1.2;
  display: flex;
  align-items: center;
  height: 100%;
}

.logo h1.en-title {
  font-size: calc(var(--font-size-xl) * 0.9);
}

.language-switch {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

/* 主要内容区域 */
.main-content {
  flex: 1 0 auto;
  padding: 20px;
  margin-top: 100px;
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
  top: 90px;
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
  top: 100px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  :root {
    --font-size-base: 12px;
    --font-size-lg: 14px;
    --font-size-xl: 16px;
    --font-size-xxl: 20px;
  }

  .banner {
    height: 60px;
  }

  .logo {
    flex-direction: row;
    align-items: center;
  }

  .logo h1 {
    font-size: var(--font-size-lg);
  }

  .logo h1.en-title {
    font-size: calc(var(--font-size-lg) * 0.9);
  }

  .language-switch {
    position: relative;
    right: 0;
    top: 0;
    transform: none;
  }

  .main-content {
    padding: 10px;
    margin-top: 80px;
    margin-bottom: 20px;
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

  .page-indicator {
    font-size: var(--font-size-base);
    padding: 2px 8px;
    top: 80px;
  }

  .progress-bar {
    top: 70px;
  }
}
</style> 