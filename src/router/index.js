import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/paradas',
      name: 'paradas',
      component: () => import('../views/Paradas/TpsLeaflet.vue')
    },
    {
      path: '/pruebas',
      name: 'pruebas',
      component: () => import('../views/Prueba.vue')
    },
    /*{
      path: '/favoritos',
      name: 'favoritos',
      component: () => import('../views/FavoritosView.vue')
    }*/
  ]
})

export default router
