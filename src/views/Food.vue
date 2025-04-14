<template>
  <div class="food-page">
    <div class="header">
      <h1>{{ $t('food.title') }}</h1>
    </div>
    
    <div class="content">
      <div class="info-section">
        <h2>{{ $t('food.description') }}</h2>
        <p>{{ $t('food.introText') }}</p>
        
        <div class="info-cards">
          <div class="info-card">
            <div class="card-icon">🥛</div>
            <h3>{{ $t('food.types.milk.name') }}</h3>
            <p class="subtitle">{{ $t('food.types.milk.subtitle') }}</p>
            <p class="description">{{ $t('food.types.milk.data', [rates.food.milk]) }}</p>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🍱</div>
            <h3>{{ $t('food.types.takeaway.name') }}</h3>
            <p class="subtitle">{{ $t('food.types.takeaway.subtitle') }}</p>
            <p class="description">{{ $t('food.types.takeaway.data', [rates.food.takeaway]) }}</p>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🍯</div>
            <h3>{{ $t('food.types.honey.name') }}</h3>
            <p class="subtitle">{{ $t('food.types.honey.subtitle') }}</p>
            <p class="description">{{ $t('food.types.honey.data', [rates.food.honey]) }}</p>
          </div>

          <div class="info-card">
            <div class="card-icon">🍬</div>
            <h3>{{ $t('food.types.sugar.name') }}</h3>
            <p class="subtitle">{{ $t('food.types.sugar.subtitle') }}</p>
            <p class="description">{{ $t('food.types.sugar.data', [rates.food.sugar]) }}</p>
          </div>

          <div class="info-card">
            <div class="card-icon">🧂</div>
            <h3>{{ $t('food.types.salt.name') }}</h3>
            <p class="subtitle">{{ $t('food.types.salt.subtitle') }}</p>
            <p class="description">{{ $t('food.types.salt.data', [rates.food.salt]) }}</p>
          </div>

          <div class="info-card">
            <div class="card-icon">🍚</div>
            <h3>{{ $t('food.types.rice.name') }}</h3>
            <p class="subtitle">{{ $t('food.types.rice.subtitle') }}</p>
            <p class="description">{{ $t('food.types.rice.data', [rates.food.rice]) }}</p>
          </div>

          <div class="info-card">
            <div class="card-icon">🍚</div>
            <h3>{{ $t('food.types.instantRice.name') }}</h3>
            <p class="subtitle">{{ $t('food.types.instantRice.subtitle') }}</p>
            <p class="description">{{ $t('food.types.instantRice.data', [rates.food.instantRice]) }}</p>
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <h2>{{ $t('food.description') }}</h2>
        <div class="input-description">
          <p>{{ $t('food.introText') }}</p>
        </div>
        
        <div class="input-group">
          <label for="milk">{{ $t('food.types.milk.name') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="milk" 
              v-model="foodData.milk" 
              :placeholder="$t('food.types.milk.placeholder')"
              @input="validateInput"
            >
            <span class="unit">mL</span>
          </div>
          <div class="reference">
            <p>{{ $t('food.types.milk.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.milk">{{ errors.milk }}</span>
        </div>
        
        <div class="input-group">
          <label for="takeaway">{{ $t('food.types.takeaway.name') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="takeaway" 
              v-model="foodData.takeaway" 
              :placeholder="$t('food.types.takeaway.placeholder')"
              @input="validateInput"
            >
            <span class="unit">L</span>
          </div>
          <div class="reference">
            <p>{{ $t('food.types.takeaway.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.takeaway">{{ errors.takeaway }}</span>
        </div>
        
        <div class="input-group">
          <label for="honey">{{ $t('food.types.honey.name') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="honey" 
              v-model="foodData.honey" 
              :placeholder="$t('food.types.honey.placeholder')"
              @input="validateInput"
            >
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>{{ $t('food.types.honey.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.honey">{{ errors.honey }}</span>
        </div>

        <div class="input-group">
          <label for="sugar">{{ $t('food.types.sugar.name') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="sugar" 
              v-model="foodData.sugar" 
              :placeholder="$t('food.types.sugar.placeholder')"
              @input="validateInput"
            >
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>{{ $t('food.types.sugar.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.sugar">{{ errors.sugar }}</span>
        </div>

        <div class="input-group">
          <label for="salt">{{ $t('food.types.salt.name') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="salt" 
              v-model="foodData.salt" 
              :placeholder="$t('food.types.salt.placeholder')"
              @input="validateInput"
            >
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>{{ $t('food.types.salt.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.salt">{{ errors.salt }}</span>
        </div>

        <div class="input-group">
          <label for="rice">{{ $t('food.types.rice.name') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="rice" 
              v-model="foodData.rice" 
              :placeholder="$t('food.types.rice.placeholder')"
              @input="validateInput"
            >
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>{{ $t('food.types.rice.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.rice">{{ errors.rice }}</span>
        </div>

        <div class="input-group">
          <label for="instantRice">{{ $t('food.types.instantRice.name') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="instantRice" 
              v-model="foodData.instantRice" 
              :placeholder="$t('food.types.instantRice.placeholder')"
              @input="validateInput"
            >
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>{{ $t('food.types.instantRice.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.instantRice">{{ errors.instantRice }}</span>
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
  name: 'Food',
  setup() {
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n()
    
    const foodData = reactive({
      milk: store.state.foodData.milk || '',
      takeaway: store.state.foodData.takeaway || '',
      honey: store.state.foodData.honey || '',
      sugar: store.state.foodData.sugar || '',
      salt: store.state.foodData.salt || '',
      rice: store.state.foodData.rice || '',
      instantRice: store.state.foodData.instantRice || ''
    })

    const errors = reactive({
      milk: '',
      takeaway: '',
      honey: '',
      sugar: '',
      salt: '',
      rice: '',
      instantRice: ''
    })

    const validateInput = (event) => {
      const field = event.target.id
      const value = event.target.value
      
      if (value === '') {
        errors[field] = ''
        return true
      }
      
      // 检查是否包含非数字字符（除了小数点）
      if (!/^\d*\.?\d*$/.test(value)) {
        errors[field] = t('common.error.number')
        return false
      }
      
      // 检查是否超过一个小数点
      if ((value.match(/\./g) || []).length > 1) {
        errors[field] = t('common.error.decimal')
        return false
      }
      
      const num = parseFloat(value)
      if (isNaN(num) || num < 0) {
        errors[field] = t('common.error.number')
        return false
      }
      
      errors[field] = ''
      return true
    }

    const validateAll = () => {
      const fields = ['milk', 'takeaway', 'honey', 'sugar', 'salt', 'rice', 'instantRice']
      let hasError = false
      
      fields.forEach(field => {
        if (foodData[field] !== '') {
          const event = { target: { id: field, value: foodData[field] } }
          if (!validateInput(event)) {
            hasError = true
          }
        }
      })
      
      return !hasError
    }

    const nextPage = () => {
      // 检查是否有错误
      const hasError = Object.values(errors).some(error => error !== '')
      
      if (hasError) {
        // 找到第一个有错误的输入框
        const firstErrorField = Object.keys(errors).find(key => errors[key] !== '')
        if (firstErrorField) {
          const errorElement = document.getElementById(firstErrorField)
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            errorElement.focus()
          }
        }
        return
      }

      // 计算微塑料数量
      const microplastics = {
        milk: (parseFloat(foodData.milk || 0) / 1000) * rates.food.milk,
        takeaway: parseFloat(foodData.takeaway || 0) * rates.food.takeaway,
        honey: (parseFloat(foodData.honey || 0) / 1000) * rates.food.honey,
        sugar: (parseFloat(foodData.sugar || 0) / 1000) * rates.food.sugar,
        salt: (parseFloat(foodData.salt || 0) / 1000) * rates.food.salt,
        rice: (parseFloat(foodData.rice || 0) / 100) * rates.food.rice,
        instantRice: (parseFloat(foodData.instantRice || 0) / 100) * rates.food.instantRice
      }

      // 保存数据到 store
      store.commit('updateFoodData', {
        ...foodData,
        microplastics
      })

      router.push('/air')
    }

    const previousPage = () => {
      // 计算微塑料数量
      const microplastics = {
        milk: (parseFloat(foodData.milk || 0) / 1000) * rates.food.milk,
        takeaway: parseFloat(foodData.takeaway || 0) * rates.food.takeaway,
        honey: (parseFloat(foodData.honey || 0) / 1000) * rates.food.honey,
        sugar: (parseFloat(foodData.sugar || 0) / 1000) * rates.food.sugar,
        salt: (parseFloat(foodData.salt || 0) / 1000) * rates.food.salt,
        rice: (parseFloat(foodData.rice || 0) / 100) * rates.food.rice,
        instantRice: (parseFloat(foodData.instantRice || 0) / 100) * rates.food.instantRice
      }

      // 保存数据到 store
      store.commit('updateFoodData', {
        ...foodData,
        microplastics
      })
      
      router.push('/water-source')
    }

    return {
      foodData,
      errors,
      validateInput,
      validateAll,
      nextPage,
      previousPage,
      rates
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

/* 移动端placeholder样式 */
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

html {
  scroll-behavior: smooth;
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
</style> 