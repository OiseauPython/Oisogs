import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'

const router = createRouter({
  // Utilisation de createWebHashHistory pour GitHub Pages
  // Cela permet d'éviter les problèmes de rafraîchissement de page
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/randomize',
      name: 'randomize',
      component: AboutView,
    },
  ],
})

export default router
