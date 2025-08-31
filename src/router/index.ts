import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import RandomizeView from '../views/RandomizeView.vue'

// Utilisation de createWebHashHistory pour GitHub Pages
// Cela permet d'éviter les problèmes de rafraîchissement de page
const router = createRouter({
  history: createWebHashHistory('/Oisogs/'),
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
      component: RandomizeView,
    },
  ],
})

export default router
