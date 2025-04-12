<template>
  <div class="survey-page">
    <div class="page-header">
      <h2>第二部分：食品摄入</h2>
    </div>
    
    <div class="info-card">
      <div class="card-header">
        <h3>食品摄入量说明</h3>
      </div>
      <div class="card-content">
        <p class="intro-text">请输入日常摄入的各类食物数量</p>
        <div class="info-list">
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">牛奶/软饮料</p>
              <p class="item-subtitle">（如牛奶、碳酸饮料、果汁等）</p>
              <p class="item-data">每升含 <strong>40</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">外卖容器内食物</p>
              <p class="item-subtitle">（如外卖盒饭、打包食物等）</p>
              <p class="item-data">每升含 <strong>68,000</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">蜂蜜</p>
              <p class="item-subtitle">（如蜂蜜、蜂王浆等）</p>
              <p class="item-data">每千克含 <strong>166</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">糖</p>
              <p class="item-subtitle">（如白砂糖、红糖等）</p>
              <p class="item-data">每千克含 <strong>217</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">食盐（海盐）</p>
              <p class="item-subtitle">（如海盐、食用盐等）</p>
              <p class="item-data">每千克含 <strong>615.5</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">生米</p>
              <p class="item-subtitle">（如普通大米、糙米等）</p>
              <p class="item-data">每100克含 <strong>712</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">速熟米（即食类）</p>
              <p class="item-subtitle">（如即食米饭、方便米饭等）</p>
              <p class="item-data">每100克含 <strong>2,560</strong> 个微塑料</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>牛奶/软饮料（毫升/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="foodData.milk"
              placeholder="如牛奶、碳酸饮料、果汁等"
              @input="validateInput('milk')"
            />
            <span class="unit">mL</span>
          </div>
          <div class="reference">
            <p>💡 参考：普通瓶装饮料为500ml-1L，大瓶装为1.5L-2L，一盒牛奶通常为250ml</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.milk">{{ errors.milk }}</span>
      </div>

      <div class="input-group">
        <label>外卖容器内食物（升/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="foodData.takeaway"
              placeholder="如外卖盒饭、打包食物等"
              @input="validateInput('takeaway')"
            />
            <span class="unit">L</span>
          </div>
          <div class="reference">
            <p>💡 参考：普通外卖盒容量约为0.5L-1L，大份外卖约为1.5L-2L</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.takeaway">{{ errors.takeaway }}</span>
      </div>

      <div class="input-group">
        <label>蜂蜜（克/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="foodData.honey"
              placeholder="如蜂蜜、蜂王浆等"
              @input="validateInput('honey')"
            />
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>💡 参考：普通蜂蜜瓶装为500g-1kg，小包装为100g-250g</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.honey">{{ errors.honey }}</span>
      </div>

      <div class="input-group">
        <label>糖（克/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="foodData.sugar"
              placeholder="如白砂糖、红糖等"
              @input="validateInput('sugar')"
            />
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>💡 参考：普通糖包为5g-10g，家庭装为500g-1kg</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.sugar">{{ errors.sugar }}</span>
      </div>

      <div class="input-group">
        <label>食盐（海盐）（克/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="foodData.salt"
              placeholder="如海盐、食用盐等"
              @input="validateInput('salt')"
            />
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>💡 参考：普通盐包为5g-10g，家庭装为500g-1kg，成年人每日建议摄入量不超过6g</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.salt">{{ errors.salt }}</span>
      </div>

      <div class="input-group">
        <label>生米（克/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="foodData.rice"
              placeholder="如普通大米、糙米等"
              @input="validateInput('rice')"
            />
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>💡 参考：一碗米饭约150g-200g，一袋大米通常为5kg-10kg</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.rice">{{ errors.rice }}</span>
      </div>

      <div class="input-group">
        <label>速熟米（克/日）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="foodData.instantRice"
              placeholder="如即食米饭、方便米饭等"
              @input="validateInput('instantRice')"
            />
            <span class="unit">g</span>
          </div>
          <div class="reference">
            <p>💡 参考：一包速熟米通常为100g-200g，即食米饭盒装约为200g-300g</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.instantRice">{{ errors.instantRice }}</span>
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
  name: 'Food',
  setup() {
    const store = useStore()
    const router = useRouter()
    
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

    const validateInput = (field) => {
      const value = foodData[field]
      if (value === '') {
        errors[field] = ''
        return true
      }
      
      const num = parseFloat(value)
      if (isNaN(num) || num < 0) {
        errors[field] = '请输入大于等于0的数字'
        return false
      }
      
      errors[field] = ''
      return true
    }

    const validateAll = () => {
      const fields = ['milk', 'takeaway', 'honey', 'sugar', 'salt', 'rice', 'instantRice']
      let hasError = false
      
      fields.forEach(field => {
        if (foodData[field] !== '' && !validateInput(field)) {
          hasError = true
        }
      })
      
      return !hasError
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
        milk: parseFloat(foodData.milk || 0) * 0.04,
        takeaway: parseFloat(foodData.takeaway || 0) * 68000,
        honey: parseFloat(foodData.honey || 0) * 0.166,
        sugar: parseFloat(foodData.sugar || 0) * 0.217,
        salt: parseFloat(foodData.salt || 0) * 0.6155,
        rice: parseFloat(foodData.rice || 0) * 7.12,
        instantRice: parseFloat(foodData.instantRice || 0) * 25.6
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
        milk: parseFloat(foodData.milk || 0) * 0.04,
        takeaway: parseFloat(foodData.takeaway || 0) * 68000,
        honey: parseFloat(foodData.honey || 0) * 0.166,
        sugar: parseFloat(foodData.sugar || 0) * 0.217,
        salt: parseFloat(foodData.salt || 0) * 0.6155,
        rice: parseFloat(foodData.rice || 0) * 7.12,
        instantRice: parseFloat(foodData.instantRice || 0) * 25.6
      }

      // 保存数据到 store
      store.commit('updateFoodData', {
        ...foodData,
        microplastics
      })
      
      router.push('/water')
    }

    return {
      foodData,
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