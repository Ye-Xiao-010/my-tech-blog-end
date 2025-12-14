import axios from 'axios'

// 创建Axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    // 如果token存在，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 只返回data数据
    return response.data
  },
  error => {
    // 处理错误
    if (error.response) {
      // 请求已发出，服务器返回状态码不在2xx范围
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // 请求已发出，但未收到响应
      console.error('API Error:', error.request)
    } else {
      // 请求配置出错
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// API请求方法
// 文章相关
export const articleApi = {
  // 获取文章列表
  getArticles: (params) => {
    if (params && params.keyword) {
      // 使用搜索端点
      return api.get('/articles/search', { params });
    } else {
      // 获取所有文章
      return api.get('/articles', { params });
    }
  },
  // 获取所有文章（管理员）
  getAllArticles: (params) => api.get('/articles/admin/all', { params }),
  // 获取文章详情
  getArticleById: (id) => api.get(`/articles/${id}`),
  // 创建文章
  createArticle: (data) => api.post('/articles', data),
  // 更新文章
  updateArticle: (id, data) => api.put(`/articles/${id}`, data),
  // 删除文章
  deleteArticle: (id, authorId) => api.delete(`/articles/${id}`, { params: { authorId } }),
  // 获取用户文章
  getArticlesByAuthor: (authorId) => api.get(`/articles/author/${authorId}`)
}

// 分类相关
export const categoryApi = {
  // 获取分类列表
  getCategories: (params) => {
    if (params && params.keyword) {
      // 使用搜索端点
      return api.get(`/categories/search`, { params: { keyword: params.keyword } });
    } else {
      // 获取所有分类
      return api.get('/categories');
    }
  },
  // 获取分类详情
  getCategoryById: (id) => api.get(`/categories/${id}`),
  // 创建分类
  createCategory: (data) => api.post('/categories', data),
  // 更新分类
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  // 删除分类
  deleteCategory: (id) => api.delete(`/categories/${id}`)
}

// 标签相关
export const tagApi = {
  // 获取标签列表
  getTags: (params) => {
    if (params && params.keyword) {
      // 使用搜索端点
      return api.get(`/tags/search`, { params: { keyword: params.keyword } });
    } else {
      // 获取所有标签
      return api.get('/tags');
    }
  },
  // 获取标签详情
  getTagById: (id) => api.get(`/tags/${id}`),
  // 创建标签
  createTag: (data) => api.post('/tags', data),
  // 更新标签
  updateTag: (id, data) => api.put(`/tags/${id}`, data),
  // 删除标签
  deleteTag: (id) => api.delete(`/tags/${id}`)
}

// 评论相关
export const commentApi = {
  // 获取文章评论列表
  getComments: (articleId, params) => api.get(`/comments/article/${articleId}`, { params }),
  // 获取评论回复
  getReplies: (commentId) => api.get(`/comments/${commentId}/replies`),
  // 创建评论
  createComment: (data) => api.post('/comments', data),
  // 创建回复
  createReply: (data) => api.post('/comments/reply', data),
  // 删除评论
  deleteComment: (id, userId) => api.delete(`/comments/${id}`, { params: { userId } }),
  // 获取所有评论（管理员）
  getAllComments: (params) => api.get('/comments/admin/all', { params }),
  // 获取用户评论
  getCommentsByUser: (userId) => api.get(`/comments/user/${userId}`)
}

// 用户相关
export const userApi = {
  // 登录
  login: (data) => api.post('/auth/login', data),
  // 注册
  register: (data) => api.post('/auth/register', data),
  // 获取用户信息
  getUserInfo: () => api.get('/users/profile'),
  // 更新用户信息
  updateUserInfo: (data) => api.put('/users/profile', data),
  // 修改密码
  changePassword: (data) => api.put('/users/me/password', data),
  // 获取所有用户（管理员）
  getAllUsers: (params) => api.get('/admin/users', { params }),
  // 删除用户（管理员）
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // 更新用户角色（管理员）
  updateUserRole: (id, data) => api.put(`/admin/users/${id}/role`, data)
}

// 统计相关
export const statsApi = {
  // 获取仪表盘统计
  getDashboardStats: () => api.get('/stats/dashboard'),
  // 获取文章访问统计
  getArticleStats: (id) => api.get(`/stats/articles/${id}`)
}

export default api