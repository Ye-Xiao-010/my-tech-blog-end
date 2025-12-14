import { createRouter, createWebHistory } from 'vue-router'

// 定义路由
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/articles',
    name: 'ArticleList',
    component: () => import('../views/ArticleListView.vue')
  },
  {
    path: '/articles/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ArticleDetailView.vue')
  },
  {
    path: '/write-article',
    name: 'WriteArticle',
    component: () => import('../views/WriteArticleView.vue')
  },
  {
    path: '/categories',
    name: 'CategoryList',
    component: () => import('../views/CategoryListView.vue')
  },
  {
    path: '/categories/:id/articles',
    name: 'CategoryArticles',
    component: () => import('../views/CategoryArticlesView.vue')
  },
  {
    path: '/tags',
    name: 'TagList',
    component: () => import('../views/TagListView.vue')
  },
  {
    path: '/tags/:id/articles',
    name: 'TagArticles',
    component: () => import('../views/TagArticlesView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/AdminDashboardView.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/SettingsView.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否访问管理员页面
  if (to.path === '/admin') {
    // 获取用户信息
    const userInfoStr = localStorage.getItem('userInfo')
    let userInfo = null
    
    try {
      if (userInfoStr) {
        userInfo = JSON.parse(userInfoStr)
      }
    } catch (error) {
      console.error('解析用户信息失败:', error)
    }
    
    // 检查用户是否为管理员
    if (!userInfo || userInfo.role !== 'ADMIN') {
      // 不是管理员，跳转到首页
      alert('您没有管理员权限')
      next('/')
    } else {
      // 是管理员，允许访问
      next()
    }
  } else {
    // 不是访问管理员页面，直接放行
    next()
  }
})

export default router