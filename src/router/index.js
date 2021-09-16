import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Profile from '../views/Profile.vue'
import Message from '../views/Message.vue'
import StarterStore from '../views/StarterStore.vue'
import Inventory from '../views/Inventory.vue'
import Fixtures from '../views/Fixtures.vue'
import Leaderboard from '../views/Leaderboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/profile/:id',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/message',
    name: 'Message',
    component: Message
  },
  {
    path: '/starter-store',
    name: 'StarterStore',
    component: StarterStore
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory
  },
  {
    path: '/fixtures',
    name: 'Fixtures',
    component: Fixtures
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
