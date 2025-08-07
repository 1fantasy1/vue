import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useGlobalStore } from '../stores/global'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import KnowledgeHub from '../views/KnowledgeHub.vue'
import KnowledgeBase from '../views/KnowledgeBase.vue'
import Plaza from '../views/Plaza.vue'
import Profile from '../views/Profile.vue'
import MyProjects from '../views/MyProjects.vue'
import MyCourses from '../views/MyCourses.vue'
import ChatRooms from '../views/ChatRooms.vue'
import CourseNotes from '../views/CourseNotes.vue'
import Favorites from '../views/Favorites.vue'
import QuickNotes from '../views/QuickNotes.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } // 只有未登录用户可以访问
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: KnowledgeHub,
    meta: { requiresAuth: true }
  },
  {
    path: '/plaza',
    name: 'Plaza',
    component: Plaza,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-projects',
    name: 'MyProjects',
    component: MyProjects,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-courses',
    name: 'MyCourses',
    component: MyCourses,
    meta: { requiresAuth: true }
  },
  {
    path: '/chat-rooms',
    name: 'ChatRooms',
    component: ChatRooms,
    meta: { requiresAuth: true }
  },
  {
    path: '/course-notes',
    name: 'CourseNotes',
    component: CourseNotes,
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { requiresAuth: true }
  },
  {
    path: '/quick-notes',
    name: 'QuickNotes',
    component: QuickNotes,
    meta: { requiresAuth: true }
  },
  {
    path: '/knowledge-hub',
    name: 'KnowledgeBase',
    component: KnowledgeBase,
    meta: { requiresAuth: true }
  }
]
    name: 'ChatRooms',
    component: ChatRooms
  },
  {
    path: '/course-notes',
    name: 'CourseNotes',
    component: CourseNotes
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites
  },
  {
    path: '/quick-notes',
    name: 'QuickNotes',
    component: QuickNotes
  },
  {
    path: '/knowledge-hub',
    name: 'KnowledgeBase',
    component: KnowledgeBase
  }
]

const router = createRouter({
  history: window.navigator.userAgent.indexOf('Electron') !== -1 
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
