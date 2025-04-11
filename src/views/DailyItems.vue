<template>
  <div class="survey-page">
    <div class="page-header">
      <h2>第四部分：日用品释放</h2>
    </div>
    
    <div class="info-card">
      <div class="card-header">
        <h3>日用品释放说明</h3>
      </div>
      <div class="card-content">
        <p class="intro-text">请输入以下使用频次：</p>
        <div class="info-list">
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">塑料茶包饮用</p>
              <p class="item-subtitle">（如袋泡茶、茶包等）</p>
              <p class="item-data">每杯释放 <strong>2,000</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">塑料餐具使用</p>
              <p class="item-subtitle">（如一次性餐具、塑料餐盒等）</p>
              <p class="item-data">每次平均释放 <strong>125</strong> 个微塑料</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>塑料茶包饮用杯数</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="dailyItemsData.teaBags"
              placeholder="输入杯数"
              @input="validateInput('teaBags')"
            />
            <span class="unit">杯</span>
          </div>
          <div class="reference">
            <p>💡 参考：普通茶包容量约200ml-250ml，相当于一杯茶的量</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.teaBags">{{ errors.teaBags }}</span>
      </div>

      <div class="input-group">
        <label>塑料餐具使用次数</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="dailyItemsData.plasticUtensils"
              placeholder="输入次数"
              @input="validateInput('plasticUtensils')"
            />
            <span class="unit">次</span>
          </div>
          <div class="reference">
            <p>💡 参考：包括一次性筷子、勺子、叉子、餐盒等塑料餐具的使用次数</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.plasticUtensils">{{ errors.plasticUtensils }}</span>
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
  name: 'DailyItems',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const dailyItemsData = reactive({
      teaBags: store.state.dailyItemsData.teaBags,
      plasticUtensils: store.state.dailyItemsData.plasticUtensils
    })

    const errors = reactive({
      teaBags: '',
      plasticUtensils: ''
    })

    const validateInput = (field) => {
      const value = dailyItemsData[field]
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
      store.commit('updateDailyItemsData', dailyItemsData)
      router.push('/clothing')
    }

    const previousPage = () => {
      store.commit('updateDailyItemsData', dailyItemsData)
      router.push('/air')
    }

    return {
      dailyItemsData,
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