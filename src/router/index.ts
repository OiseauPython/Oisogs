import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SearchView from '../views/SearchView.vue'
import AboutView from '../views/AboutView.vue'
import RandomizeView from '../views/RandomizeView.vue'

const router = createRouter({
  history: createWebHashHistory('/Oisogs/'),
  scrollBehavior: () => ({ top: 0, behavior: 'instant' }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
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
