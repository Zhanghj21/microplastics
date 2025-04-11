<template>
  <div class="survey-page">
    <div class="page-header">
      <h2>第六部分：生活区域</h2>
    </div>
    
    <div class="info-card">
      <div class="card-header">
        <h3>生活区域说明</h3>
      </div>
      <div class="card-content">
        <p class="intro-text">请选择您的主要生活区域类型：</p>
        <div class="info-list">
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">城市区域</p>
              <p class="item-subtitle">（如商业区、住宅区等）</p>
              <p class="item-data">每升空气含 <strong>850</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">郊区</p>
              <p class="item-subtitle">（如城乡结合部、卫星城等）</p>
              <p class="item-data">每升空气含 <strong>400</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">沿海地区</p>
              <p class="item-subtitle">（如海滨城市、港口等）</p>
              <p class="item-data">每升空气含 <strong>550</strong> 个微塑料</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>生活区域类型</label>
        <div class="radio-group">
          <label class="radio-label">
            <input 
              type="radio" 
              v-model="livingAreaData.areaType" 
              value="city"
            >
            城市区域
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              v-model="livingAreaData.areaType" 
              value="suburb"
            >
            郊区
          </label>
          <label class="radio-label">
            <input 
              type="radio" 
              v-model="livingAreaData.areaType" 
              value="coastal"
            >
            沿海地区
          </label>
        </div>
        <div class="reference">
          <p>💡 参考：城市区域包括商业区、住宅区等；郊区包括城乡结合部、卫星城等；沿海地区包括海滨城市、港口等</p>
        </div>
      </div>

      <div class="input-group">
        <label>每日呼吸量（升）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="livingAreaData.breathingVolume"
              placeholder="每日呼吸量"
              @input="validateInput('breathingVolume')"
            />
            <span class="unit">L</span>
          </div>
          <div class="reference">
            <p>💡 参考：成年人平均每天呼吸约12,000-15,000升空气，建议根据个人活动量调整</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.breathingVolume">{{ errors.breathingVolume }}</span>
      </div>
    </div>

    <div class="navigation-buttons">
      <button class="prev-button" @click="previousPage">上一页</button>
      <button class="next-button" @click="nextPage">下一页</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

export default {
  name: 'LivingArea',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const livingAreaData = reactive({
      areaType: store.state.livingAreaData.areaType,
      breathingVolume: store.state.livingAreaData.breathingVolume
    })

    const errors = reactive({
      breathingVolume: ''
    })

    const validateInput = (field) => {
      const value = livingAreaData[field]
      if (value === '') {
        errors[field] = ''
        return
      }
      
      const num = parseFloat(value)
      if (isNaN(num) || num < 0) {
        errors[field] = '请输入大于等于0的数字'
        return
      }
      
      errors[field] = ''
    }

    const nextPage = () => {
      store.commit('updateLivingAreaData', livingAreaData)
      router.push('/diet')
    }

    const previousPage = () => {
      store.commit('updateLivingAreaData', livingAreaData)
      router.push('/clothing')
    }

    return {
      livingAreaData,
      errors,
      validateInput,
      nextPage,
      previousPage
    }
  }
}
</script>

<style scoped>
.survey-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.page-header h2 {
  font-size: var(--font-size-xl);
  color: var(--tiffany-dark);
  margin: 0;
  padding: 10px 0;
  position: relative;
  display: inline-block;
}

.page-header h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: var(--tiffany-blue);
}

.info-card {
  background: white;
  border-radius: 15px;
  padding: 0;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  background: var(--tiffany-blue);
  padding: 20px;
  text-align: center;
}

.card-header h3 {
  color: white;
  margin: 0;
  font-size: var(--font-size-lg);
}

.card-content {
  padding: 25px;
}

.intro-text {
  color: var(--text-primary);
  margin-bottom: 20px;
  font-size: 1.1em;
  text-align: center;
}

.info-item {
  margin-bottom: 20px;
  background: rgba(129, 216, 208, 0.05);
  border-radius: 10px;
  padding: 15px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.item-content {
  margin-left: 0;
}

.item-title {
  font-size: 1.1em;
  color: var(--tiffany-dark);
  margin: 0 0 5px 0;
  font-weight: bold;
}

.item-subtitle {
  color: var(--text-secondary);
  margin: 0 0 8px 0;
  font-size: 0.9em;
}

.item-data {
  font-size: 1em;
  color: var(--text-primary);
  margin: 0;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.radio-label:hover {
  background-color: rgba(129, 216, 208, 0.1);
}

.radio-label input[type="radio"] {
  margin-right: 10px;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.navigation-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.prev-button,
.next-button {
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  min-width: 120px;
}

.next-button {
  background: var(--tiffany-blue);
  color: white;
}

.prev-button {
  background: white;
  border: 2px solid var(--tiffany-blue);
  color: var(--tiffany-blue);
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reference {
  background: rgba(129, 216, 208, 0.1);
  padding: 10px;
  border-radius: 8px;
  margin-top: 5px;
}

.reference p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .input-row {
    gap: 8px;
  }

  .reference {
    padding: 8px;
  }

  .reference p {
    font-size: 0.8em;
  }
}
</style> 