<template>
  <div class="food-page">
    <div class="header">
      <h1>{{ $t('air.title') }}</h1>
    </div>
    
    <div class="content">
      <div class="info-section">
        <h2>{{ $t('air.infoTitle') }}</h2>
        <p>{{ $t('air.introText') }}</p>
        
        <div class="info-cards">
          <div class="info-card">
            <div class="card-icon">🌬️</div>
            <h3>{{ $t('air.breathingTitle') }}</h3>
            <p class="subtitle">{{ $t('air.breathingSubtitle') }}</p>
            <p class="description">{{ $t('air.breathingData') }} <strong>12.5</strong> {{ $t('air.liters') }}</p>
          </div>
          
          <div class="info-card">
            <div class="card-icon">🏙️</div>
            <h3>{{ $t('air.microplasticsTitle') }}</h3>
            <p class="subtitle">{{ $t('air.microplasticsSubtitle') }}</p>
            <p class="description">{{ $t('air.cityData') }} <strong>850</strong> {{ $t('air.particlesPerLiter') }}</p>
            <p class="description">{{ $t('air.suburbData') }} <strong>400</strong> {{ $t('air.particlesPerLiter') }}</p>
            <p class="description">{{ $t('air.coastalData') }} <strong>550</strong> {{ $t('air.particlesPerLiter') }}</p>
          </div>
        </div>
      </div>
      
      <div class="input-section">
        <h2>{{ $t('air.infoTitle') }}</h2>
        <div class="input-description">
          <p>{{ $t('air.introText') }}</p>
        </div>
        
        <div class="input-group">
          <label for="weight">{{ $t('air.weightLabel') }}</label>
          <div class="input-wrapper">
            <input 
              type="text" 
              id="weight" 
              v-model="airData.weight"
              :placeholder="$t('air.weightPlaceholder')"
              @input="validateInput('weight')"
            />
            <span class="unit">kg</span>
          </div>
          <span class="error-message" v-if="errors.weight">{{ errors.weight }}</span>
        </div>

        <div class="input-group">
          <label>{{ $t('air.areaTypeLabel') }}</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="airData.areaType" 
                value="city"
              >
              <span>{{ $t('air.cityArea') }}</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="airData.areaType" 
                value="suburb"
              >
              <span>{{ $t('air.suburbArea') }}</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                v-model="airData.areaType" 
                value="coastal"
              >
              <span>{{ $t('air.coastalArea') }}</span>
            </label>
          </div>
          <div class="reference">
            <p>💡 <i>{{ $t('air.areaReference') }}</i></p>
          </div>
          <span class="error-message" v-if="errors.areaType">{{ errors.areaType }}</span>
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
import { useI18n } from 'vue-i18n'

export default {
  name: 'Air',
  setup() {
    const store = useStore()
    const router = useRouter()
    const { t } = useI18n()
    
    const airData = reactive({
      weight: store.state.airData.weight,
      areaType: store.state.airData.areaType
    })

    const errors = reactive({
      weight: '',
      areaType: ''
    })

    const validateInput = (field) => {
      const value = airData[field]
      if (value === '') {
        errors[field] = field === 'weight' ? t('air.errors.weightRequired') : t('air.errors.areaTypeRequired')
        return false
      }
      
      if (field === 'weight') {
        const num = parseFloat(value)
        if (isNaN(num) || num < 0) {
          errors[field] = t('air.errors.weightInvalid')
          return false
        }
      }
      
      errors[field] = ''
      return true
    }

    const validateAll = () => {
      const weightValid = validateInput('weight')
      const areaTypeValid = airData.areaType ? true : (errors.areaType = t('air.errors.areaTypeRequired'), false)
      
      return weightValid && areaTypeValid
    }

    const nextPage = () => {
      if (!validateAll()) {
        const firstError = document.querySelector('.error-message:not(:empty)')
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
        return
      }

      store.commit('updateAirData', airData)
      router.push('/daily-items')
    }

    const previousPage = () => {
      store.commit('updateAirData', airData)
      router.push('/food')
    }

    return {
      airData,
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
  background-color: rgba(129, 216, 208, 0.05);
  color: #2c3e50;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #81D8D0;
  background-color: white;
}

.input-wrapper .unit {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.radio-label:hover {
  background-color: rgba(129, 216, 208, 0.1);
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #81D8D0;
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
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
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

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-button.prev:hover {
  background: #f0f0f0;
}

.nav-button.next:hover {
  background: #6BC4BC;
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
}
</style> 