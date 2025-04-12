<template>
  <div class="survey-page">
    <div class="page-header">
      <h2>第一部分：环境水源</h2>
    </div>
    
    <div class="info-card">
      <div class="card-header">
        <h3>水源摄入量说明</h3>
      </div>
      <div class="card-content">
        <p class="intro-text">请输入日常摄入的三种类型水源的摄入量，单位为毫升（mL）</p>
        <div class="info-list">
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">标准水源水</p>
              <p class="item-subtitle">（如纯净水、净化水）</p>
              <p class="item-data">每100毫升含 <strong>0.22</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">未经处理的水</p>
              <p class="item-subtitle">（如山泉水、井水）</p>
              <p class="item-data">每100毫升含 <strong>330</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">处理后的水</p>
              <p class="item-subtitle">（如市政自来水）</p>
              <p class="item-data">每100毫升含 <strong>46</strong> 个微塑料</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>标准水源水（毫升/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="waterData.purified"
              placeholder="如纯净水、净化水"
              @input="validateInput('purified')"
            />
            <span class="unit">mL</span>
          </div>
          <div class="reference">
            <p>💡 参考：普通矿泉水瓶容量为500mL，大瓶装为1.5L</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.purified">{{ errors.purified }}</span>
      </div>

      <div class="input-group">
        <label>未经处理的水（毫升/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="waterData.untreated"
              placeholder="如山泉水、井水"
              @input="validateInput('untreated')"
            />
            <span class="unit">mL</span>
          </div>
          <div class="reference">
            <p>💡 参考：普通矿泉水瓶容量为500mL，大瓶装为1.5L</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.untreated">{{ errors.untreated }}</span>
      </div>

      <div class="input-group">
        <label>处理后的水（毫升/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="waterData.treated"
              placeholder="如市政自来水"
              @input="validateInput('treated')"
            />
            <span class="unit">mL</span>
          </div>
          <div class="reference">
            <p>💡 参考：成年人每天建议饮水量为1500-2000mL，相当于3-4瓶500mL矿泉水</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.treated">{{ errors.treated }}</span>
      </div>
    </div>

    <div class="navigation-buttons">
      <button class="next-button" @click="nextPage">下一页</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'

export default {
  name: 'WaterSource',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const waterData = reactive({
      purified: store.state.waterData.purified,
      untreated: store.state.waterData.untreated,
      treated: store.state.waterData.treated
    })

    const errors = reactive({
      purified: '',
      untreated: '',
      treated: ''
    })

    const validateInput = (field) => {
      const value = waterData[field]
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

    const validateAll = () => {
      validateInput('purified')
      validateInput('untreated')
      validateInput('treated')
      return !errors.purified && !errors.untreated && !errors.treated
    }

    const nextPage = () => {
      if (!validateAll()) {
        // 找到第一个有错误的输入框并滚动到它
        const firstError = document.querySelector('.error-message:not(:empty)')
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        return
      }

      // 计算微塑料数量
      const microplastics = {
        purified: parseFloat(waterData.purified || 0) * 0.0022,
        untreated: parseFloat(waterData.untreated || 0) * 3.3075,
        treated: parseFloat(waterData.treated || 0) * 0.4655
      }

      // 保存数据到 store
      store.commit('updateWaterData', {
        ...waterData,
        microplastics
      })
      
      // 跳转到下一页
      router.push('/food')
    }

    return {
      waterData,
      errors,
      validateInput,
      validateAll,
      nextPage
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

.navigation-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.next-button {
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  min-width: 120px;
  background: var(--tiffany-blue);
  color: white;
}

.next-button:hover {
  background: var(--tiffany-dark);
  transform: translateY(-2px);
}

.input-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.input-group {
  margin-bottom: 20px;
}

.input-group:last-child {
  margin-bottom: 0;
}

.input-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

input {
  width: 100%;
  padding: 12px 45px 12px 15px;
  border: 2px solid var(--tiffany-light);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--tiffany-blue);
  box-shadow: 0 0 0 3px rgba(129, 216, 208, 0.2);
}

.unit {
  position: absolute;
  right: 15px;
  color: var(--text-secondary);
}

.error-message {
  color: var(--error-color);
  font-size: 0.9rem;
  margin-top: 5px;
}

.reference {
  width: 100%;
  padding: 12px 15px;
  background: rgba(129, 216, 208, 0.1);
  border-radius: 8px;
  font-size: 0.9em;
  color: var(--text-secondary);
  font-style: italic;
}

.reference p {
  margin: 0;
}

@media (max-width: 768px) {
  .survey-page {
    padding: 15px;
  }

  .page-header {
    margin-bottom: 20px;
  }

  .page-number {
    font-size: 1.8rem;
  }

  .input-section {
    padding: 20px;
  }

  .next-button {
    width: 100%;
  }

  .input-row {
    gap: 8px;
  }

  .reference {
    width: 100%;
  }

  .card-content {
    padding: 15px;
  }
  
  .info-item {
    padding: 12px;
  }
  
  .item-title {
    font-size: 1em;
  }
  
  .item-subtitle {
    font-size: 0.85em;
  }
}
</style> 