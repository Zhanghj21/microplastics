import { createI18n } from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'

const messages = {
  zh,
  en
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh', // 默认语言
  fallbackLocale: 'en', // 回退语言
  messages
})

export default i18n 