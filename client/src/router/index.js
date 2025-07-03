import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/cuda',
      name: 'cuda',
      component: () => import('../views/CudaView.vue')
    },
    {
      path: '/crud/village',
      name: 'crudVillage',
      component: () => import('../components/cudaviews/CrudVillageView.vue')
    },
    {
      path: '/crud/village2',
      name: 'crudVillage2',
      component: () => import('../components/cudaviews/CrudVillageView2.vue')
    },
    {
      path: '/crud/create',
      name: 'crudCreate',
      component: () => import('../components/cudaviews/CrudCreateView.vue')
    },
    {
      path: '/crud/month',
      name: 'crudMonth',
      component: () => import('../components/cudaviews/CrudMonthView.vue')
    },
    {
      path: '/crud/list',
      name: 'crudList',
      component: () => import('../components/cudaviews/CrudListView.vue')
    },
    {
      path: '/birth',
      name: 'birth',
      component: () => import('../views/BirthView.vue')
    },
    {
      path: '/birth/total',
      name: 'birthTotal',
      component: () => import('../components/birthviews/BirthTotalView.vue')
    },
    {
      path: '/birth/trend',
      name: 'birthTrend',
      component: () => import('../components/birthviews/BirthTrendView.vue')
    },
    {
      path: '/death',
      name: 'death',
      component: () => import('../views/DeathView.vue')
    },
    {
      path: '/death/total',
      name: 'deathTotal',
      component: () => import('../components/deathviews/DeathTotalView.vue')
    },
    {
      path: '/death/ratio',
      name: 'deathRatio',
      component: () => import('../components/deathviews/DeathRatioView.vue')
    },
    {
      path: '/death/trend',
      name: 'deathTrend',
      component: () => import('../components/deathviews/DeathTrendView.vue')
    },
    {
      path: '/marry',
      name: 'marry',
      component: () => import('../views/MarryView.vue')
    },
    {
      path: '/marry/total',
      name: 'marryTotal',
      component: () => import('../components/marryviews/MarryTotalView.vue')
    },
    {
      path: '/marry/trend',
      name: 'marryTrend',
      component: () => import('../components/marryviews/MarryTrendView.vue')
    },
    {
      path: '/divorce',
      name: 'divorce',
      component: () => import('../views/DivorceView.vue')
    },
    {
      path: '/divorce/total',
      name: 'divorceTotal',
      component: () => import('../components/divorceviews/DivorceTotalView.vue')
    },
    {
      path: '/divorce/trend',
      name: 'divorceTrend',
      component: () => import('../components/divorceviews/DivorceTrendView.vue')
    }
  ]
})

export default router
