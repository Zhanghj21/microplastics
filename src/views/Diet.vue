<template>
  <div class="food-page">
    <div class="header">
      <h1>{{ $t('diet.title') }}</h1>
    </div>
    
    <div class="content">
      <div class="info-section">
        <h2>{{ $t('diet.description') }}</h2>
        <p>{{ $t('diet.introText') }}</p>
        
        <div class="info-cards">
          <div class="info-card">
            <div class="card-icon">🐟</div>
            <h3>{{ $t('diet.types.seafood.name') }}</h3>
            <p class="subtitle">{{ $t('diet.types.seafood.subtitle') }}</p>
            <p class="description">{{ $t('diet.types.seafood.data', [0.8]) }}</p>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🍺</div>
            <h3>{{ $t('diet.types.beer.name') }}</h3>
            <p class="subtitle">{{ $t('diet.types.beer.subtitle') }}</p>
            <p class="description">{{ $t('diet.types.beer.data', [21]) }}</p>
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <h2>{{ $t('diet.description') }}</h2>
        <div class="input-description">
          <p>{{ $t('diet.introText') }}</p>
        </div>
        
        <div class="input-group">
          <label for="seafood">{{ $t('diet.types.seafood.label') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="seafood"
              v-model="dietData.seafood"
              :placeholder="$t('diet.types.seafood.placeholder')"
              @input="validateInput('seafood')"
            >
            <span class="unit">{{ $t('diet.types.seafood.unit') }}/{{ $t('common.month') }}</span>
          </div>
          <div class="reference">
            <p>{{ $t('diet.types.seafood.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.seafood">{{ errors.seafood }}</span>
        </div>

        <div class="input-group">
          <label for="beer">{{ $t('diet.types.beer.label') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="beer"
              v-model="dietData.beer"
              :placeholder="$t('diet.types.beer.placeholder')"
              @input="validateInput('beer')"
            >
            <span class="unit">{{ $t('diet.types.beer.unit') }}/{{ $t('common.month') }}</span>
          </div>
          <div class="reference">
            <p>{{ $t('diet.types.beer.reference') }}</p>
          </div>
          <span class="error-message" v-if="errors.beer">{{ errors.beer }}</span>
        </div>
      </div>
      
      <div class="navigation-buttons">
        <button @click="previousPage" class="nav-button prev">
          {{ $t('common.previous') }}
        </button>
        <button @click="analyze" class="nav-button next">
          {{ $t('common.analyze') }}
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
  name: 'Diet',
  setup() {
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n()
    
    const dietData = reactive({
      seafood: store.state.dietData.seafood || '',
      beer: store.state.dietData.beer || ''
    })

    const errors = reactive({
      seafood: '',
      beer: ''
    })

    const validateInput = (field) => {
      const value = dietData[field]
      if (value === '') {
        errors[field] = ''
        return true
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
      const fields = ['seafood', 'beer']
      let hasError = false
      
      fields.forEach(field => {
        if (dietData[field] === '') {
          return
        }
        
        if (!validateInput(field)) {
          hasError = true
        }
      })
      
      return !hasError
    }

    const analyze = () => {
      const fields = ['seafood', 'beer']
      fields.forEach(field => {
        if (dietData[field] === '') {
          dietData[field] = '0'
        }
      })
      
      const hasInput = fields.some(field => dietData[field] !== '0')
      
      if (hasInput && !validateAll()) {
        const firstError = document.querySelector('.error-message:not(:empty)')
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        return
      }

      const processedData = {
        seafood: parseFloat(dietData.seafood) || 0,
        beer: parseFloat(dietData.beer) || 0,
        microplastics: {
          seafood: (parseFloat(dietData.seafood) || 0) * rates.diet.seafood / 31,
          beer: (parseFloat(dietData.beer) || 0) * rates.diet.beer / 31
        }
      }

      store.commit('updateDietData', processedData)
      router.push('/result')
    }

    const previousPage = () => {
      store.commit('updateDietData', dietData)
      router.push('/clothing')
    }

    return {
      dietData,
      errors,
      validateInput,
      validateAll,
      analyze,
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
 