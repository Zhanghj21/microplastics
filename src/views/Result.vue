<template>
  <div class="survey-page">
    <div class="page-header">
      <h2>{{ $t('result.title') }}</h2>
    </div>

    <div class="result-content">
      <div class="result-section">
        <h3>{{ $t('result.overall.title') }}</h3>
        <p class="result-summary">{{ $t('result.overall.summary') }}</p>
      </div>

      <div class="chart-title">
        <h3>{{ $t('result.chart.title') }}</h3>
        <p class="chart-subtitle">{{ $t('result.chart.subtitle') }}</p>
      </div>

      <div id="microplasticsChart" class="chart-container"></div>

      <div class="category-results">
        <div class="category-item" v-for="(amount, category) in totalPlastics" :key="category">
          <h4>{{ $t(`result.categories.${category}`) }}</h4>
          <p class="amount">{{ amount.toLocaleString() }} {{ $t('result.total.unit') }}</p>
        </div>
      </div>

      <div class="total-result">
        <h3>{{ $t('result.total.title') }}</h3>
        <p class="total-amount">{{ totalPlastics.total.toLocaleString() }} {{ $t('result.total.unit') }}</p>
      </div>

      <div class="global-comparison" :class="comparisonClass">
        <div class="comparison-content">
          <p class="comparison-text">{{ comparisonText }}</p>
          <p class="comparison-detail">{{ $t('result.comparison.average') }}</p>
        </div>
      </div>

      <div class="analysis-section">
        <h3>{{ $t('result.analysis.title') }}</h3>
        <div v-html="analysisText"></div>
        <div v-if="isAnalyzing" class="loading">{{ $t('result.analysis.loading') }}</div>
      </div>

      <div class="result-tips">
        <h3>{{ $t('result.tips.title') }}</h3>
        <div v-html="healthTips"></div>
      </div>

      <div class="ai-analysis-dialog">
        <h3>{{ $t('result.ai.title') }}</h3>
        <div class="input-group">
          <input 
            v-model="userInput" 
            :placeholder="$t('result.ai.placeholder')"
            @keyup.enter="handleSubmit"
          />
          <button @click="handleSubmit" :disabled="isLoading">
            {{ isLoading ? $t('result.ai.loading') : $t('result.ai.submit') }}
          </button>
        </div>
        <div class="response" :class="{ 'loading': isLoading }" v-html="responseText">
        </div>
      </div>
    </div>

    <div class="navigation-buttons">
      <button class="prev-button" @click="previousPage">{{ $t('result.navigation.previous') }}</button>
      <button class="restart-button" @click="restart">{{ $t('result.navigation.restart') }}</button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import * as echarts from 'echarts'
import { marked } from 'marked'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Result',
  setup() {
    const store = useStore()
    const router = useRouter()
    const { t, locale } = useI18n()
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
      if (total <= 286) return t('result.comparison.below')
      return t('result.comparison.above', [percentage])
    })

    const analysisText = ref(t('result.analysis.loading'))

    const healthTips = ref(t('result.tips.loading'))

    const getCategoryName = (category) => {
      return t(`result.categories.${category}`)
    }

    const initChart = () => {
      const chartDom = document.getElementById('microplasticsChart')
      if (!chartDom) return

      chart = echarts.init(chartDom)
      
      const sources = [
        { name: t('result.categories.water'), value: totalPlastics.value.water },
        { name: t('result.categories.food'), value: totalPlastics.value.food },
        { name: t('result.categories.air'), value: totalPlastics.value.air },
        { name: t('result.categories.dailyItems'), value: totalPlastics.value.dailyItems },
        { name: t('result.categories.clothing'), value: totalPlastics.value.clothing },
        { name: t('result.categories.diet'), value: totalPlastics.value.diet }
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
            if (params.name === t('result.chart.others')) {
              const othersList = others.map(item => `${item.name}: ${item.value}`).join('<br/>')
              return `${t('result.chart.others')} (${othersSum})<br/>${othersList}`
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
            name: t('result.chart.seriesName'),
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
                name: t('result.chart.others'), 
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

    const requestQueue = ref([])
    const isProcessing = ref(false)

    const addToQueue = (prompt) => {
      return new Promise((resolve, reject) => {
        requestQueue.value.push({ prompt, resolve, reject })
        if (!isProcessing.value) {
          processQueue()
        }
      })
    }

    const processQueue = async () => {
      if (isProcessing.value || requestQueue.value.length === 0) return

      isProcessing.value = true
      const request = requestQueue.value[0]

      try {
        const result = await callSiliconFlowAI(request.prompt)
        request.resolve(result)
      } catch (err) {
        console.error('处理队列请求失败:', err)
        request.reject(err)
      } finally {
        requestQueue.value.shift()
        isProcessing.value = false
        
        // 如果队列中还有请求，等待3秒后处理下一个
        if (requestQueue.value.length > 0) {
          setTimeout(processQueue, 3000)
        }
      }
    }

    const callSiliconFlowAI = async (userMessage) => {
      const API_KEY = 'sk-ncewliubkpafiwcejozjqvycdcbacwrjvlqkvjfdxdazwdqy'
      const endpoint = 'https://api.siliconflow.cn/v1/chat/completions'

      // 根据当前语言设置不同的系统提示
      const systemPrompt = locale.value === 'zh' 
        ? `${t('result.ai.systemPrompt')}\n\n请确保回复内容完整且简洁，包含所有要点，并且字数不超过100字。\n请注意：\n1. 回复必须是完整的，不能中途截断\n2. 需要包含所有关键信息\n3. 语言要简洁明了\n4. 确保两个分析（摄入分析和健康建议）都能得到完整的回复`
        : `${t('result.ai.systemPrompt')}\n\nPlease ensure your response is complete and concise, covering all key points, and does not exceed 150 words.\nPlease note:\n1. The response must be complete, not truncated\n2. All key information must be included\n3. Language should be clear and concise\n4. Ensure both analyses (Intake Analysis and Health Tips) receive complete responses\n5. Please respond in English only, do not include any Chinese characters`

      const payload = {
        model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        stream: false,
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.6
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error(t('result.ai.error', [res.status]))

      const result = await res.json()
      let content = result.choices[0].message.content

      // 检查内容是否完整
      if (locale.value === 'zh') {
        if (!content.endsWith('。') && !content.endsWith('!') && !content.endsWith('?') && !content.endsWith('！') && !content.endsWith('？')) {
          content += '。' // 如果内容没有以标点符号结束，添加句号
        }
      } else {
        if (!content.endsWith('.') && !content.endsWith('!') && !content.endsWith('?')) {
          content += '.' // 如果内容没有以标点符号结束，添加句号
        }
      }

      return content
    }

    const getAIAnalysis = async () => {
      try {
        isAnalyzing.value = true
        const sources = [
          { name: t('result.categories.water'), value: totalPlastics.value.water },
          { name: t('result.categories.food'), value: totalPlastics.value.food },
          { name: t('result.categories.air'), value: totalPlastics.value.air },
          { name: t('result.categories.dailyItems'), value: totalPlastics.value.dailyItems },
          { name: t('result.categories.clothing'), value: totalPlastics.value.clothing },
          { name: t('result.categories.diet'), value: totalPlastics.value.diet }
        ].sort((a, b) => b.value - a.value)

        const top3 = sources.slice(0, 3)
        const total = totalPlastics.value.total

        const prompt = t('result.analysis.prompt', {
          total: formatNumber(total),
          sources: top3.map((s, index) => 
            `${index + 1}. ${s.name}: ${formatNumber(s.value)}${t('result.total.unit')}/天 (${formatPercent(s.value, total)}%)`
          ).join('\n')
        })

        const reply = await addToQueue(prompt)
        analysisText.value = marked(reply)
      } catch (err) {
        console.error(t('result.analysis.error'), err)
        analysisText.value = `<div class="error-message">${t('result.analysis.errorMessage')}</div>`
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

        const prompt = t('result.tips.prompt', {
          total: formatNumber(total),
          sources: sources.map(s => 
            `${s.name}: ${formatPercent(s.value, total)}%`
          ).join('\n')
        })

        const reply = await addToQueue(prompt)
        healthTips.value = marked(reply)
      } catch (err) {
        console.error(t('result.tips.error'), err)
        healthTips.value = `<div class="error-message">${t('result.tips.errorMessage')}</div>`
      } finally {
        isLoadingTips.value = false
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
    const responseText = ref(t('result.ai.waiting'))
    const isLoading = ref(false)

    const handleSubmit = async () => {
      if (!userInput.value.trim()) return
      
      isLoading.value = true
      responseText.value = t('result.ai.loading')

      try {
        const prompt = t('result.ai.userPrompt', [userInput.value])
        const reply = await callSiliconFlowAI(prompt)
        responseText.value = marked(reply)
      } catch (err) {
        responseText.value = t('result.ai.error', [err.message])
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