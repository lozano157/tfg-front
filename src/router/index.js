import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/paradas',
      name: 'paradas',
      component: () => import('../views/Paradas/TpsParadas.vue')
    },
    {
      path: '/pruebas',
      name: 'pruebas',
      component: () => import('../views/Prueba.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/User/TpsLogin.vue')
    },
    {
      path: '/alertas',
      name: 'alertas',
      component: () => import('../views/Alertas/TpsAlertasMailView.vue')
    },
    {
      path:'/avisos',
      name: 'avisos',
      component: () => import('../views/Avisos/TpsAvisosUsuario.vue')
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: () => import('../views/Favoritos/TpsFavoritos.vue')
    }
  ]
})

export default router
