import { createRouter, createWebHistory } from 'vue-router'
import DemoRealtimeListView from '../views/DemoRealtimeListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/realtime-list',
      name: 'realtime-list',
      component: DemoRealtimeListView
    },
    {
      path: '/realtime-value',
      name: 'realtime-value',
      component: () => import('../views/DemoRealtimeValueView.vue')
    }
  ]
})

export default router
