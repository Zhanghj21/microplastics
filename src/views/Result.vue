<template>
  <div class="survey-page">
    <div class="page-header">
      <h2>微塑料摄入分析报告</h2>
    </div>

    <div class="result-content">
      <div class="result-section">
        <h3>总体评估</h3>
        <p class="result-summary">🎉 根据分析，以下是您的微塑料摄入情况：</p>
      </div>

      <!-- 添加图表标题 -->
      <div class="chart-title">
        <h3>微塑料摄入来源分布</h3>
        <p class="chart-subtitle">各来源占比分析</p>
      </div>

      <!-- ECharts图表容器 -->
      <div id="microplasticsChart" class="chart-container"></div>

      <div class="category-results">
        <div class="category-item" v-for="(amount, category) in totalPlastics" :key="category">
          <h4>{{ getCategoryName(category) }}</h4>
          <p class="amount">{{ amount.toLocaleString() }} 个</p>
        </div>
      </div>

      <div class="total-result">
        <h3>总微塑料摄入量</h3>
        <p class="total-amount">{{ totalPlastics.total.toLocaleString() }} 个</p>
      </div>

      <div class="analysis-section">
        <h3>摄入分析</h3>
        <p>{{ analysisText }}</p>
      </div>

      <div class="result-tips">
        <h3>健康建议</h3>
        <ul>
          <li>建议增加使用过滤水，减少未处理水源的使用</li>
          <li>尽量减少使用一次性塑料制品</li>
          <li>选择天然材质的衣物和家居用品</li>
          <li>保持良好的室内通风</li>
          <li>减少外卖使用频率，选择环保餐具</li>
          <li>选择使用玻璃或不锈钢容器储存食物</li>
        </ul>
      </div>
    </div>

    <div class="navigation-buttons">
      <button class="prev-button" @click="previousPage">返回修改</button>
      <button class="restart-button" @click="restart">重新开始</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'Result',
  setup() {
    const store = useStore()
    const router = useRouter()
    let chart = null

    const totalPlastics = computed(() => store.getters.totalPlastics)

    const categoryNames = {
      water: '环境水源',
      food: '食品',
      air: '空气吸入',
      clothing: '衣物与纺织品',
      livingArea: '生活区域',
      diet: '饮食习惯',
      total: '总计'
    }

    const getCategoryName = (category) => categoryNames[category] || category

    const analysisText = computed(() => {
      const sources = [
        { name: '环境水源', value: totalPlastics.value.water },
        { name: '食品', value: totalPlastics.value.food },
        { name: '空气吸入', value: totalPlastics.value.air },
        { name: '衣物与纺织品', value: totalPlastics.value.clothing },
        { name: '生活区域', value: totalPlastics.value.livingArea },
        { name: '饮食习惯', value: totalPlastics.value.diet }
      ].sort((a, b) => b.value - a.value)

      const top3 = sources.slice(0, 3)
      const total = totalPlastics.value.total

      return `根据分析，您的主要微塑料摄入来源为${top3.map(s => s.name).join('、')}。其中，${top3[0].name}占总摄入量的${Math.round(top3[0].value/total*100)}%，是最主要的来源。建议您重点关注这些方面，采取相应的防护措施。`
    })

    const initChart = () => {
      const chartDom = document.getElementById('microplasticsChart')
      if (!chartDom) return

      chart = echarts.init(chartDom)
      
      const sources = [
        { name: '环境水源', value: totalPlastics.value.water },
        { name: '食品', value: totalPlastics.value.food },
        { name: '空气吸入', value: totalPlastics.value.air },
        { name: '衣物与纺织品', value: totalPlastics.value.clothing },
        { name: '生活区域', value: totalPlastics.value.livingArea },
        { name: '饮食习惯', value: totalPlastics.value.diet }
      ].sort((a, b) => b.value - a.value)

      const top3 = sources.slice(0, 3)
      const others = sources.slice(3)
      const othersSum = others.reduce((sum, item) => sum + item.value, 0)

      // 根据屏幕宽度调整图表配置
      const isMobile = window.innerWidth <= 768
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            if (params.name === '其他来源') {
              const othersList = others.map(item => `${item.name}: ${item.value}`).join('<br/>')
              return `其他来源 (${othersSum})<br/>${othersList}`
            }
            return `${params.name}: ${params.value} (${params.percent}%)`
          }
        },
        legend: {
          orient: isMobile ? 'horizontal' : 'vertical',
          right: isMobile ? 'center' : '5%',
          top: isMobile ? 'bottom' : 'middle',
          itemGap: isMobile ? 10 : 15,
          textStyle: {
            color: '#2C3E50',
            fontSize: isMobile ? 12 : 14
          }
        },
        series: [
          {
            name: '微塑料摄入来源',
            type: 'pie',
            radius: isMobile ? ['20%', '40%'] : ['15%', '45%'],
            center: isMobile ? ['50%', '45%'] : ['40%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'outside',
              formatter: '{d}%',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: 4,
              padding: [4, 8],
              color: '#2C3E50',
              fontSize: isMobile ? 10 : 12
            },
            labelLine: {
              show: true,
              length: isMobile ? 5 : 15,
              length2: isMobile ? 8 : 20,
              smooth: true,
              lineStyle: {
                width: 1
              }
            },
            data: [
              ...top3.map((item, index) => ({
                ...item,
                itemStyle: {
                  color: ['#81D8D0', '#66ABA4', '#A7E8E2'][index]
                }
              })),
              { 
                name: '其他来源', 
                value: othersSum,
                itemStyle: {
                  color: '#D3F3F1'
                }
              }
            ]
          }
        ]
      }

      chart.setOption(option)
    }

    onMounted(() => {
      initChart()
      window.addEventListener('resize', () => chart?.resize())
    })

    onUnmounted(() => {
      chart?.dispose()
      window.removeEventListener('resize', () => chart?.resize())
    })

    const previousPage = () => {
      router.push('/diet')
    }

    const restart = () => {
      router.push('/')
    }

    return {
      totalPlastics,
      getCategoryName,
      analysisText,
      previousPage,
      restart
    }
  }
}
</script>

<style scoped>
.survey-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}

.result-content {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: visible;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.chart-container {
  width: 100%;
  height: 450px;
  margin: 10px -20px;
  padding: 0 20px;
  position: relative;
  overflow: visible;
  box-sizing: border-box;
}

.category-results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 30px 0 20px;
  position: relative;
  z-index: 2;
}

.category-item {
  background: rgba(129, 216, 208, 0.1);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
}

.category-item:hover {
  transform: translateY(-5px);
}

.category-item h4 {
  color: var(--tiffany-dark);
  margin-bottom: 10px;
}

.amount {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
}

.total-result {
  text-align: center;
  margin: 20px 0;
  padding: 15px;
  background: var(--tiffany-dark);
  color: white;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.total-result:hover {
  transform: scale(1.02);
}

.total-amount {
  font-size: 1.8rem;
  font-weight: 600;
  margin-top: 8px;
}

.analysis-section {
  background: rgba(129, 216, 208, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
}

.result-tips {
  margin-top: 20px;
}

.result-tips ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.result-tips li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
}

.result-tips li::before {
  content: "•";
  color: var(--tiffany-blue);
  font-size: 1.5em;
  position: absolute;
  left: 0;
  top: 5px;
}

.navigation-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  padding-bottom: 30px;
}

.prev-button,
.restart-button {
  padding: 12px 30px;
  border-radius: 25px;
  font-size: 1.1rem;
  min-width: 120px;
}

.restart-button {
  background: var(--tiffany-blue);
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 25px;
  font-size: var(--font-size-lg);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.restart-button:hover {
  background: var(--tiffany-dark);
  transform: translateY(-2px);
}

.prev-button {
  background: white;
  border: 2px solid var(--tiffany-blue);
  color: var(--tiffany-blue);
}

.chart-title {
  text-align: center;
  margin-bottom: 8px;
}

.chart-title h3 {
  color: var(--tiffany-dark);
  font-size: 1.2rem;
  margin-bottom: 3px;
}

.chart-subtitle {
  color: var(--text-secondary);
  font-size: 0.85rem;
  margin: 0;
}

@media (max-width: 768px) {
  .survey-page {
    padding: 5px;
  }

  .result-content {
    padding: 12px;
  }

  .page-header h2 {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }

  .result-section {
    margin-bottom: 8px;
  }

  .result-section h3 {
    font-size: 1.1rem;
  }

  .result-summary {
    font-size: 0.85rem;
    margin-bottom: 3px;
  }

  .chart-container {
    height: 300px;
    margin: 8px -12px;
    padding: 0 12px;
  }
  
  .category-results {
    grid-template-columns: 1fr;
    margin-top: 15px;
    gap: 8px;
  }

  .category-item {
    padding: 10px;
  }

  .category-item h4 {
    font-size: 0.95rem;
    margin-bottom: 3px;
  }

  .amount {
    font-size: 1rem;
  }

  .total-result {
    margin: 15px 0;
    padding: 12px;
  }

  .total-result h3 {
    font-size: 1.1rem;
  }

  .total-amount {
    font-size: 1.3rem;
    margin-top: 3px;
  }

  .analysis-section {
    padding: 10px;
    margin: 12px 0;
  }

  .analysis-section h3 {
    font-size: 1.1rem;
    margin-bottom: 5px;
  }

  .analysis-section p {
    font-size: 0.85rem;
    line-height: 1.3;
  }

  .result-tips {
    margin-top: 15px;
  }

  .result-tips h3 {
    font-size: 1.1rem;
    margin-bottom: 5px;
  }

  .result-tips li {
    padding: 5px 0;
    padding-left: 15px;
    font-size: 0.85rem;
  }

  .navigation-buttons {
    margin-top: 20px;
    padding-bottom: 20px;
  }

  .prev-button,
  .restart-button {
    padding: 8px 15px;
    font-size: 0.95rem;
  }

  .chart-title {
    margin-bottom: 3px;
  }

  .chart-title h3 {
    font-size: 1rem;
  }

  .chart-subtitle {
    font-size: 0.75rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .survey-page {
    padding: 15px;
  }

  .result-content {
    padding: 25px;
  }

  .chart-container {
    height: 450px;
  }

  .category-results {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 