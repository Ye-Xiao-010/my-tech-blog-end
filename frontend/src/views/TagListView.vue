<template>
  <div class="tag-list-page">
    <h2 class="page-title">文章标签</h2>

    <!-- 搜索区域 -->
    <div class="search-section">
      <el-card shadow="hover">
        <el-form :inline="true" class="search-form">
          <el-form-item label="搜索标签">
            <el-input
              v-model="searchKeyword"
              placeholder="输入标签名称搜索"
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

    <!-- 标签列表 -->
    <div class="tag-content">
      <div class="tag-list">
        <el-card
          v-for="tag in tags"
          :key="tag.id"
          class="tag-card"
          shadow="hover"
        >
          <div class="tag-card-content">
            <div class="tag-info">
              <router-link :to="`/tags/${tag.id}/articles`" class="tag-name">
                <h3>{{ tag.name }}</h3>
              </router-link>
              <p class="tag-article-count">{{ tag.articleCount }} 篇文章</p>
            </div>
            <div class="tag-action">
              <el-button type="primary" size="medium">
                <router-link :to="`/tags/${tag.id}/articles`" class="btn-link">
                  查看文章
                </router-link>
              </el-button>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 空状态 -->
      <div v-if="tags.length === 0" class="empty-state">
        <el-empty description="暂无标签" />
      </div>
    </div>
  </div>
</template>

<script>
import { tagApi } from '../api'

export default {
  name: 'TagListView',
  data() {
    return {
      tags: [],
      searchKeyword: '',
      loading: false
    }
  },
  mounted() {
    this.loadTags()
  },
  methods: {
    // 加载标签列表
    async loadTags() {
      this.loading = true
      try {
        const params = {
          keyword: this.searchKeyword
        }
        const res = await tagApi.getTags(params)
        this.tags = res.tags || []
      } catch (error) {
        console.error('加载标签失败:', error)
        this.$message.error('加载标签失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },

    // 处理搜索
    handleSearch() {
      this.loadTags()
    }
  }
}
</script>

<style scoped>
.tag-list-page {
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

/* 标签列表 */
.tag-content {
  width: 100%;
}

.tag-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.tag-card {
  transition: transform 0.3s ease;
}

.tag-card:hover {
  transform: translateY(-5px);
}

.tag-card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tag-info {
  flex: 1;
}

.tag-name {
  text-decoration: none;
  color: #34495e;
  transition: color 0.3s ease;
}

.tag-name:hover {
  color: #3498db;
}

.tag-info h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.tag-name:hover h3 {
  color: #3498db;
}

.tag-article-count {
  font-size: 16px;
  color: #3498db;
  font-weight: 600;
  margin-bottom: 4px;
}

.tag-create-time {
  font-size: 14px;
  color: #95a5a6;
}

.tag-action {
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
  
  .tag-list {
    grid-template-columns: 1fr;
  }
  
  .tag-card-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>