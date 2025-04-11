<template>
  <div class="survey-page">
    <div class="page-header">
      <h2>第五部分：衣物与纺织品</h2>
    </div>
    
    <div class="info-card">
      <div class="card-header">
        <h3>衣物与纺织品说明</h3>
      </div>
      <div class="card-content">
        <p class="intro-text">请输入您的衣物和家居纺织品使用情况：</p>
        <div class="info-list">
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">聚酯纤维衣物</p>
              <p class="item-subtitle">（如涤纶、尼龙等）</p>
              <p class="item-data">每件每天释放 <strong>2,250</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">棉质衣物</p>
              <p class="item-subtitle">（如纯棉T恤、衬衫等）</p>
              <p class="item-data">每件每天释放 <strong>400</strong> 个微塑料</p>
            </div>
          </div>
          <div class="info-item">
            <div class="item-content">
              <p class="item-title">地毯</p>
              <p class="item-subtitle">（如客厅、卧室地毯）</p>
              <p class="item-data">每平方米每天释放 <strong>12.5</strong> 个微塑料</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="input-section">
      <div class="input-group">
        <label>聚酯纤维衣物（件）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="clothingData.polyester"
              placeholder="聚酯纤维衣物数量"
              @input="validateInput('polyester')"
            />
            <span class="unit">件</span>
          </div>
          <div class="reference">
            <p>💡 参考：包括涤纶、尼龙等合成纤维制成的衣物，如运动服、外套、内衣等</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.polyester">{{ errors.polyester }}</span>
      </div>

      <div class="input-group">
        <label>棉质衣物（件）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="clothingData.cotton"
              placeholder="棉质衣物数量"
              @input="validateInput('cotton')"
            />
            <span class="unit">件</span>
          </div>
          <div class="reference">
            <p>💡 参考：包括纯棉T恤、衬衫、裤子等天然纤维制成的衣物</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.cotton">{{ errors.cotton }}</span>
      </div>

      <div class="input-group">
        <label>地毯面积（平方米）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="clothingData.carpetArea"
              placeholder="家中地毯总面积"
              @input="validateInput('carpetArea')"
            />
            <span class="unit">m²</span>
          </div>
          <div class="reference">
            <p>💡 参考：普通卧室地毯约4-6m²，客厅地毯约8-12m²</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.carpetArea">{{ errors.carpetArea }}</span>
      </div>

      <div class="input-group">
        <label>地毯使用天数（天/月）</label>
        <div class="input-row">
          <div class="input-wrapper">
            <input 
              type="text" 
              v-model="clothingData.carpetDays"
              placeholder="每月使用天数"
              @input="validateInput('carpetDays')"
            />
            <span class="unit">天</span>
          </div>
          <div class="reference">
            <p>💡 参考：每月最多31天，建议根据实际使用情况填写</p>
          </div>
        </div>
        <span class="error-message" v-if="errors.carpetDays">{{ errors.carpetDays }}</span>
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
  name: 'Clothing',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const clothingData = reactive({
      polyester: store.state.clothingData.polyester,
      cotton: store.state.clothingData.cotton,
      carpetArea: store.state.clothingData.carpetArea,
      carpetDays: store.state.clothingData.carpetDays
    })

    const errors = reactive({
      polyester: '',
      cotton: '',
      carpetArea: '',
      carpetDays: ''
    })

    const validateInput = (field) => {
      const value = clothingData[field]
      if (value === '') {
        errors[field] = ''
        return
      }
      
      const num = parseFloat(value)
      if (isNaN(num) || num < 0) {
        errors[field] = '请输入大于等于0的数字'
        return
      }
      
      if (field === 'carpetDays' && num > 31) {
        errors[field] = '每月最多31天'
        return
      }
      
      errors[field] = ''
    }

    const nextPage = () => {
      store.commit('updateClothingData', clothingData)
      router.push('/living-area')
    }

    const previousPage = () => {
      store.commit('updateClothingData', clothingData)
      router.push('/daily-items')
    }

    return {
      clothingData,
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