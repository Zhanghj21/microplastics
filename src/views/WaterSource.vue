<template>
  <div class="water-source-page">
    <div class="header">
      <h1>{{ $t('waterSource.title') }}</h1>
    </div>
    
    <div class="content">
      <div class="info-section">
        <h2>{{ $t('waterSource.infoTitle') }}</h2>
        <p>{{ $t('waterSource.infoDescription') }}</p>
        
        <div class="info-cards">
          <div class="info-card">
            <div class="card-icon">💧</div>
            <h3>{{ $t('waterSource.tapWater.title') }}</h3>
            <p class="subtitle">{{ $t('waterSource.tapWater.subtitle') }}</p>
            <p class="description">{{ $t('waterSource.tapWater.description') }}</p>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🚰</div>
            <h3>{{ $t('waterSource.bottledWater.title') }}</h3>
            <p class="subtitle">{{ $t('waterSource.bottledWater.subtitle') }}</p>
            <p class="description">{{ $t('waterSource.bottledWater.description') }}</p>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🌊</div>
            <h3>{{ $t('waterSource.otherWater.title') }}</h3>
            <p class="subtitle">{{ $t('waterSource.otherWater.subtitle') }}</p>
            <p class="description">{{ $t('waterSource.otherWater.description') }}</p>
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <h2>{{ $t('waterSource.inputTitle') }}</h2>
        <div class="input-description">
          <p>{{ $t('waterSource.inputDescription') }}</p>
        </div>
        
        <div class="input-group">
          <label for="tapWater">{{ $t('waterSource.tapWater.title') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="tapWater" 
              v-model="tapWater" 
              :placeholder="$t('waterSource.inputPlaceholder')"
              @input="validateInput"
            >
            <span class="unit">mL</span>
          </div>
          <div class="reference">
            <p>{{ $t('waterSource.reference.bottle') }}</p>
          </div>
          <span class="error-message" v-if="errors.tapWater">{{ errors.tapWater }}</span>
        </div>
        
        <div class="input-group">
          <label for="bottledWater">{{ $t('waterSource.bottledWater.title') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="bottledWater" 
              v-model="bottledWater" 
              :placeholder="$t('waterSource.inputPlaceholder')"
              @input="validateInput"
            >
            <span class="unit">mL</span>
          </div>
          <div class="reference">
            <p>{{ $t('waterSource.reference.bottle') }}</p>
          </div>
          <span class="error-message" v-if="errors.bottledWater">{{ errors.bottledWater }}</span>
        </div>
        
        <div class="input-group">
          <label for="otherWater">{{ $t('waterSource.otherWater.title') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="otherWater" 
              v-model="otherWater" 
              :placeholder="$t('waterSource.inputPlaceholder')"
              @input="validateInput"
            >
            <span class="unit">mL</span>
          </div>
          <div class="reference">
            <p>{{ $t('waterSource.reference.daily') }}</p>
          </div>
          <span class="error-message" v-if="errors.otherWater">{{ errors.otherWater }}</span>
        </div>
      </div>
      
      <div class="navigation-buttons">
        <button @click="goBack" class="nav-button prev">
          {{ $t('common.previous') }}
        </button>
        <button @click="nextStep" class="nav-button next">
          {{ $t('common.next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { rates } from '../store'

export default {
  name: 'WaterSource',
  setup() {
    const store = useStore()
    return { store, rates }
  },
  data() {
    return {
      tapWater: this.$store.state.waterData.purified || '',
      bottledWater: this.$store.state.waterData.untreated || '',
      otherWater: this.$store.state.waterData.treated || '',
      errors: {
        tapWater: '',
        bottledWater: '',
        otherWater: ''
      }
    }
  },
  methods: {
    validateInput(event) {
      const field = event.target.id
      const value = event.target.value
      
      if (value === '') {
        this.errors[field] = ''
        return
      }
      
      // 检查是否包含非数字字符（除了小数点）
      if (!/^\d*\.?\d*$/.test(value)) {
        this.errors[field] = this.$t('common.error.number')
        return
      }
      
      // 检查是否超过一个小数点
      if ((value.match(/\./g) || []).length > 1) {
        this.errors[field] = this.$t('common.error.number')
        return
      }
      
      const num = parseFloat(value)
      if (isNaN(num) || num < 0) {
        this.errors[field] = this.$t('common.error.number')
        return
      }
      
      this.errors[field] = ''
    },
    goBack() {
      this.$router.push('/')
    },
    nextStep() {
      // 检查是否有错误
      const hasError = Object.values(this.errors).some(error => error !== '')
      
      if (hasError) {
        // 找到第一个有错误的输入框
        const firstErrorField = Object.keys(this.errors).find(key => this.errors[key] !== '')
        if (firstErrorField) {
          const errorElement = document.getElementById(firstErrorField)
          if (errorElement) {
            // 添加滚动动画
            const targetPosition = errorElement.getBoundingClientRect().top + window.pageYOffset - 100
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            })
            errorElement.focus()
          }
        }
        return
      }
      
      // 计算微塑料数量
      const microplastics = {
        purified: (parseFloat(this.tapWater || 0) / 100) * rates.water.purified,
        untreated: (parseFloat(this.bottledWater || 0) / 100) * rates.water.untreated,
        treated: (parseFloat(this.otherWater || 0) / 100) * rates.water.treated
      }
      
      // 保存数据到 store
      this.store.commit('updateWaterData', {
        purified: this.tapWater,
        untreated: this.bottledWater,
        treated: this.otherWater,
        microplastics
      })
      
      this.$router.push('/food')
    }
  }
}
</script>

<style scoped>
.water-source-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 2.5rem;
  color: #333;
}

.content {
  background: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-section,
.input-section {
  margin-bottom: 40px;
}

h2 {
  font-size: 1.8rem;
  color: #444;
  margin-bottom: 20px;
}

p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.info-card {
  background: rgba(129, 216, 208, 0.05);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(129, 216, 208, 0.2);
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(129, 216, 208, 0.15);
  border-color: #81D8D0;
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.info-card h3 {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 5px;
}

.info-card .subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.info-card .description {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0;
}

.reference-info {
  margin-top: 20px;
  padding: 15px;
  background: #f0f7ff;
  border-radius: 8px;
  border-left: 4px solid #81D8D0;
}

.reference-info p {
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #666;
}

.reference-info p:last-child {
  margin-bottom: 0;
}

.input-group {
  margin-bottom: 25px;
}

.input-group label {
  display: block;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper input {
  width: 100%;
  padding: 12px 15px;
  font-size: 1.1rem;
  border: 2px solid #81D8D0;
  border-radius: 8px;
  transition: all 0.3s ease;
  -moz-appearance: textfield;
  background-color: rgba(129, 216, 208, 0.05);
  color: #2c3e50;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #81D8D0;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(129, 216, 208, 0.2);
}

.input-wrapper input::-webkit-outer-spin-button,
.input-wrapper input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 移动端placeholder样式 */
@media (max-width: 768px) {
  .water-source-page {
    padding: 15px;
    width: 100%;
    max-width: 100%;
    margin: 0;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .content {
    padding: 20px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
  }
  
  .nav-button {
    padding: 10px 25px;
    font-size: 1rem;
  }

  .input-wrapper input {
    width: 100%;
    box-sizing: border-box;
  }
}

.unit {
  position: absolute;
  right: 15px;
  color: #666;
  font-size: 1.1rem;
}

.reference {
  margin-top: 8px;
  padding: 12px 15px;
  background: rgba(129, 216, 208, 0.1);
  border-radius: 6px;
  font-size: 0.9rem;
  color: #666;
  box-shadow: 0 2px 4px rgba(129, 216, 208, 0.1);
}

.reference p {
  font-style: italic;
  margin: 0;
}

.error-message {
  display: block;
  margin-top: 8px;
  color: #ff4d4f;
  font-size: 0.9rem;
}

.navigation-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.nav-button {
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.nav-button.prev {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e0e0e0;
}

.nav-button.next {
  background: #81D8D0;
  color: white;
  box-shadow: 0 2px 4px rgba(129, 216, 208, 0.3);
}

.nav-button:disabled {
  background: #e0e0e0;
  cursor: not-allowed;
}

.nav-button.prev:hover {
  background: #f0f0f0;
}

.nav-button.next:hover:not(:disabled) {
  background: #6BC4BC;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(129, 216, 208, 0.4);
}

.input-description {
  background: rgba(129, 216, 208, 0.1);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #81D8D0;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(129, 216, 208, 0.1);
}

.input-description p {
  color: #666;
  margin: 0;
  line-height: 1.6;
  font-size: 1.1rem;
}

html {
  scroll-behavior: smooth;
}
</style> 