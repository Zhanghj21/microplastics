<template>
  <div class="survey-page">
    <div class="page-header">
      <h2>第三部分：空气暴露</h2>
    </div>
    
    <div class="info-card">
      <div class="card-header">
        <h3>空气暴露说明</h3>
      </div>
      <div class="card-content">
        <p class="intro-text">请输入您的体重，我们将根据体重计算您的呼吸量：</p>
        <div class="info-list">
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">呼吸量计算</p>
              <p class="item-subtitle">（基于体重计算）</p>
              <p class="item-data">每千克体重每天呼吸量约为 <strong>12.5</strong> 升</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">空气微塑料含量</p>
              <p class="item-subtitle">（室内外空气平均值）</p>
              <p class="item-data">每升空气中含有 <strong>393</strong> 个微塑料</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>体重（kg）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="airData.weight"
              placeholder="请输入您的体重"
              @input="validateInput('weight')"
            />
            <span class="unit">kg</span>
          </div>
          <div class="reference">
            <p>💡 参考：成年男性平均体重约65-75kg，成年女性平均体重约55-65kg</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.weight">{{ errors.weight }}</span>
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
  name: 'Air',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const airData = reactive({
      weight: store.state.airData.weight
    })

    const errors = reactive({
      weight: ''
    })

    const validateInput = (field) => {
      const value = airData[field]
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