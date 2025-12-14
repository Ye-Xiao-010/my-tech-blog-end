<template>
  <div class="article-list-page">
    <h2 class="page-title">文章列表</h2>

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

          <el-form-item label="分类">
            <el-select
              v-model="searchForm.categoryId"
              placeholder="选择分类"
              clearable
              size="large"
            >
              <el-option
                v-for="category in categories"
                :key="category.id"
                :label="category.name"
                :value="category.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标签">
            <el-select
              v-model="searchForm.tagId"
              placeholder="选择标签"
              clearable
              size="large"
            >
              <el-option
                v-for="tag in tags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="排序">
            <el-select
              v-model="searchForm.sort"
              placeholder="选择排序方式"
              size="large"
            >
              <el-option label="最新发布" value="publishTime,desc"></el-option>
              <el-option label="最早发布" value="publishTime,asc"></el-option>
              <el-option label="最新创建" value="createdAt,desc"></el-option>
              <el-option label="最早创建" value="createdAt,asc"></el-option>
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
        <el-empty description="暂无文章" />
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
import { articleApi, categoryApi, tagApi } from '../api'
import { View, Comment, Star } from '@element-plus/icons-vue'

export default {
  name: 'ArticleListView',
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
      total: 0,
      loading: false,
      searchForm: {
        page: 1,
        size: 10,
        keyword: '',
        categoryId: null,
        tagId: null,
        sort: 'publishTime,desc',
        status: 'published'
      }
    }
  },
  computed: {
    // 从路由参数中获取搜索关键词
    routeKeyword() {
      return this.$route.query.keyword || ''
    }
  },
  watch: {
    // 监听路由参数变化，更新搜索关键词
    routeKeyword(newVal) {
      if (newVal !== this.searchForm.keyword) {
        this.searchForm.keyword = newVal
        this.handleSearch()
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    // 初始化数据
    async initData() {
      try {
        // 加载分类和标签数据
        const [categoriesRes, tagsRes] = await Promise.all([
          categoryApi.getCategories({ size: 100 }),
          tagApi.getTags({ size: 100 })
        ])
        this.categories = categoriesRes.categories || []
        this.tags = tagsRes.tags || []

        // 处理路由参数中的搜索关键词
        if (this.routeKeyword) {
          this.searchForm.keyword = this.routeKeyword
        }

        // 加载文章列表
        this.loadArticles()
      } catch (error) {
        console.error('初始化数据失败:', error)
        this.$message.error('初始化数据失败，请稍后重试')
      }
    },

    // 加载文章列表
    async loadArticles() {
      this.loading = true
      try {
        const response = await articleApi.getArticles(this.searchForm)
// 处理文章数据 - 确保articles是数组
        this.articles = Array.isArray(response.articles) ? response.articles : []
        this.total = response.total || 0
      } catch (error) {
        console.error('加载文章列表失败:', error)
        this.$message.error('加载文章列表失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 处理搜索
    handleSearch() {
      this.searchForm.page = 1
      this.loadArticles()
    },

    // 处理分页大小变化
    handleSizeChange(size) {
      this.searchForm.size = size
      this.loadArticles()
    },

    // 处理当前页码变化
    handleCurrentChange(page) {
      this.searchForm.page = page
      this.loadArticles()
    }
  }
}
</script>

<style scoped>
.article-list-page {
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

/* 搜索和筛选区域 */
.search-filter {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  align-items: center;
  gap: 16px;
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

/* 分页 */
.pagination {
  margin-top: 30px;
  text-align: center;
}

/* 筛选表单样式 */
.filter-form .el-input {
  width: 300px;
}

.filter-form .el-select {
  width: 180px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .filter-form {
    flex-wrap: wrap;
  }
  
  .filter-form .el-form-item {
    margin-bottom: 12px;
  }
  
  .filter-form .el-input {
    width: 250px;
  }
  
  .filter-form .el-select {
    width: 150px;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
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