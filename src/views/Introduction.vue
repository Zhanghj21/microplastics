<template>
  <div class="introduction-page">
    <div class="header">
      <h1>{{ $t('introduction.title') }}</h1>
    </div>
    
    <div class="content">
      <div class="process-section">
        <h2>{{ $t('introduction.process.title') }}</h2>
        <p>{{ $t('introduction.process.description') }}</p>
        
        <div class="process-items">
          <div v-for="(item, index) in processItems" :key="index" class="process-item">
            <div class="item-number">{{ index + 1 }}</div>
            <div class="item-content">
              <div class="item-header" @click="toggleItem(index)">
                <h3>{{ item.title }}</h3>
              </div>
              <div class="item-description" :class="{ 'expanded': isExpanded[index] }">
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <h2>{{ $t('introduction.result.title') }}</h2>
        <p>{{ $t('introduction.result.description') }}</p>
        
        <ul class="result-items">
          <li v-for="(item, index) in resultItems" :key="index">
            <span class="checkmark">✓</span>
            <span class="item-text">{{ item }}</span>
          </li>
        </ul>
      </div>
      
      <div class="start-section">
        <button @click="startAssessment" class="start-button">
          {{ $t('introduction.startButton') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Introduction',
  data() {
    return {
      isExpanded: Array(6).fill(false)
    }
  },
  computed: {
    processItems() {
      return [
        {
          title: this.$t('introduction.process.items[0].title'),
          description: this.$t('introduction.process.items[0].description')
        },
        {
          title: this.$t('introduction.process.items[1].title'),
          description: this.$t('introduction.process.items[1].description')
        },
        {
          title: this.$t('introduction.process.items[2].title'),
          description: this.$t('introduction.process.items[2].description')
        },
        {
          title: this.$t('introduction.process.items[3].title'),
          description: this.$t('introduction.process.items[3].description')
        },
        {
          title: this.$t('introduction.process.items[4].title'),
          description: this.$t('introduction.process.items[4].description')
        },
        {
          title: this.$t('introduction.process.items[5].title'),
          description: this.$t('introduction.process.items[5].description')
        }
      ]
    },
    resultItems() {
      return [
        this.$t('introduction.result.items[0]'),
        this.$t('introduction.result.items[1]'),
        this.$t('introduction.result.items[2]')
      ]
    }
  },
  methods: {
    startAssessment() {
      this.$router.push('/water-source')
    },
    toggleItem(index) {
      this.isExpanded[index] = !this.isExpanded[index]
    }
  }
}
</script>

<style scoped>
.introduction-page {
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

.process-section,
.result-section {
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

.process-items {
  display: grid;
  gap: 20px;
}

.process-item {
  display: flex;
  align-items: flex-start;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.process-item:hover {
  background: #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.item-number {
  background: #81D8D0;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  flex-shrink: 0;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 3px;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
  min-height: 36px;
}

.item-header h3 {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-header:hover h3 {
  color: #81D8D0;
}

.item-description {
  max-height: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(-10px);
  margin-top: 0;
}

.item-description.expanded {
  max-height: 500px;
  opacity: 1;
  transform: translateY(0);
}

.item-description p {
  margin-top: 10px;
  margin-bottom: 0;
  padding-left: 5px;
  border-left: 3px solid #81D8D0;
  padding-left: 15px;
}

.result-items {
  list-style-type: none;
  padding: 0;
}

.result-items li {
  background: #f8f9fa;
  padding: 15px 20px;
  margin-bottom: 10px;
  border-radius: 8px;
  font-size: 1.1rem;
  color: #444;
  display: flex;
  align-items: center;
  border: 1px solid #e0e0e0;
}

.checkmark {
  color: #81D8D0;
  font-weight: bold;
  margin-right: 10px;
}

.item-text {
  flex: 1;
}

.start-section {
  text-align: center;
  margin-top: 40px;
}

.start-button {
  background: #81D8D0;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.start-button:hover {
  background: #6BC4BC;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .introduction-page {
    padding: 15px;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .content {
    padding: 20px;
  }
  
  h2 {
    font-size: 1.5rem;
  }
  
  .process-item {
    padding: 15px;
  }
  
  .item-number {
    width: 25px;
    height: 25px;
    margin-right: 10px;
    margin-top: 2px;
  }
  
  .item-header {
    min-height: 30px;
  }
  
  .item-header h3 {
    font-size: 1.1rem;
  }
}
</style> 