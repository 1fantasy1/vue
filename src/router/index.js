import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useGlobalStore } from '../stores/global'
import { config } from '@/config/index.js'
// 视图按需加载，减少首屏体积
const Home = () => import('../views/Home.vue')
const Login = () => import('../views/Login.vue')
const KnowledgeHub = () => import('../views/KnowledgeHub.vue')
const KnowledgeBase = () => import('../views/KnowledgeBase.vue')
const Plaza = () => import('../views/Plaza.vue')
const Profile = () => import('../views/Profile.vue')
const MyProjects = () => import('../views/MyProjects.vue')
const ProjectDetail = () => import('../views/ProjectDetail.vue')
const ProjectRecommendations = () => import('../views/ProjectRecommendations.vue')
const AllProjects = () => import('../views/AllProjects.vue')
const MyCourses = () => import('../views/MyCourses.vue')
const CourseDetail = () => import('../views/CourseDetail.vue')
const CourseBrowser = () => import('../views/CourseBrowser.vue')
const CourseManagement = () => import('../views/CourseManagement.vue')
const ChatRooms = () => import('../views/ChatRooms.vue')
const CourseNotes = () => import('../views/CourseNotes.vue')
const Favorites = () => import('../views/Favorites.vue')
const QuickNotes = () => import('../views/QuickNotes.vue')
const DevTools = () => import('../views/DevTools.vue')
const CollectionDetail = () => import('../views/CollectionDetail.vue')
const DocumentDetail = () => import('../views/DocumentDetail.vue')

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
    ? createWebHashHistory() // Electron环境中不使用baseURL
    : createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const SHOW_LOG = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) || config?.dev?.showApiLogs
  if (SHOW_LOG) {
    console.log('路由守卫:', {
      to: to.path,
      from: from.path,
      isElectron: window.navigator.userAgent.indexOf('Electron') !== -1
    })
  }
  
  const globalStore = useGlobalStore()
  
  // 初始化认证状态
  globalStore.initAuth()
  
  const isAuthenticated = globalStore.checkAuth()
  if (SHOW_LOG) console.log('认证状态:', isAuthenticated)
  
  // 如果需要认证但用户未登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
  if (SHOW_LOG) console.log('需要认证但用户未登录，重定向到登录页')
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
    if (SHOW_LOG) console.log('无管理员权限，重定向到首页')
      // 无权限，跳回首页并带上提示参数
      next({ path: '/', query: { forbidden: 'admin' } })
      return
    }
  }
  
  // 如果是登录页面但用户已登录
  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
    if (SHOW_LOG) console.log('已登录用户访问登录页，重定向到首页')
      next('/')
      return
    }
  }
  
  if (SHOW_LOG) console.log('路由守卫通过，允许访问:', to.path)
  next()
})

export default router
