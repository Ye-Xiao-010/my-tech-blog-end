<template>
  <div class="admin-dashboard">
    <h1>管理员控制面板</h1>
    
    <!-- 选项卡 -->
    <el-tabs v-model="activeTab" class="admin-tabs">
      <!-- 文章管理 -->
      <el-tab-pane label="文章管理" name="articles">
        <div class="tab-content">
          <h2>文章列表</h2>
          <el-input
            v-model="articleSearch" 
            placeholder="搜索文章标题"
            class="search-input"
            @keyup.enter="searchArticles"
          >
            <template #append>
              <el-button @click="searchArticles">搜索</el-button>
            </template>
          </el-input>
          
          <el-table :data="articles" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="title" label="标题" />
            <el-table-column label="作者" width="120">
              <template #default="scope">
                {{ scope.row.author ? scope.row.author.username : '未知作者' }}
              </template>
            </el-table-column>
            <el-table-column label="分类" width="100">
              <template #default="scope">
                {{ scope.row.categories && scope.row.categories.length > 0 
                  ? scope.row.categories.map(cat => cat.name).join(', ') 
                  : '未分类' }}
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180" />
            <el-table-column prop="updatedAt" label="更新时间" width="180" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="deleteArticle(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <el-pagination
            v-if="articles.length > 0"
            layout="prev, pager, next"
            :total="totalArticles"
            :page-size="pageSize"
            @current-change="handleArticlePageChange"
            class="pagination"
          />
        </div>
      </el-tab-pane>
      
      <!-- 用户管理 -->
      <el-tab-pane label="用户管理" name="users">
        <div class="tab-content">
          <h2>用户列表</h2>
          <el-input
            v-model="userSearch" 
            placeholder="搜索用户名或邮箱"
            class="search-input"
            @keyup.enter="searchUsers"
          >
            <template #append>
              <el-button @click="searchUsers">搜索</el-button>
            </template>
          </el-input>
          
          <el-table :data="users" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="email" label="邮箱" />
            <el-table-column prop="role" label="角色" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.role === 'ADMIN' ? 'success' : 'info'">
                  {{ scope.row.role }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180" />
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="deleteUser(scope.row.id)"
                  :disabled="scope.row.username === 'admin'"
                >
                  删除
                </el-button>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click="toggleUserRole(scope.row)"
                >
                  {{ scope.row.role === 'ADMIN' ? '降级' : '升级' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <el-pagination
            v-if="users.length > 0"
            layout="prev, pager, next"
            :total="totalUsers"
            :page-size="pageSize"
            @current-change="handleUserPageChange"
            class="pagination"
          />
        </div>
      </el-tab-pane>
      
      <!-- 分类管理 -->
      <el-tab-pane label="分类管理" name="categories">
        <div class="tab-content">
          <h2>分类列表</h2>
          <el-input
            v-model="categorySearch" 
            placeholder="搜索分类名称"
            class="search-input"
            @keyup.enter="searchCategories"
          >
            <template #append>
              <el-button @click="searchCategories">搜索</el-button>
            </template>
          </el-input>
          
          <el-table :data="categories" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="分类名称" />
            <el-table-column prop="articlesCount" label="文章数量" width="120" />
            <el-table-column prop="createdAt" label="创建时间" width="180" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="deleteCategory(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      
      <!-- 标签管理 -->
      <el-tab-pane label="标签管理" name="tags">
        <div class="tab-content">
          <h2>标签列表</h2>
          <el-input
            v-model="tagSearch" 
            placeholder="搜索标签名称"
            class="search-input"
            @keyup.enter="searchTags"
          >
            <template #append>
              <el-button @click="searchTags">搜索</el-button>
            </template>
          </el-input>
          
          <el-table :data="tags" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="标签名称" />
            <el-table-column prop="articleCount" label="文章数量" width="120" />
            <el-table-column prop="createdAt" label="创建时间" width="180" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="deleteTag(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      
      <!-- 评论管理 -->
      <el-tab-pane label="评论管理" name="comments">
        <div class="tab-content">
          <h2>评论列表</h2>
          <el-input
            v-model="commentSearch" 
            placeholder="搜索评论内容"
            class="search-input"
            @keyup.enter="searchComments"
          >
            <template #append>
              <el-button @click="searchComments">搜索</el-button>
            </template>
          </el-input>
          
          <el-table :data="comments" stripe style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="content" label="评论内容" width="400" />
            <el-table-column label="评论者" width="120">
              <template #default="scope">
                {{ scope.row.user ? scope.row.user.username : '未知用户' }}
              </template>
            </el-table-column>
            <el-table-column label="所属文章" width="150">
              <template #default="scope">
                {{ scope.row.article ? scope.row.article.title : '未知文章' }}
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="180" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button 
                  type="danger" 
                  size="small" 
                  @click="deleteComment(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <el-pagination
            v-if="comments.length > 0"
            layout="prev, pager, next"
            :total="totalComments"
            :page-size="pageSize"
            @current-change="handleCommentPageChange"
            class="pagination"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { articleApi, categoryApi, tagApi, commentApi, userApi } from '../api'

export default {
  name: 'AdminDashboardView',
  data() {
    return {
      // 选项卡状态
      activeTab: 'articles',
      
      // 分页设置
      pageSize: 10,
      currentPage: 1,
      
      // 搜索关键词
      articleSearch: '',
      userSearch: '',
      categorySearch: '',
      tagSearch: '',
      commentSearch: '',
      
      // 数据列表
      articles: [],
      users: [],
      categories: [],
      tags: [],
      comments: [],
      
      // 总数
      totalArticles: 0,
      totalUsers: 0,
      totalComments: 0
    }
  },
  
  created() {
    // 检查是否为管理员
    this.checkAdmin()
  },
  
  mounted() {
    // 加载默认数据
    this.loadArticles()
  },
  
  watch: {
    // 切换选项卡时加载对应数据
    activeTab(newTab) {
      switch(newTab) {
        case 'articles':
          this.loadArticles()
          break
        case 'users':
          this.loadUsers()
          break
        case 'categories':
          this.loadCategories()
          break
        case 'tags':
          this.loadTags()
          break
        case 'comments':
          this.loadComments()
          break
      }
    }
  },
  
  methods: {
    // 检查是否为管理员
    checkAdmin() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if (!userInfo || userInfo.role !== 'ADMIN') {
        this.$message.error('您没有管理员权限')
        this.$router.push('/')
      }
    },
    
    // 文章管理
    async loadArticles() {
      try {
        // 使用getArticles方法，只获取已发布的文章
        const response = await articleApi.getArticles({
          page: this.currentPage - 1,
          size: this.pageSize,
          keyword: this.articleSearch
        })
        this.articles = response.articles || []
        this.totalArticles = response.total || 0
      } catch (error) {
        this.$message.error('加载文章失败')
        console.error('加载文章失败:', error)
      }
    },
    
    searchArticles() {
      this.currentPage = 1
      this.loadArticles()
    },
    
    handleArticlePageChange(page) {
      this.currentPage = page
      this.loadArticles()
    },
    
    async deleteArticle(id) {
      try {
        await this.$confirm('确定要删除这篇文章吗？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await articleApi.deleteArticle(id)
        this.$message.success('文章删除成功')
        this.loadArticles()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除文章失败')
          console.error('删除文章失败:', error)
        }
      }
    },
    
    // 用户管理
    async loadUsers() {
      try {
        const response = await userApi.getAllUsers({
          page: this.currentPage - 1,
          size: this.pageSize,
          keyword: this.userSearch
        })
        this.users = response.users || []
        this.totalUsers = response.totalElements || 0
      } catch (error) {
        this.$message.error('加载用户失败')
        console.error('加载用户失败:', error)
      }
    },
    
    searchUsers() {
      this.currentPage = 1
      this.loadUsers()
    },
    
    handleUserPageChange(page) {
      this.currentPage = page
      this.loadUsers()
    },
    
    async deleteUser(id) {
      try {
        await this.$confirm('确定要删除这个用户吗？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await userApi.deleteUser(id)
        this.$message.success('用户删除成功')
        this.loadUsers()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除用户失败')
          console.error('删除用户失败:', error)
        }
      }
    },
    
    async toggleUserRole(user) {
      try {
        const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN'
        await this.$confirm(`确定要将用户 ${user.username} ${newRole === 'ADMIN' ? '升级为管理员' : '降级为普通用户'} 吗？`, '角色变更确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await userApi.updateUserRole(user.id, { role: newRole })
        this.$message.success(`用户 ${user.username} 角色已变更为 ${newRole}`)
        this.loadUsers()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('角色变更失败')
          console.error('角色变更失败:', error)
        }
      }
    },
    
    // 分类管理
    async loadCategories() {
      try {
        let response;
        if (this.categorySearch) {
          // 使用搜索端点
          response = await categoryApi.getCategories({ keyword: this.categorySearch })
        } else {
          // 获取所有分类
          response = await categoryApi.getCategories()
        }
        this.categories = response.categories || []
      } catch (error) {
        this.$message.error('加载分类失败')
        console.error('加载分类失败:', error)
      }
    },
    
    searchCategories() {
      this.loadCategories()
    },
    
    async deleteCategory(id) {
      try {
        await this.$confirm('确定要删除这个分类吗？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await categoryApi.deleteCategory(id)
        this.$message.success('分类删除成功')
        this.loadCategories()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除分类失败')
          console.error('删除分类失败:', error)
        }
      }
    },
    
    // 标签管理
    async loadTags() {
      try {
        const response = await tagApi.getTags()
        let allTags = response.tags || []
        
        // 如果有搜索关键词，在前端过滤
        if (this.tagSearch) {
          const keyword = this.tagSearch.toLowerCase()
          allTags = allTags.filter(tag => 
            tag.name.toLowerCase().includes(keyword)
          )
        }
        
        this.tags = allTags
      } catch (error) {
        this.$message.error('加载标签失败')
        console.error('加载标签失败:', error)
      }
    },
    
    searchTags() {
      this.loadTags()
    },
    
    async deleteTag(id) {
      try {
        await this.$confirm('确定要删除这个标签吗？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await tagApi.deleteTag(id)
        this.$message.success('标签删除成功')
        this.loadTags()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除标签失败')
          console.error('删除标签失败:', error)
        }
      }
    },
    
    // 评论管理
    async loadComments() {
      try {
        // 调用获取所有评论的API，不传递articleId
        const response = await commentApi.getAllComments({
          page: this.currentPage - 1,
          size: this.pageSize,
          keyword: this.commentSearch
        })
        this.comments = response.comments || []
        this.totalComments = response.totalElements || 0
      } catch (error) {
        this.$message.error('加载评论失败')
        console.error('加载评论失败:', error)
      }
    },
    
    searchComments() {
      this.currentPage = 1
      this.loadComments()
    },
    
    handleCommentPageChange(page) {
      this.currentPage = page
      this.loadComments()
    },
    
    async deleteComment(id) {
      try {
        await this.$confirm('确定要删除这条评论吗？', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await commentApi.deleteComment(id)
        this.$message.success('评论删除成功')
        this.loadComments()
      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除评论失败')
          console.error('删除评论失败:', error)
        }
      }
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.admin-tabs {
  margin-top: 20px;
}

.tab-content {
  padding: 20px 0;
}

h2 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #555;
}

.search-input {
  width: 300px;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.el-table {
  margin-top: 20px;
}

.el-button + .el-button {
  margin-left: 10px;
}
</style>