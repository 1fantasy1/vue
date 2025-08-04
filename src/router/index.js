import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
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
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/knowledge',
    name: 'Knowledge',
    component: KnowledgeHub
  },
  {
    path: '/plaza',
    name: 'Plaza',
    component: Plaza
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/my-projects',
    name: 'MyProjects',
    component: MyProjects
  },
  {
    path: '/my-courses',
    name: 'MyCourses',
    component: MyCourses
  },
  {
    path: '/chat-rooms',
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
