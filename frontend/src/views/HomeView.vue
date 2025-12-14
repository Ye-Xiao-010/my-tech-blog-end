<template>
  <div class="home">
    <!-- 横幅区域 -->
    <section class="banner">
      <div class="banner-content">
        <h2>欢迎来到技术博客</h2>
        <p>分享技术知识，交流学习经验</p>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <div class="home-content">
      <!-- 左侧文章列表 -->
      <main class="main-content">
        <h3 class="section-title">最新文章</h3>
        <div class="article-list">
          <el-card
            v-for="article in articles"
            :key="article.id"
            class="article-card"
            shadow="hover"
          >
            <template #header>
              <div class="article-card-header">
                <router-link :to="`/articles/${article.id}`" class="article-title">
                  {{ article.title }}
                </router-link>
              </div>
            </template>
            <div class="article-card-body">
              <div class="article-meta">
                <span class="meta-item">
                  <el-tag size="small" v-if="article.categories && article.categories.length > 0">{{ article.categories[0]?.name }}</el-tag>
                  <el-tag size="small" v-else>未分类</el-tag>
                </span>
                <span class="meta-item">
                  {{ new Date(article.publishTime).toLocaleDateString() }}
                </span>
              </div>
              <div class="article-summary">{{ article.summary }}</div>
              <div class="article-tags">
                <el-tag
                  v-for="tag in article.tags"
                  :key="tag"
                  size="small"
                  type="info"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </div>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </main>

      <!-- 右侧边栏 -->
      <aside class="sidebar">
        <!-- 分类标签云 -->
        <section class="sidebar-section">
          <h3 class="sidebar-title">分类</h3>
          <div class="category-cloud">
            <el-tag
              v-for="category in categories"
              :key="category.id"
              class="category-tag"
              @click="goToCategory(category.id)"
            >
              {{ category.name }} ({{ category.articleCount }})
            </el-tag>
          </div>
        </section>

        <!-- 热门标签 -->
        <section class="sidebar-section">
          <h3 class="sidebar-title">热门标签</h3>
          <div class="tag-cloud">
            <el-tag
              v-for="tag in tags"
              :key="tag.id"
              size="small"
              type="info"
              effect="plain"
              class="tag-item"
              @click="goToTag(tag.id)"
            >
              {{ tag.name }} ({{ tag.articleCount }})
            </el-tag>
          </div>
        </section>

        <!-- 热门文章 -->
        <section class="sidebar-section">
          <h3 class="sidebar-title">热门文章</h3>
          <ul class="hot-articles">
            <li class="hot-article-item" v-for="article in hotArticles" :key="article.id">
              <router-link :to="`/articles/${article.id}`" class="hot-article-link">
                <div class="hot-article-title">{{ article.title }}</div>
                <div class="hot-article-meta">
                  <span>{{ new Date(article.publishTime).toLocaleDateString() }}</span>
                </div>
              </router-link>
            </li>
          </ul>
        </section>
      </aside>
    </div>
  </div>
</template>

<script>
import { articleApi, categoryApi, tagApi } from '../api'
import { View, Comment, Star } from '@element-plus/icons-vue'

export default {
  name: 'HomeView',
  components: {
    View,
    Comment,
    Star
  },
  data() {
    return {
      articles: [],
      categories: [],
      tags: [],
      hotArticles: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        // 并行加载数据
        const [articlesRes, categoriesRes, tagsRes, hotArticlesRes] = await Promise.all([
          articleApi.getArticles({ page: this.currentPage, size: this.pageSize, status: 'published' }),
          categoryApi.getCategories({ size: 100 }),
          tagApi.getTags({ size: 100 }),
          articleApi.getArticles({ page: 1, size: 5, status: 'published', sort: 'createdAt,desc' })
        ])

        // 处理文章数据 - 确保articles是数组
        this.articles = Array.isArray(articlesRes.articles) ? articlesRes.articles : []
        this.total = articlesRes.total || 0
        console.log('文章数据:', articlesRes.articles, '总条数:', articlesRes.total)

        // 处理分类数据
        this.categories = categoriesRes.categories || []

        // 处理标签数据
        this.tags = tagsRes.tags || []

        // 处理热门文章数据
        this.hotArticles = hotArticlesRes.articles || []
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    // 分页大小变化处理
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.loadData()
    },
    // 当前页码变化处理
    handleCurrentChange(page) {
      this.currentPage = page
      this.loadData()
    },
    // 跳转到分类文章列表
    goToCategory(categoryId) {
      this.$router.push(`/categories/${categoryId}/articles`)
    },
    // 跳转到标签文章列表
    goToTag(tagId) {
      this.$router.push(`/tags/${tagId}/articles`)
    }
  }
}
</script>

<style scoped>
.home {
  width: 100%;
}

/* 横幅样式 */
.banner {
  background: linear-gradient(135deg, #3498db, #2ecc71);
  color: white;
  padding: 60px 0;
  text-align: center;
  margin-bottom: 30px;
}

.banner-content h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 10px;
}

.banner-content p {
  font-size: 18px;
  opacity: 0.9;
}

/* 主要内容区域 */
.home-content {
  display: flex;
  gap: 30px;
}

.main-content {
  flex: 1;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #34495e;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

/* 文章列表样式 */
.article-list {
  display: grid;
  gap: 20px;
}

.article-card {
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-card-header {
  padding: 0;
}

.article-title {
  font-size: 20px;
  font-weight: 600;
  color: #34495e;
  text-decoration: none;
  transition: color 0.3s ease;
}

.article-title:hover {
  color: #3498db;
}

.article-card-body {
  padding: 16px 0 0 0;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #95a5a6;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-summary {
  margin-bottom: 16px;
  color: #555;
  line-height: 1.6;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

/* 分页样式 */
.pagination {
  margin-top: 30px;
  text-align: center;
}

/* 侧边栏样式 */
.sidebar {
  width: 300px;
}

.sidebar-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #34495e;
  padding-bottom: 8px;
  border-bottom: 2px solid #3498db;
}

/* 分类标签云 */
.category-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-tag:hover {
  transform: scale(1.05);
}

/* 标签云 */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item:hover {
  transform: scale(1.05);
}

/* 热门文章 */
.hot-articles {
  list-style: none;
  padding: 0;
  margin: 0;
}

.hot-article-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ecf0f1;
}

.hot-article-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.hot-article-link {
  text-decoration: none;
  color: #34495e;
  transition: color 0.3s ease;
}

.hot-article-link:hover {
  color: #3498db;
}

.hot-article-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 1.4;
}

.hot-article-meta {
  font-size: 12px;
  color: #95a5a6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-content {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}
</style>