import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useGlobalStore } from '../stores/global'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import KnowledgeHub from '../views/KnowledgeHub.vue'
import KnowledgeBase from '../views/KnowledgeBase.vue'
import Plaza from '../views/Plaza.vue'
import Profile from '../views/Profile.vue'
import MyProjects from '../views/MyProjects.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import ProjectRecommendations from '../views/ProjectRecommendations.vue'
import AllProjects from '../views/AllProjects.vue'
import MyCourses from '../views/MyCourses.vue'
import CourseDetail from '../views/CourseDetail.vue'
import CourseBrowser from '../views/CourseBrowser.vue'
import CourseManagement from '../views/CourseManagement.vue'
import ChatRooms from '../views/ChatRooms.vue'
import CourseNotes from '../views/CourseNotes.vue'
import Favorites from '../views/Favorites.vue'
import QuickNotes from '../views/QuickNotes.vue'
import DevTools from '../views/DevTools.vue'
import CollectionDetail from '../views/CollectionDetail.vue'
import DocumentDetail from '../views/DocumentDetail.vue'

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
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: ProjectDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/project-recommendations',
    name: 'ProjectRecommendations',
    component: ProjectRecommendations,
    meta: { requiresAuth: true }
  },
  {
    path: '/all-projects',
    name: 'AllProjects',
    component: AllProjects,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-courses',
    name: 'MyCourses',
    component: MyCourses,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses',
    name: 'CourseBrowser',
    component: CourseBrowser,
    meta: { requiresAuth: true }
  },
  {
    path: '/courses/:id',
    name: 'CourseDetail',
    component: CourseDetail,
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
    path: '/collections/:id',
    name: 'CollectionDetail',
    component: CollectionDetail,
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
  },
  {
    path: '/knowledge-bases/:kbId/documents/:docId',
    name: 'DocumentDetail',
    component: DocumentDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/dev-tools',
    name: 'DevTools',
    component: DevTools,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/courses',
    name: 'CourseManagement',
    component: CourseManagement,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: window.navigator.userAgent.indexOf('Electron') !== -1 
    ? createWebHashHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const globalStore = useGlobalStore()
  
  // 初始化认证状态
  globalStore.initAuth()
  
  const isAuthenticated = globalStore.checkAuth()
  
  // 如果需要认证但用户未登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login')
      return
    }
  }

  // 管理员权限校验
  if (to.matched.some(record => record.meta.requiresAdmin)) {
    // 兼容两种来源：localStorage 与 store 中的用户角色
    const lsRole = (localStorage.getItem('userRole') || '').toLowerCase()
    const storeUser = globalStore.user || {}
    const storeRole = (storeUser.role || (Array.isArray(storeUser.roles) ? storeUser.roles[0] : '') || '').toLowerCase()
    const isAdmin = lsRole === 'admin' || storeRole === 'admin'

    if (!isAdmin) {
      // 无权限，跳回首页并带上提示参数
      next({ path: '/', query: { forbidden: 'admin' } })
      return
    }
  }
  
  // 如果是登录页面但用户已登录
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next('/')
      return
    }
  }
  
  next()
})

export default router
