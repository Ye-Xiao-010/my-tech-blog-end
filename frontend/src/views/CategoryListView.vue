<template>
  <div class="category-list-page">
    <h2 class="page-title">文章分类</h2>

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-card shadow="hover">
        <el-form :inline="true" class="search-form">
          <el-form-item label="搜索分类">
            <el-input
              v-model="searchKeyword"
              placeholder="输入分类名称搜索"
              clearable
              size="large"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 分类列表 -->
    <div class="category-content">
      <div class="category-list">
        <el-card
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          shadow="hover"
        >
          <div class="category-card-content">
            <div class="category-info">
              <router-link :to="`/categories/${category.id}/articles`" class="category-name">
                <h3>{{ category.name }}</h3>
              </router-link>
              <p class="category-article-count">{{ category.articlesCount }} 篇文章</p>
              <p class="category-create-time">创建于 {{ new Date(category.createdAt).toLocaleDateString() }}</p>
            </div>
            <div class="category-action">
              <el-button type="primary" size="medium">
                <router-link :to="`/categories/${category.id}/articles`" class="btn-link">
                  查看文章
                </router-link>
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 空状态 -->
      <div v-if="categories.length === 0" class="empty-state">
        <el-empty description="暂无分类" />
      </div>
    </div>
  </div>
</template>

<script>
import { categoryApi } from '../api'

export default {
  name: 'CategoryListView',
  data() {
    return {
      categories: [],
      searchKeyword: '',
      loading: false
    }
  },
  mounted() {
    this.loadCategories()
  },
  methods: {
    // 加载分类列表
    async loadCategories() {
      this.loading = true
      try {
        const params = {
          keyword: this.searchKeyword
        }
        const res = await categoryApi.getCategories(params)
        this.categories = res.categories || []
      } catch (error) {
        console.error('加载分类失败:', error)
        this.$message.error('加载分类失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 处理搜索
    handleSearch() {
      this.loadCategories()
    }
  }
}
</script>

<style scoped>
.category-list-page {
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

/* 搜索区域 */
.search-section {
  margin-bottom: 30px;
}

.search-form {
  display: flex;
  justify-content: center;
}

/* 分类列表 */
.category-content {
  width: 100%;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.category-card {
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-info {
  flex: 1;
}

.category-name {
  text-decoration: none;
  color: #34495e;
  transition: color 0.3s ease;
}

.category-name:hover {
  color: #3498db;
}

.category-info h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.category-name:hover h3 {
  color: #3498db;
}

.category-article-count {
  font-size: 16px;
  color: #3498db;
  font-weight: 600;
  margin-bottom: 4px;
}

.category-create-time {
  font-size: 14px;
  color: #95a5a6;
}

.category-action {
  display: flex;
  align-items: center;
}

.btn-link {
  color: white;
  text-decoration: none;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
  
  .category-list {
    grid-template-columns: 1fr;
  }
  
  .category-card-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>