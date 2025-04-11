<template>
  <div class="survey-page">
    <div class="page-header">
      <h2>第七部分：饮食习惯</h2>
    </div>
    
    <div class="info-card">
      <div class="card-header">
        <h3>饮食习惯说明</h3>
      </div>
      <div class="card-content">
        <p class="intro-text">请输入您的饮食习惯相关信息：</p>
        <div class="info-list">
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">海鲜</p>
              <p class="item-subtitle">（如鱼类、贝类等）</p>
              <p class="item-data">每克含 <strong>0.8</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">啤酒</p>
              <p class="item-subtitle">（如瓶装啤酒、罐装啤酒等）</p>
              <p class="item-data">每升含 <strong>21</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">自来水</p>
              <p class="item-subtitle">（如饮用水、烹饪用水等）</p>
              <p class="item-data">每升含 <strong>27.5</strong> 个微塑料</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>海鲜（克/月）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="dietData.seafood"
              placeholder="每月食用海鲜量"
              @input="validateInput('seafood')"
            />
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>💡 参考：一条普通大小的鱼约200-300g，建议根据实际食用量填写</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.seafood">{{ errors.seafood }}</span>
      </div>

      <div class="input-group">
        <label>啤酒（升/月）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="dietData.beer"
              placeholder="每月饮用啤酒量"
              @input="validateInput('beer')"
            />
            <span class="unit">L</span>
          </div>
          <div class="reference">
            <p>💡 参考：一瓶普通啤酒约330ml，一罐啤酒约500ml，建议根据实际饮用量填写</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.beer">{{ errors.beer }}</span>
      </div>

      <div class="input-group">
        <label>自来水（升/月）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="dietData.tapWater"
              placeholder="每月饮用自来水量"
              @input="validateInput('tapWater')"
            />
            <span class="unit">L</span>
          </div>
          <div class="reference">
            <p>💡 参考：成年人每天建议饮水量约2-3L，包括饮用水和烹饪用水</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.tapWater">{{ errors.tapWater }}</span>
      </div>
    </div>

    <div class="navigation-buttons">
      <button class="prev-button" @click="previousPage">上一页</button>
      <button class="analyze-button" @click="analyze">分析结果</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { reactive } from 'vue'

export default {
  name: 'Diet',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const dietData = reactive({
      seafood: store.state.dietData.seafood,
      beer: store.state.dietData.beer,
      tapWater: store.state.dietData.tapWater
    })

    const errors = reactive({
      seafood: '',
      beer: '',
      tapWater: ''
    })

    const validateInput = (field) => {
      const value = dietData[field]
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

    const analyze = () => {
      store.commit('updateDietData', dietData)
      router.push('/result')
    }

    const previousPage = () => {
      store.commit('updateDietData', dietData)
      router.push('/living-area')
    }

    return {
      dietData,
      errors,
      validateInput,
      analyze,
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

.navigation-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.prev-button,
.analyze-button {
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  min-width: 120px;
}

.analyze-button {
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
 