import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/realtime-list',
      name: 'realtime-list',
      component: () => import('../views/DemoRealtimeListView.vue')
    },
    {
      path: '/realtime/:id',
      name: 'realtime',
      component: () => import('../views/DemoRealtimeView.vue')
    }
  ]
})

export default router
