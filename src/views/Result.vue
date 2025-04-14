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
      <div class="global-comparison" :class="comparisonClass">
          <div class="comparison-content">
            <p class="comparison-text">{{ comparisonText }}</p>
            <p class="comparison-detail">全球人均每日摄入量：286个</p>
          </div>
        </div>

      <div class="analysis-section">
        <h3>摄入分析</h3>
        <div v-html="analysisText"></div>
        <div v-if="isAnalyzing" class="loading">AI正在分析中...</div>
      </div>

      <div class="result-tips">
        <h3>健康建议</h3>
        <div v-html="healthTips"></div>
      </div>

      <div class="ai-analysis-dialog">
        <h3>AI分析助手</h3>
        <div class="input-group">
          <input 
            v-model="userInput" 
            placeholder="输入你摄入的微塑料数据..." 
            @keyup.enter="handleSubmit"
          />
          <button @click="handleSubmit" :disabled="isLoading">
            {{ isLoading ? '分析中...' : '提交' }}
          </button>
        </div>
        <div class="response" :class="{ 'loading': isLoading }" v-html="responseText">
        </div>
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
import { computed, onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import { marked } from 'marked'

export default {
  name: 'Result',
  setup() {
    const store = useStore()
    const router = useRouter()
    let chart = null
    const isAnalyzing = ref(false)
    const isLoadingTips = ref(false)
    const retryCount = ref(0)
    const maxRetries = 3

    const formatNumber = (num) => {
      return num.toLocaleString('zh-CN', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
      })
    }

    const formatPercent = (value, total) => {
      return ((value / total) * 100).toFixed(1)
    }

    const totalPlastics = computed(() => store.getters.totalPlastics)

    const comparisonClass = computed(() => {
      const total = totalPlastics.value.total
      const percentage = ((total - 286) / 286) * 100
      if (total <= 286) return 'below-average'
      if (percentage <= 20) return 'slightly-above'
      return 'significantly-above'
    })

    const comparisonText = computed(() => {
      const total = totalPlastics.value.total
      const percentage = (((total - 286) / 286) * 100).toFixed(2)
      if (total <= 286) return '您的微塑料摄入量低于全球平均水平'
      return `您的微塑料摄入量超过全球平均水平${percentage}%`
    })

    const categoryNames = {
      water: '环境水源',
      food: '食品摄入',
      air: '空气暴露',
      dailyItems: '日用品释放',
      clothing: '衣物与纺织品',
      diet: '饮食习惯',
      total: '总计'
    }

    const getCategoryName = (category) => categoryNames[category] || category

    const analysisText = ref('正在生成分析报告...')

    const healthTips = ref('正在生成健康建议...')

    const initChart = () => {
      const chartDom = document.getElementById('microplasticsChart')
      if (!chartDom) return

      chart = echarts.init(chartDom)
      
      const sources = [
        { name: '环境水源', value: totalPlastics.value.water },
        { name: '食品摄入', value: totalPlastics.value.food },
        { name: '空气暴露', value: totalPlastics.value.air },
        { name: '日用品释放', value: totalPlastics.value.dailyItems },
        { name: '衣物与纺织品', value: totalPlastics.value.clothing },
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

    const callSiliconFlowAI = async (userMessage) => {
      const API_KEY = 'sk-ncewliubkpafiwcejozjqvycdcbacwrjvlqkvjfdxdazwdqy'
      const endpoint = 'https://api.siliconflow.cn/v1/chat/completions'

      const payload = {
        model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
        messages: [
          { role: "system", content: "你是一个专业的微塑料健康评估助手。" },
          { role: "user", content: userMessage }
        ],
        stream: false,
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error(`请求失败：${res.status}`)

      const result = await res.json()
      return result.choices[0].message.content
    }

    const getAIAnalysis = async () => {
      try {
        isAnalyzing.value = true
        const sources = [
          { name: '环境水源', value: totalPlastics.value.water },
          { name: '食品摄入', value: totalPlastics.value.food },
          { name: '空气暴露', value: totalPlastics.value.air },
          { name: '日用品释放', value: totalPlastics.value.dailyItems },
          { name: '衣物与纺织品', value: totalPlastics.value.clothing },
          { name: '饮食习惯', value: totalPlastics.value.diet }
        ].sort((a, b) => b.value - a.value)

        const top3 = sources.slice(0, 3)
        const total = totalPlastics.value.total

        const prompt = `请根据以下数据进行分析（字数限制在150字以内）：
        总微塑料摄入量：${formatNumber(total)}个/天
        主要来源：
        ${top3.map((s, index) => 
          `${index + 1}. ${s.name}: ${formatNumber(s.value)}个/天 (${formatPercent(s.value, total)}%)`
        ).join('\n')}

        请重点分析：
        1. 主要摄入来源及其危害程度
        2. 潜在的健康风险评估
        3. 与普通人群的对比分析`

        const reply = await retryAnalysis(prompt)
        analysisText.value = marked(reply)
      } catch (err) {
        console.error('获取AI分析失败:', err)
        analysisText.value = `<div class="error-message">获取分析结果失败，请点击重试按钮。</div>`
      } finally {
        isAnalyzing.value = false
      }
    }

    const getHealthTips = async () => {
      try {
        isLoadingTips.value = true
        const sources = Object.entries(totalPlastics.value)
          .filter(([key]) => key !== 'total')
          .map(([key, value]) => ({
            name: getCategoryName(key),
            value: value
          }))
        const total = totalPlastics.value.total

        const prompt = `请根据以下数据给出具体可行的改善建议（字数限制在150字以内）：
        总微塑料摄入量：${formatNumber(total)}个/天
        各来源占比：
        ${sources.map(s => 
          `${s.name}: ${formatPercent(s.value, total)}%`
        ).join('\n')}

        请给出：
        1. 针对TOP3来源的具体减少方案
        2. 日常生活中的可执行措施
        3. 长期改善计划建议`

        const reply = await retryAnalysis(prompt)
        healthTips.value = marked(reply)
      } catch (err) {
        console.error('获取健康建议失败:', err)
        healthTips.value = `<div class="error-message">获取健康建议失败，请点击重试按钮。</div>`
      } finally {
        isLoadingTips.value = false
      }
    }

    const retryAnalysis = async (prompt) => {
      while (retryCount.value < maxRetries) {
        try {
          return await callSiliconFlowAI(prompt)
        } catch (err) {
          retryCount.value++
          if (retryCount.value === maxRetries) {
            throw new Error(`分析失败（已重试${maxRetries}次）：${err.message}`)
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount.value))
        }
      }
    }

    onMounted(() => {
      initChart()
      window.addEventListener('resize', () => chart?.resize())
      getAIAnalysis() // 自动获取AI分析
      getHealthTips() // 自动获取健康建议
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

    const userInput = ref('')
    const responseText = ref('等待回复...')
    const isLoading = ref(false)

    const handleSubmit = async () => {
      if (!userInput.value.trim()) return
      
      isLoading.value = true
      responseText.value = 'AI 正在分析...'

      try {
        const prompt = `请根据以下问题给出分析（字数限制在100字以内）：
        ${userInput.value}`

        const reply = await callSiliconFlowAI(prompt)
        responseText.value = marked(reply)
      } catch (err) {
        responseText.value = `错误：${err.message}`
      } finally {
        isLoading.value = false
      }
    }

    return {
      totalPlastics,
      getCategoryName,
      analysisText,
      healthTips,
      previousPage,
      restart,
      userInput,
      responseText,
      isLoading,
      handleSubmit,
      isAnalyzing,
      isLoadingTips,
      formatNumber,
      formatPercent,
      getAIAnalysis,
      getHealthTips,
      comparisonClass,
      comparisonText
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

.analysis-section,
.result-tips {
  background: rgba(129, 216, 208, 0.1);
  padding: 20px;
  border-radius: 8px;
  margin: 15px 0;
  min-height: auto;
  overflow: visible;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.analysis-section h3,
.result-tips h3 {
  color: var(--tiffany-dark);
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.analysis-section p,
.result-tips p {
  line-height: 1.8;
  color: var(--text-primary);
  margin: 0;
  font-size: 1rem;
  white-space: pre-line;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.loading {
  color: var(--tiffany-blue);
  font-style: italic;
  text-align: center;
  margin-top: 10px;
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

.ai-analysis-dialog {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.ai-analysis-dialog h3 {
  color: var(--tiffany-dark);
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.input-group input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid var(--tiffany-blue);
  border-radius: 20px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.input-group input:focus {
  border-color: var(--tiffany-dark);
  box-shadow: 0 0 0 2px rgba(129, 216, 208, 0.2);
}

.input-group button {
  background: var(--tiffany-blue);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.input-group button:hover:not(:disabled) {
  background: var(--tiffany-dark);
  transform: translateY(-2px);
}

.input-group button:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.response {
  background: rgba(129, 216, 208, 0.1);
  padding: 15px;
  border-radius: 8px;
  line-height: 1.8;
  white-space: pre-line;
  max-height: none;
  overflow: visible;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.response.loading {
  color: var(--tiffany-blue);
  font-style: italic;
}

.analysis-section :deep(p),
.result-tips :deep(p),
.response-area :deep(p) {
  line-height: 1.8;
  color: var(--text-primary);
  margin: 10px 0;
  font-size: 1rem;
  white-space: pre-line;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.analysis-section :deep(strong),
.result-tips :deep(strong),
.response-area :deep(strong) {
  color: var(--tiffany-dark);
  font-weight: 600;
  padding: 0 2px;
}

.analysis-section :deep(em),
.result-tips :deep(em),
.response-area :deep(em) {
  font-style: italic;
  color: var(--text-secondary);
  padding: 0 2px;
}

.analysis-section :deep(ul),
.result-tips :deep(ul),
.response-area :deep(ul) {
  list-style-type: none;
  padding-left: 0;
  margin: 10px 0;
}

.analysis-section :deep(li),
.result-tips :deep(li),
.response-area :deep(li) {
  position: relative;
  padding-left: 25px;
  margin: 8px 0;
  line-height: 1.6;
}

.analysis-section :deep(li)::before,
.result-tips :deep(li)::before,
.response-area :deep(li)::before {
  content: "•";
  color: var(--tiffany-blue);
  font-size: 1.2em;
  position: absolute;
  left: 0;
  top: 0;
}

.analysis-section :deep(h1),
.result-tips :deep(h1),
.response-area :deep(h1),
.analysis-section :deep(h2),
.result-tips :deep(h2),
.response-area :deep(h2),
.analysis-section :deep(h3),
.result-tips :deep(h3),
.response-area :deep(h3) {
  color: var(--tiffany-dark);
  margin: 15px 0 10px;
  font-weight: 600;
}

.analysis-section :deep(blockquote),
.result-tips :deep(blockquote),
.response-area :deep(blockquote) {
  border-left: 4px solid var(--tiffany-blue);
  padding-left: 15px;
  margin: 10px 0;
  color: var(--text-secondary);
  font-style: italic;
}

.analysis-section :deep(code),
.result-tips :deep(code),
.response-area :deep(code) {
  background: rgba(129, 216, 208, 0.1);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.analysis-section :deep(pre),
.result-tips :deep(pre),
.response-area :deep(pre) {
  background: rgba(129, 216, 208, 0.1);
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 10px 0;
}

.analysis-section :deep(pre code),
.result-tips :deep(pre code),
.response-area :deep(pre code) {
  background: none;
  padding: 0;
}

.analysis-section :deep(a),
.result-tips :deep(a),
.response-area :deep(a) {
  color: var(--tiffany-blue);
  text-decoration: none;
  border-bottom: 1px solid var(--tiffany-blue);
  transition: all 0.3s ease;
}

.analysis-section :deep(a):hover,
.result-tips :deep(a):hover,
.response-area :deep(a):hover {
  color: var(--tiffany-dark);
  border-bottom-color: var(--tiffany-dark);
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

  .analysis-section,
  .result-tips {
    padding: 15px;
    margin: 12px 0;
  }

  .analysis-section h3,
  .result-tips h3 {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }

  .analysis-section p,
  .result-tips p {
    font-size: 0.9rem;
    line-height: 1.6;
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

  .ai-analysis-dialog {
    padding: 15px;
    margin-top: 15px;
  }

  .input-group {
    flex-direction: column;
  }

  .input-group button {
    width: 100%;
  }

  .analysis-section :deep(p),
  .result-tips :deep(p),
  .response-area :deep(p) {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .analysis-section :deep(li),
  .result-tips :deep(li),
  .response-area :deep(li) {
    font-size: 0.9rem;
    padding-left: 20px;
  }

  .analysis-section :deep(h1),
  .result-tips :deep(h1),
  .response-area :deep(h1),
  .analysis-section :deep(h2),
  .result-tips :deep(h2),
  .response-area :deep(h2),
  .analysis-section :deep(h3),
  .result-tips :deep(h3),
  .response-area :deep(h3) {
    font-size: 1.1rem;
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

.result-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.analysis-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .icon {
  font-size: 24px;
  color: #1890ff;
}

.data-display {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.total-intake {
  font-size: 24px;
  color: #1890ff;
  font-weight: bold;
  margin-bottom: 12px;
}

.source-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.source-item {
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.source-name {
  color: #666;
  margin-bottom: 4px;
}

.source-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.source-percent {
  color: #1890ff;
  font-size: 14px;
  margin-left: 8px;
}

.analysis-content {
  line-height: 1.8;
  color: #333;
}

.analysis-content h1,
.analysis-content h2,
.analysis-content h3 {
  margin-top: 16px;
  margin-bottom: 8px;
  color: #222;
}

.analysis-content ul,
.analysis-content ol {
  padding-left: 20px;
  margin: 12px 0;
}

.analysis-content li {
  margin-bottom: 8px;
}

.error-message {
  color: #ff4d4f;
  padding: 16px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  text-align: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.retry-button {
  margin-top: 16px;
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.retry-button:hover {
  background: #40a9ff;
}

@media (max-width: 768px) {
  .result-container {
    padding: 12px;
  }
  
  .analysis-section {
    padding: 16px;
  }
  
  .source-list {
    grid-template-columns: 1fr;
  }
  
  .total-intake {
    font-size: 20px;
  }
}

.global-comparison {
  margin: 20px 0;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.global-comparison.below-average {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
  border: 2px solid rgba(76, 175, 80, 0.3);
  color: #2E7D32;
}

.global-comparison.slightly-above {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 193, 7, 0.05));
  border: 2px solid rgba(255, 193, 7, 0.3);
  color: #FF8F00;
}

.global-comparison.significantly-above {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.05));
  border: 2px solid rgba(244, 67, 54, 0.3);
  color: #D32F2F;
}

.comparison-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
}

.comparison-content::before {
  display: none;
}

.comparison-text {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  padding-top: 8px;
}

.comparison-detail {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .global-comparison {
    margin: 15px 0;
    padding: 15px;
  }

  .comparison-text {
    font-size: 1.1rem;
  }

  .comparison-detail {
    font-size: 0.9rem;
  }
}
</style> 