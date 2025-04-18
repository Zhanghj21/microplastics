import { createRouter, createWebHistory } from 'vue-router'
import Introduction from '../views/Introduction.vue'
import WaterSource from '../views/WaterSource.vue'
import Food from '../views/Food.vue'
import Air from '../views/Air.vue'
import DailyItems from '../views/DailyItems.vue'
import Clothing from '../views/Clothing.vue'
import Diet from '../views/Diet.vue'
import Result from '../views/Result.vue'

const routes = [
  {
    path: '/',
    name: 'Introduction',
    component: Introduction
  },
  {
    path: '/water-source',
    name: 'WaterSource',
    component: WaterSource
  },
  {
    path: '/food',
    name: 'Food',
    component: Food
  },
  {
    path: '/air',
    name: 'Air',
    component: Air
  },
  {
    path: '/daily-items',
    name: 'DailyItems',
    component: DailyItems
  },
  {
    path: '/clothing',
    name: 'Clothing',
    component: Clothing
  },
  {
    path: '/diet',
    name: 'Diet',
    component: Diet
  },
  {
    path: '/result',
    name: 'Result',
    component: Result
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 