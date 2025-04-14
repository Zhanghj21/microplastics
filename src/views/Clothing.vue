<template>
  <div class="food-page">
    <div class="header">
      <h1>{{ $t('clothing.title') }}</h1>
    </div>
    
    <div class="content">
      <div class="info-section">
        <h2>{{ $t('clothing.description') }}</h2>
        <p>{{ $t('clothing.introText') }}</p>
        
        <div class="info-cards">
          <div class="info-card">
            <div class="card-icon">👕</div>
            <h3>{{ $t('clothing.types.cotton.name') }}</h3>
            <p class="subtitle">{{ $t('clothing.types.cotton.subtitle') }}</p>
            <p class="description">{{ $t('clothing.types.cotton.data', [2250]) }}</p>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🏠</div>
            <h3>{{ $t('clothing.types.carpetArea.name') }}</h3>
            <p class="subtitle">{{ $t('clothing.types.carpetArea.subtitle') }}</p>
            <p class="description">{{ $t('clothing.types.carpetArea.data', [12.5]) }}</p>
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <h2>{{ $t('clothing.description') }}</h2>
        <div class="input-description">
          <p>{{ $t('clothing.introText') }}</p>
        </div>
        
        <div class="input-group">
          <label for="cotton">{{ $t('clothing.types.cotton.label') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="cotton"
              v-model="clothingData.cotton"
              :placeholder="$t('clothing.types.cotton.placeholder')"
              @input="validateInput('cotton')"
            >
            <span class="unit">{{ $t('clothing.types.cotton.unit') }}</span>
          </div>
          <div class="reference">
            <p>{{ $t('clothing.types.cotton.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.cotton">{{ errors.cotton }}</span>
        </div>

        <div class="input-group">
          <label for="carpetArea">{{ $t('clothing.types.carpetArea.label') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="carpetArea"
              v-model="clothingData.carpetArea"
              :placeholder="$t('clothing.types.carpetArea.placeholder')"
              @input="validateInput('carpetArea')"
            >
            <span class="unit">{{ $t('clothing.types.carpetArea.unit') }}</span>
          </div>
          <div class="reference">
            <p>{{ $t('clothing.types.carpetArea.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.carpetArea">{{ errors.carpetArea }}</span>
        </div>
      </div>
      
      <div class="navigation-buttons">
        <button @click="previousPage" class="nav-button prev">
          {{ $t('common.previous') }}
        </button>
        <button @click="nextPage" class="nav-button next">
          {{ $t('common.next') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'
import { rates } from '../store'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Clothing',
  setup() {
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n()
    
    const clothingData = reactive({
      cotton: store.state.clothingData.cotton || '',
      carpetArea: store.state.clothingData.carpetArea || ''
    })

    const errors = reactive({
      cotton: '',
      carpetArea: ''
    })

    const validateInput = (field) => {
      const value = clothingData[field]
      if (value === '') {
        errors[field] = ''
        return true
      }
      
      const num = parseFloat(value)
      if (isNaN(num) || num < 0) {
        errors[field] = t('common.inputError')
        return false
      }
      
      if (!Number.isInteger(num)) {
        errors[field] = t('common.integerError')
        return false
      }
      
      errors[field] = ''
      return true
    }

    const validateAll = () => {
      const fields = ['cotton', 'carpetArea']
      let hasError = false
      
      fields.forEach(field => {
        // 如果字段为空，则跳过验证
        if (clothingData[field] === '') {
          return
        }
        
        if (!validateInput(field)) {
          hasError = true
        }
      })
      
      return !hasError
    }

    const nextPage = () => {
      // 检查所有字段，如果为空则设置为0
      const fields = ['cotton', 'carpetArea']
      fields.forEach(field => {
        if (clothingData[field] === '') {
          clothingData[field] = '0'
        }
      })
      
      // 只有当用户输入了内容时才进行验证
      const hasInput = fields.some(field => clothingData[field] !== '0')
      
      if (hasInput && !validateAll()) {
        // 找到第一个有错误的输入框并滚动到它
        const firstError = document.querySelector('.error-message:not(:empty)')
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        return
      }

      // 计算微塑料释放量
      const processedData = {
        cotton: parseFloat(clothingData.cotton) || 0,
        carpetArea: parseFloat(clothingData.carpetArea) || 0,
        microplastics: {
          cotton: (parseFloat(clothingData.cotton) || 0) * rates.clothing.cotton,
          carpetArea: (parseFloat(clothingData.carpetArea) || 0) * rates.clothing.carpetArea
        }
      }

      store.commit('updateClothingData', processedData)
      router.push('/diet')
    }

    const previousPage = () => {
      store.commit('updateClothingData', clothingData)
      router.push('/daily-items')
    }

    return {
      clothingData,
      errors,
      validateInput,
      validateAll,
      nextPage,
      previousPage
    }
  }
}
</script>

<style scoped>
.food-page {
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

.input-section {
  background: #fff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.input-wrapper input::-webkit-outer-spin-button,
.input-wrapper input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-wrapper .unit {
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
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
  display: block;
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

@media (max-width: 768px) {
  .food-page {
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

  .input-wrapper input::placeholder {
    font-size: 0.9rem;
  }
}
</style> 