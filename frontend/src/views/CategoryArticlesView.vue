<template>
  <div class="category-articles-page">
    <h2 class="page-title">{{ category.name }} 分类下的文章</h2>

    <!-- 分类信息 -->
    <div class="category-info-section">
      <el-card shadow="hover">
        <div class="category-info-content">
          <div class="category-info-left">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-article-count">共 {{ category.articleCount }} 篇文章</p>
          </div>
          <div class="category-info-right">
            <el-button type="primary" size="medium">
              <router-link to="/categories" class="btn-link">
                返回分类列表
              </router-link>
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter">
      <el-card shadow="hover">
        <el-form :inline="true" class="filter-form">
          <el-form-item label="搜索关键词">
            <el-input
              v-model="searchForm.keyword"
              placeholder="输入关键词搜索"
              clearable
              size="large"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="排序">
            <el-select
              v-model="searchForm.sort"
              placeholder="选择排序方式"
              size="large"
            >
              <el-option label="最新发布" value="publishTime,desc"></el-option>
              <el-option label="最早发布" value="publishTime,asc"></el-option>
              <el-option label="最多阅读" value="viewCount,desc"></el-option>
              <el-option label="最多评论" value="commentCount,desc"></el-option>
              <el-option label="最多点赞" value="likeCount,desc"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 文章列表 -->
    <div class="article-content">
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

      <!-- 空状态 -->
      <div v-if="articles.length === 0" class="empty-state">
        <el-empty description="该分类下暂无文章" />
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="searchForm.page"
          v-model:page-size="searchForm.size"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { articleApi, categoryApi } from '../api'
import { View, Comment, Star } from '@element-plus/icons-vue'

export default {
  name: 'CategoryArticlesView',
  components: {
    View,
    Comment,
    Star
  },
  data() {
    return {
      categoryId: this.$route.params.id,
      category: {
        id: '',
        name: '',
        articleCount: 0
      },
      articles: [],
      total: 0,
      loading: false,
      searchForm: {
        page: 1,
        size: 10,
        keyword: '',
        categoryId: this.$route.params.id,
        sort: 'publishTime,desc',
        status: 'published'
      }
    }
  },
  watch: {
    // 监听路由参数变化，重新加载数据
    '$route.params.id': {
      handler(newId) {
        this.categoryId = newId
        this.searchForm.categoryId = newId
        this.loadData()
      },
      immediate: true
    }
  },
  methods: {
    // 加载数据
    async loadData() {
      this.loading = true
      try {
        // 并行加载分类信息和文章列表
        const [categoryRes, articlesRes] = await Promise.all([
          categoryApi.getCategoryById(this.categoryId),
          articleApi.getArticles(this.searchForm)
        ])

        // 处理分类数据
        this.category = categoryRes.category

        // 处理文章数据
        this.articles = articlesRes.articles || []
        this.total = articlesRes.total || 0
      } catch (error) {
        console.error('加载数据失败:', error)
        this.$message.error('加载数据失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 处理搜索
    handleSearch() {
      this.searchForm.page = 1
      this.loadData()
    },

    // 处理分页大小变化
    handleSizeChange(size) {
      this.searchForm.size = size
      this.loadData()
    },

    // 处理当前页码变化
    handleCurrentChange(page) {
      this.searchForm.page = page
      this.loadData()
    }
  }
}
</script>

<style scoped>
.category-articles-page {
  width: 100%;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #34495e;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

/* 分类信息区域 */
.category-info-section {
  margin-bottom: 20px;
}

.category-info-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-info-left {
  flex: 1;
}

.category-name {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #34495e;
}

.category-article-count {
  font-size: 16px;
  color: #95a5a6;
}

.category-info-right {
  display: flex;
  align-items: center;
}

.btn-link {
  color: white;
  text-decoration: none;
}

/* 搜索和筛选区域 */
.search-filter {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* 文章列表区域 */
.article-content {
  width: 100%;
}

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
  flex-wrap: wrap;
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

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 0;
}

/* 分页样式 */
.pagination {
  margin-top: 30px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-form {
    flex-wrap: wrap;
  }
  
  .filter-form .el-form-item {
    margin-bottom: 12px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .category-info-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .filter-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-form .el-form-item {
    margin-bottom: 16px;
  }
}
</style>