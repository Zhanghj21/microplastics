<template>
  <div class="language-switch">
    <select v-model="currentLocale" @change="switchLanguage" class="language-select">
      <option value="zh">中文</option>
      <option value="en">English</option>
    </select>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

const switchLanguage = () => {
  locale.value = currentLocale.value
  localStorage.setItem('locale', currentLocale.value)
}

onMounted(() => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    currentLocale.value = savedLocale
  }
})
</script>

<style scoped>
.language-switch {
  display: flex;
  align-items: center;
}

.language-select {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: var(--font-size-base);
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 12px;
  padding-right: 28px;
}

.language-select option {
  background: var(--tiffany-dark);
  color: white;
}

@media (max-width: 768px) {
  .language-select {
    font-size: var(--font-size-base);
    padding: 2px 4px;
    padding-right: 24px;
  }
}
</style> 