<template>
  <div class="profile-container">
    <div class="profile-header">
      <h1>个人中心</h1>
      <div v-if="userInfo" class="user-info">
        <h2>{{ userInfo.username }}</h2>
        <p>注册时间: {{ formatDate(userInfo.createdAt) }}</p>
      </div>
    </div>

    <div class="profile-tabs">
      <button 
        :class="{ active: activeTab === 'articles' }" 
        @click="activeTab = 'articles'"
      >
        我的文章
      </button>
      <button 
        :class="{ active: activeTab === 'comments' }" 
        @click="activeTab = 'comments'"
      >
        我的评论
      </button>
    </div>

    <!-- 我的文章 -->
    <div v-if="activeTab === 'articles'" class="articles-section">
      <div class="section-header">
        <h3>我的文章</h3>
        <router-link to="/write-article" class="write-btn">写文章</router-link>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="articles.length === 0" class="empty">
        <p>您还没有发布任何文章</p>
        <router-link to="/write-article" class="write-btn">开始写文章</router-link>
      </div>
      <div v-else class="articles-list">
        <div v-for="article in articles" :key="article.id" class="article-item">
          <h4>{{ article.title }}</h4>
          <p class="article-summary">{{ article.summary }}</p>
          <div class="article-meta">
            <span class="status" :class="article.status.toLowerCase()">
              {{ article.status === 'PUBLISHED' ? '已发布' : '草稿' }}
            </span>
            <span class="date">{{ formatDate(article.createdAt) }}</span>
          </div>
          <div class="article-actions">
            <router-link :to="`/articles/${article.id}`" class="view-btn">查看</router-link>
            <router-link :to="`/write-article?id=${article.id}`" class="edit-btn">编辑</router-link>
            <button @click="deleteArticle(article.id)" class="delete-btn">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的评论 -->
    <div v-if="activeTab === 'comments'" class="comments-section">
      <h3>我的评论</h3>
      <div v-if="commentsLoading" class="loading">加载中...</div>
      <div v-else-if="comments.length === 0" class="empty">
        <p>您还没有发表任何评论</p>
      </div>
      <div v-else class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-content">{{ comment.content }}</div>
          <div class="comment-meta">
            <span class="date">{{ formatDate(comment.createdAt) }}</span>
            <span class="status" :class="comment.status.toLowerCase()">
              {{ getCommentStatusText(comment.status) }}
            </span>
          </div>
          <div class="comment-article">
            <a :href="`/articles/${comment.article.id}`" target="_blank">
              文章：{{ comment.article.title }}
            </a>
          </div>
          <div class="comment-actions">
            <button @click="deleteComment(comment.id)" class="delete-btn">删除</button>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articleApi, commentApi, userApi } from '../api/index'

export default {
  name: 'ProfileView',
  setup() {
    const router = useRouter()
    const activeTab = ref('articles')
    const userInfo = ref(null)
    const articles = ref([])
    const comments = ref([])
    const loading = ref(false)
    const commentsLoading = ref(false)

    // 格式化日期
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString()
    }

    // 获取评论状态文本
    const getCommentStatusText = (status) => {
      switch (status) {
        case 'APPROVED': return '已批准'
        case 'PENDING': return '待审核'
        case 'REJECTED': return '已拒绝'
        default: return status
      }
    }

    // 获取用户信息
    const getUserInfo = async () => {
      try {
        // 先尝试从localStorage获取用户信息
        const storedUserInfo = localStorage.getItem('userInfo')
        if (storedUserInfo) {
          userInfo.value = JSON.parse(storedUserInfo)
        } else {
          // 如果localStorage中也没有用户信息，跳转到登录页面
          router.push({ path: '/login', query: { redirect: '/profile' } })
          return
        }
        
        // 然后尝试从后端获取最新的用户信息
        try {
          const res = await userApi.getUserInfo()
          if (res.success) {
            userInfo.value = res.user
            // 更新localStorage中的用户信息
            localStorage.setItem('userInfo', JSON.stringify(res.user))
          }
        } catch (apiError) {
          // 从后端获取最新用户信息失败，使用localStorage中的用户信息作为备份
          // 只在控制台输出调试信息，而不是错误信息
          console.log('从后端获取最新用户信息失败，使用localStorage中的用户信息作为备份:', apiError.message)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果发生严重错误，跳转到登录页面
        router.push({ path: '/login', query: { redirect: '/profile' } })
      }
    }

    // 获取用户文章
    const getArticles = async () => {
      loading.value = true
      try {
        // 这里假设userInfo已经获取到
        if (userInfo.value) {
          const res = await articleApi.getArticlesByAuthor(userInfo.value.id)
          if (res.success) {
            articles.value = res.articles
          }
        }
      } catch (error) {
        console.error('获取用户文章失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 获取用户评论
    const getComments = async () => {
      commentsLoading.value = true
      try {
        // 这里假设userInfo已经获取到
        if (userInfo.value) {
          const res = await commentApi.getCommentsByUser(userInfo.value.id)
          if (res.success) {
            comments.value = res.comments
          }
        }
      } catch (error) {
        console.error('获取用户评论失败:', error)
      } finally {
        commentsLoading.value = false
      }
    }

    // 删除文章
    const deleteArticle = async (articleId) => {
      if (confirm('确定要删除这篇文章吗？')) {
        try {
          const res = await articleApi.deleteArticle(articleId, userInfo.value.id)
          if (res.success) {
            // 重新获取文章列表
            getArticles()
          }
        } catch (error) {
          console.error('删除文章失败:', error)
        }
      }
    }

    // 删除评论
    const deleteComment = async (commentId) => {
      if (confirm('确定要删除这条评论吗？')) {
        try {
          const res = await commentApi.deleteComment(commentId, userInfo.value.id)
          if (res.success) {
            // 重新获取评论列表
            getComments()
          }
        } catch (error) {
          console.error('删除评论失败:', error)
        }
      }
    }

    // 初始化数据
    onMounted(async () => {
      await getUserInfo()
      if (userInfo.value) {
        getArticles()
        getComments()
      }
    })

    return {
      activeTab,
      userInfo,
      articles,
      comments,
      loading,
      commentsLoading,
      formatDate,
      getCommentStatusText,
      deleteArticle,
      deleteComment
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.user-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  display: inline-block;
}

.user-info h2 {
  margin: 0 0 10px 0;
  color: #555;
}

.profile-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
}

.profile-tabs button {
  background: none;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  position: relative;
}

.profile-tabs button.active {
  color: #007bff;
  font-weight: bold;
}

.profile-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #007bff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.write-btn {
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.write-btn:hover {
  background-color: #0056b3;
}

.loading, .empty {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.empty p {
  margin-bottom: 20px;
  font-size: 1.1rem;
}

/* 文章列表 */
.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-item {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.article-item h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2rem;
}

.article-summary {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.status {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.status.published {
  background-color: #d4edda;
  color: #155724;
}

.status.draft {
  background-color: #fff3cd;
  color: #856404;
}

.date {
  color: #999;
}

.article-actions {
  display: flex;
  gap: 10px;
}

.view-btn, .edit-btn, .delete-btn {
  padding: 6px 12px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.8rem;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.view-btn {
  background-color: #007bff;
  color: white;
}

.view-btn:hover {
  background-color: #0056b3;
}

.edit-btn {
  background-color: #28a745;
  color: white;
}

.edit-btn:hover {
  background-color: #1e7e34;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

/* 评论列表 */
.comments-list {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.comment-item {
  padding: 20px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-item:hover {
  background-color: #f9f9f9;
}

.comment-content {
  margin-bottom: 15px;
  line-height: 1.5;
  color: #333;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.9rem;
}

.comment-article {
  margin-bottom: 15px;
}

.comment-article a {
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
}

.comment-article a:hover {
  text-decoration: underline;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }

  .articles-list {
    grid-template-columns: 1fr;
  }

  .profile-tabs button {
    padding: 10px 15px;
    font-size: 1rem;
  }
}
</style>