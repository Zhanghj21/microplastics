<template>
  <div class="introduction-page">
    <div class="intro-card">
      <h1>微塑料健康评估系统</h1>
      <div class="intro-content">
        <div class="section">
          <h2>评估流程说明</h2>
          <p>本评估系统共包含6个部分，每个部分都包含微塑料说明和表格填写两个环节。</p>
          <div class="process-list">
            <div v-for="(item, index) in processItems" :key="index" class="process-item">
              <div class="process-header" @click="toggleItem(index)">
                <span class="number">{{ index + 1 }}</span>
                <span class="text">{{ item.title }}</span>
              </div>
              <div class="process-details" :class="{ 'details-open': item.isOpen }">
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="section">
          <h2>评估结果</h2>
          <p>完成所有评估后，系统将生成一份详细的微塑料暴露评估报告，包括：</p>
          <ul class="result-list">
            <li>各来源微塑料暴露量分析</li>
            <li>总体暴露风险评估</li>
            <li>个性化防护建议</li>
          </ul>
        </div>
      </div>
      <div class="start-button">
        <button @click="startAssessment">开始评估</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export default {
  name: 'Introduction',
  setup() {
    const router = useRouter()
    const processItems = ref([
      {
        title: '环境水源',
        description: '评估日常饮用水、生活用水等水源中的微塑料暴露情况。',
        isOpen: false
      },
      {
        title: '食品摄入',
        description: '评估日常饮食中可能摄入的微塑料情况。',
        isOpen: false
      },
      {
        title: '空气暴露',
        description: '评估空气中微塑料颗粒的暴露情况。',
        isOpen: false
      },
      {
        title: '日用品释放',
        description: '评估日常用品使用过程中释放的微塑料情况。',
        isOpen: false
      },
      {
        title: '衣物与纺织品',
        description: '评估衣物和纺织品使用过程中产生的微塑料情况。',
        isOpen: false
      },
      {
        title: '饮食习惯',
        description: '评估饮食习惯对微塑料摄入的影响。',
        isOpen: false
      }
    ])

    const toggleItem = (index) => {
      processItems.value[index].isOpen = !processItems.value[index].isOpen
    }

    const startAssessment = () => {
      router.push('/water')
    }

    return {
      processItems,
      toggleItem,
      startAssessment
    }
  }
}
</script>

<style scoped>
.introduction-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.intro-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: var(--tiffany-dark);
  margin-bottom: 30px;
  font-size: 2.2rem;
}

.intro-content {
  margin-bottom: 40px;
}

.section {
  margin-bottom: 30px;
}

.section:last-child {
  margin-bottom: 0;
}

h2 {
  color: var(--tiffany-blue);
  margin-bottom: 15px;
  font-size: 1.5rem;
}

p {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.process-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.process-item {
  background: rgba(129, 216, 208, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.process-header {
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 15px;
}

.process-header:hover {
  background: rgba(129, 216, 208, 0.2);
}

.number {
  background: var(--tiffany-blue);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.text {
  color: var(--text-primary);
  font-weight: 500;
  flex-grow: 1;
}

.process-details {
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.5);
  padding: 0 15px;
}

.details-open {
  max-height: 200px;
  padding: 15px;
}

.process-details p {
  margin: 0;
  color: var(--text-primary);
  line-height: 1.6;
}

.result-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.result-list li {
  padding: 10px 0;
  color: var(--text-primary);
  position: relative;
  padding-left: 25px;
}

.result-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--tiffany-blue);
  font-weight: bold;
}

.start-button {
  text-align: center;
  margin-top: 30px;
}

button {
  background: var(--tiffany-blue);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: var(--tiffany-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .intro-card {
    padding: 20px;
  }

  h1 {
    font-size: 1.8rem;
  }

  .process-list {
    grid-template-columns: 1fr;
  }

  button {
    width: 100%;
    padding: 12px 20px;
  }

  .process-item {
    width: 100%;
  }
  
  .process-details {
    margin-left: 45px;
  }
}

@media (min-width: 769px) {
  .process-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .process-item {
    width: 100%;
  }
  
  .process-details {
    position: relative;
    max-height: 200px;
    padding: 15px;
    background: rgba(255, 255, 255, 0.5);
    margin-left: 45px;
  }

  .process-header {
    cursor: pointer;
  }

  .process-header:hover {
    background: rgba(129, 216, 208, 0.2);
  }
}
</style> 