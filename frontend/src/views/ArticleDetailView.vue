<template>
  <div class="article-detail">
    <!-- 文章内容区域 -->
    <div class="article-content">
      <el-card shadow="hover" class="article-card">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>

        <!-- 文章元信息 -->
        <div class="article-meta">
          <div class="meta-left">
            <el-tag size="large" v-if="(article.categories?.length || 0) > 0">{{ article.categories[0]?.name }}</el-tag>
            <el-tag size="large" v-else>未分类</el-tag>
            <span class="meta-item">
              {{ new Date(article.publishTime).toLocaleDateString() }}
            </span>
            <span class="meta-item">
              <el-icon><User /></el-icon> {{ article.author.username }}
            </span>
          </div>
          <div class="meta-right">
            <span class="meta-item">
              <el-icon><Comment /></el-icon> {{ comments.count || 0 }}
            </span>
          </div>
        </div>

        <!-- 文章标签 -->
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

        <!-- 文章内容 -->
        <div class="article-body">
          <!-- 左侧目录导航 -->
          <div class="toc-container" v-if="(tocItems?.length || 0) > 0">
            <div class="toc-title">文章目录</div>
            <ul class="toc-list">
              <li
                v-for="(item, index) in tocItems"
                :key="index"
                :class="['toc-item', { 'toc-item-h2': item.level === 2, 'toc-item-h3': item.level === 3 }]"
                @click="scrollToSection(item.id)"
              >
                {{ item.text }}
              </li>
            </ul>
          </div>

          <!-- 右侧文章内容 -->
          <div class="content-container">
            <div class="markdown-content" v-html="renderedContent"></div>
          </div>
        </div>
      </el-card>

      <!-- 评论区 -->
      <div class="comment-section">
        <h3 class="comment-title">评论区 ({{ comments.total }})</h3>

        <!-- 评论表单 -->
        <el-card shadow="hover" class="comment-form-card">
          <el-form :model="commentForm" :rules="commentRules" ref="commentFormRef" class="comment-form">
            <el-form-item prop="content">
              <el-input
                v-model="commentForm.content"
                type="textarea"
                placeholder="写下你的评论..."
                :rows="4"
                resize="vertical"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitComment" :loading="commentLoading">
                发表评论
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 评论列表 -->
        <div class="comment-list">
          <el-card
            v-for="comment in comments.comments"
            :key="comment.id"
            shadow="hover"
            class="comment-item"
          >
            <div class="comment-header">
              <div class="comment-user">
                <el-avatar :size="40" :src="defaultAvatar"></el-avatar>
                <span class="user-nickname">{{ comment.user.username }}</span>
              </div>
              <div class="comment-time">
                {{ new Date(comment.createdAt).toLocaleString() }}
              </div>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-actions">
              <el-button size="small" type="text" @click="toggleReplyForm(comment)">
                <el-icon><ChatDotRound /></el-icon> 回复
              </el-button>
              <el-button size="small" type="text" @click="toggleReplyList(comment)">
                <el-icon>
                  <CaretTop v-if="comment.expanded" />
                  <CaretBottom v-else />
                </el-icon>
                {{ comment.expanded ? '收起回复' : ((comment.replies?.length || 0) > 0 ? '展开回复' : '暂无回复') }} ({{ comment.replies?.length || 0 }})
              </el-button>
              <el-button v-if="isLoggedIn && comment.user?.id === userInfo.id" size="small" type="danger" text @click="handleDeleteComment(comment)">
                <el-icon><Delete /></el-icon> 删除
              </el-button>
            </div>
            
            <!-- 回复列表 -->
            <div class="reply-list" v-if="comment.expanded && (comment.replies?.length || 0) > 0">
              <el-card
                v-for="reply in comment.replies"
                :key="reply.id"
                shadow="hover"
                class="reply-item"
              >
                <div class="reply-header">
                  <div class="reply-user">
                    <el-avatar :size="32" :src="defaultAvatar"></el-avatar>
                    <span class="user-nickname">{{ reply.user.username }}</span>
                  </div>
                  <div class="reply-time">
                    {{ new Date(reply.createdAt).toLocaleString() }}
                  </div>
                </div>
                <div class="reply-content">
                  <span v-if="reply.parentComment && reply.parentComment.user && reply.parentComment.user.username !== reply.user.username">
                    <span class="reply-to">@{{ reply.parentComment.user.username }}：</span>
                  </span>
                  {{ reply.content }}
                </div>
                <div class="reply-actions">
                  <el-button size="small" type="text" @click="replyToReply(comment, reply)">
                    <el-icon><ChatDotRound /></el-icon> 回复
                  </el-button>
                  <el-button v-if="isLoggedIn && reply.user?.id === userInfo.id" size="small" type="danger" text @click="handleDeleteComment(reply)">
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </div>
              </el-card>
            </div>
            
            <!-- 回复输入框 -->
            <div v-if="replyingCommentId === comment.id" class="reply-form-container" :data-comment-id="comment.id">
              <el-input
                v-model="replyForm.content"
                type="textarea"
                placeholder="写下你的回复..."
                :rows="3"
                resize="vertical"
                @keyup.enter="submitReply(comment.id)"
              ></el-input>
              <div class="reply-form-actions">
                <el-button size="small" @click="cancelReply">取消</el-button>
                <el-button type="primary" size="small" @click="submitReply(comment.id)" :loading="replyLoading">
                  发送回复
                </el-button>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 评论分页 -->
        <div class="comment-pagination" v-if="comments.count > 0">
          <el-pagination
            v-model:current-page="commentPage.current"
            v-model:page-size="commentPage.size"
            :page-sizes="[5, 10, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="comments.count"
            @size-change="handleCommentSizeChange"
            @current-change="handleCommentCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 右侧边栏 -->
    <aside class="sidebar">
      <!-- 相关文章推荐 -->
      <section class="sidebar-section">
        <h3 class="sidebar-title">相关文章</h3>
        <ul class="related-articles">
          <li class="related-article-item" v-for="related in relatedArticles" :key="related.id">
            <router-link :to="`/articles/${related.id}`" class="related-article-link">
              <div class="related-article-title">{{ related.title }}</div>
              <div class="related-article-meta">
                <span>{{ related.viewCount }} 阅读</span>
                <span>{{ new Date(related.publishTime).toLocaleDateString() }}</span>
              </div>
            </router-link>
          </li>
        </ul>
      </section>
    </aside>
  </div>
</template>

<script>
import { articleApi, commentApi } from '../api'
import { marked } from 'marked'
import { User, View, Comment, ChatDotRound, Star, StarFilled, CaretTop, CaretBottom, Delete } from '@element-plus/icons-vue'

export default {
  name: 'ArticleDetailView',
  components: {
    User,
    View,
    Comment,
    ChatDotRound,
    Star,
    StarFilled,
    CaretTop,
    CaretBottom,
    Delete
  },
  data() {
    return {
      article: {
        id: '',
        title: '',
        content: '',
        summary: '',
        coverImage: '',
        categories: [],
        tags: [],
        publishTime: '',
        createdAt: '',
        updatedAt: '',
        author: {
          id: '',
          username: ''
        },
        status: ''
      },
      renderedContent: '',
      tocItems: [],
      comments: {
        comments: [],
        count: 0
      },
      relatedArticles: [],
      commentPage: {
        current: 1,
        size: 10
      },
      commentForm: {
        content: '',
        parentId: null
      },
      commentRules: {
        content: [
          { required: true, message: '请输入评论内容', trigger: 'blur' },
          { min: 1, max: 500, message: '评论内容长度在 1 到 500 个字符', trigger: 'blur' }
        ]
      },
      commentFormRef: null,
      commentLoading: false,
      // 回复相关数据
      replyingCommentId: null,
      replyingToReplyId: null,
      replyForm: {
        content: ''
      },
      replyLoading: false,
      defaultAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      loading: true,
      // 登录状态和用户信息
      isLoggedIn: false,
      userInfo: {
        id: '',
        username: ''
      }
    }
  },
  
  mounted() {
    // 检查登录状态
    this.checkLoginStatus()
    // 加载文章详情
    this.loadArticleDetail()
  },
  
  watch: {
    // 监听路由变化，确保登录状态正确
    '$route': {
      handler() {
        this.checkLoginStatus()
      },
      immediate: true
    }
  },
  methods: {
    // 加载文章详情
    async loadArticleDetail() {
      this.loading = true
      try {
        const articleId = this.$route.params.id
        // 并行加载文章详情、评论和相关文章
        const [articleRes, commentsRes, relatedArticlesRes] = await Promise.all([
          articleApi.getArticleById(articleId),
          commentApi.getComments(articleId, this.commentPage),
          articleApi.getArticles({ page: 1, size: 5, status: 'published' })
        ])

        // 处理文章数据
        this.article = articleRes?.article || { ...this.article }
        // 渲染Markdown内容
        if (this.article && this.article.content) {
          this.renderedContent = marked(this.article.content)
          // 生成目录
          this.generateToc()
        } else {
          this.renderedContent = ''
          this.tocItems = []
        }

        // 处理评论数据
        this.comments = commentsRes || { comments: [], count: 0 }
        // 确保comments.comments是数组
        if (!Array.isArray(this.comments.comments)) {
          this.comments.comments = []
        }
        
        // 为每条评论添加expanded字段，默认关闭回复列表
        for (const comment of this.comments.comments) {
          comment.expanded = false
          // 确保评论有replies属性，初始化为空数组
          comment.replies = []
          // 加载每条评论的回复
          await this.loadReplies(comment)
        }

        // 处理相关文章数据 - 确保articles是数组
        this.relatedArticles = Array.isArray(relatedArticlesRes?.articles) ? relatedArticlesRes.articles : []
      } catch (error) {
        console.error('加载文章详情失败:', error)
        this.$message.error('加载文章详情失败，请稍后重试')
        // 重置数据，避免页面崩溃
        this.comments = { comments: [], count: 0 }
        this.relatedArticles = []
      } finally {
        this.loading = false
      }
    },

    // 生成目录
    generateToc() {
      const regex = /<h([23])\s+id="([^"]+)">([^<]+)<\/h\1>/g
      const toc = []
      let match
      while ((match = regex.exec(this.renderedContent)) !== null) {
        toc.push({
          level: parseInt(match[1]),
          id: match[2],
          text: match[3]
        })
      }
      this.tocItems = toc
    },

    // 检查登录状态
    checkLoginStatus() {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const userInfoStr = localStorage.getItem('userInfo')
      
      if (isLoggedIn && userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr)
          this.userInfo = userInfo
          this.isLoggedIn = true
        } catch (error) {
          console.error('解析用户信息失败:', error)
          this.isLoggedIn = false
          this.clearLoginInfo()
        }
      } else {
        this.isLoggedIn = false
      }
    },
    
    // 清除登录信息
    clearLoginInfo() {
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
    },
    
    // 滚动到指定章节
    scrollToSection(id) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },

    // 加载评论列表
    async loadComments() {
      try {
        // 确保article.id存在
        if (!this.article || !this.article.id) {
          console.error('文章ID不存在，无法加载评论')
          return
        }
        
        const res = await commentApi.getComments(this.article.id, this.commentPage)
        // 确保res是有效的对象
        this.comments = res || { comments: [], count: 0 }
        
        // 确保comments.comments是数组
        if (!Array.isArray(this.comments.comments)) {
          this.comments.comments = []
        }
        
        // 为每条评论添加expanded字段，默认关闭回复列表
        for (const comment of this.comments.comments) {
          comment.expanded = false
          // 确保评论有replies属性，初始化为空数组
          comment.replies = []
          // 加载每条评论的回复
          await this.loadReplies(comment)
        }
      } catch (error) {
        console.error('加载评论失败:', error)
        this.$message.error('加载评论失败，请稍后重试')
        // 重置评论数据，避免页面崩溃
        this.comments = { comments: [], count: 0 }
      }
    },
    
    // 加载单个评论的回复（只加载到第二层，不再递归加载更深层级）
    async loadReplies(comment) {
      try {
        // 确保comment和comment.id存在
        if (!comment || !comment.id) {
          console.error('评论ID不存在，无法加载回复')
          return
        }
        
        const res = await commentApi.getReplies(comment.id)
        // 确保res和res.replies是有效的
        comment.replies = res?.replies || []
        
        // 只加载到第二层回复，不再递归加载更深层级
        for (const reply of comment.replies) {
          // 确保每个回复都有replies属性，即使是空数组
          reply.replies = []
        }
      } catch (error) {
        console.error('加载回复失败:', error)
        // 确保comment.replies是数组
        comment.replies = []
      }
    },
    
    // 回复评论的回复
    replyToReply(comment, reply) {
      // 设置父评论ID为当前回复的ID
      this.replyingCommentId = comment.id
      // 存储要回复的回复ID
      this.replyingToReplyId = reply.id
      // 在回复内容中自动添加@被回复人
      this.replyForm.content = `@${reply.user.username} `
      // 自动展开回复列表
      comment.expanded = true
      // 滚动到回复表单
      this.$nextTick(() => {
        const replyForm = document.querySelector(`[data-comment-id="${comment.id}"]`)
        if (replyForm) {
          replyForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        // 聚焦到输入框
        const input = replyForm?.querySelector('textarea')
        if (input) {
          input.focus()
          input.setSelectionRange((this.replyForm.content?.length || 0), (this.replyForm.content?.length || 0))
        }
      })
    },
    
    // 切换回复列表显示
    toggleReplyList(comment) {
      comment.expanded = !comment.expanded
    },
    
    // 切换回复表单显示
    toggleReplyForm(comment) {
      if (this.replyingCommentId === comment.id) {
        this.replyingCommentId = null
        this.replyingToReplyId = null
        this.replyForm.content = ''
      } else {
        this.replyingCommentId = comment.id
        this.replyingToReplyId = null
        this.replyForm.content = ''
        // 自动展开回复列表
        comment.expanded = true
        // 滚动到回复表单
        this.$nextTick(() => {
          const replyForm = document.querySelector(`[data-comment-id="${comment.id}"]`)
          if (replyForm) {
            replyForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      }
    },
    
    // 提交回复
    async submitReply(commentId) {
      if (!this.replyForm.content.trim()) {
        this.$message.warning('请输入回复内容')
        return
      }
      
      this.replyLoading = true
      try {
        const replyData = {
          articleId: this.article.id,
          userId: this.userInfo.id, // 使用真实的登录用户ID
          parentCommentId: this.replyingToReplyId || commentId,
          content: this.replyForm.content
        }
        const res = await commentApi.createReply(replyData)
        if (res.success) {
          this.$message.success('回复发表成功')
          this.replyForm.content = ''
          this.replyingCommentId = null
          this.replyingToReplyId = null
          // 重新加载评论列表
          await this.loadComments()
          // 确保回复列表仍然展开
          const comment = this.comments.comments.find(c => c.id === commentId)
          if (comment) {
            comment.expanded = true
          }
        }
      } catch (error) {
        console.error('发表回复失败:', error)
        this.$message.error(error.response?.data?.message || '发表回复失败，请稍后重试')
      } finally {
        this.replyLoading = false
      }
    },
    
    // 取消回复
    cancelReply() {
      this.replyingCommentId = null
      this.replyingToReplyId = null
      this.replyForm.content = ''
    },
    
    // 删除评论
    async handleDeleteComment(comment) {
      try {
        // 显示确认对话框
        await this.$confirm('确定要删除这条评论吗？删除后无法恢复', '删除确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        // 调用API删除评论，传递userId参数
        await commentApi.deleteComment(comment.id, this.userInfo.id)
        
        // 重新加载评论列表
        await this.loadComments()
        
        // 显示成功提示
        this.$message.success('评论删除成功')
      } catch (error) {
        // 如果是取消删除，不显示错误提示
        if (error !== 'cancel') {
          console.error('删除评论失败:', error)
          this.$message.error('删除评论失败，请稍后重试')
        }
      }
    },

    // 提交评论
    async submitComment() {
      this.$refs.commentFormRef.validate(async (valid) => {
        if (valid) {
          this.commentLoading = true
          try {
            let res;
            // 根据是否有parentId来决定是创建评论还是回复
            if (this.commentForm.parentId) {
              // 创建回复
              const replyData = {
                articleId: this.article.id,
                userId: this.userInfo.id, // 使用真实的登录用户ID
                parentCommentId: this.commentForm.parentId,
                content: this.commentForm.content
              }
              res = await commentApi.createReply(replyData)
            } else {
              // 构建评论数据
              const commentData = {
                articleId: this.article.id,
                userId: this.userInfo.id, // 使用真实的登录用户ID
                content: this.commentForm.content
              }
              res = await commentApi.createComment(commentData)
            }
            
            if (res.success) {
              this.$message.success(this.commentForm.parentId ? '回复发表成功' : '评论发表成功')
              this.commentForm.content = ''
              this.commentForm.parentId = null
              // 重新加载评论列表
              this.loadComments()
            }
          } catch (error) {
            console.error('发表评论/回复失败:', error)
            this.$message.error(error.response?.data?.message || '发表评论/回复失败，请稍后重试')
          } finally {
            this.commentLoading = false
          }
        }
      })
    },

    // 回复评论
    replyComment(comment) {
      this.commentForm.parentId = comment.id
      // 滚动到评论表单
      this.$nextTick(() => {
        document.querySelector('.comment-form-card').scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },

    // 处理评论分页大小变化
    handleCommentSizeChange(size) {
      this.commentPage.size = size
      this.loadComments()
    },

    // 处理评论当前页码变化
    handleCommentCurrentChange(page) {
      this.commentPage.current = page
      this.loadComments()
    }
  }
}
</script>

<style scoped>
.article-detail {
  display: flex;
  gap: 30px;
}

/* 文章内容区域 */
.article-content {
  flex: 1;
}

.article-card {
  margin-bottom: 30px;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #34495e;
  line-height: 1.4;
}

/* 文章元信息 */
.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #ecf0f1;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #95a5a6;
  font-size: 14px;
}

/* 文章标签 */
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

/* 文章内容 */
.article-body {
  display: flex;
  gap: 30px;
}

/* 目录导航 */
.toc-container {
  width: 240px;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.toc-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #34495e;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  cursor: pointer;
  padding: 8px 0;
  color: #555;
  transition: all 0.3s ease;
  font-size: 14px;
}

.toc-item:hover {
  color: #3498db;
  transform: translateX(5px);
}

.toc-item-h2 {
  font-weight: 600;
}

.toc-item-h3 {
  padding-left: 20px;
  font-size: 13px;
}

/* 内容容器 */
.content-container {
  flex: 1;
}

/* Markdown内容样式 */
.markdown-content {
  color: #333;
  line-height: 1.8;
}

.markdown-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 32px 0 16px 0;
  color: #34495e;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
}

.markdown-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px 0;
  color: #34495e;
}

.markdown-content p {
  margin: 16px 0;
  text-align: justify;
}

.markdown-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.markdown-content code {
  background-color: #f0f2f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  color: #e74c3c;
}

.markdown-content pre {
  background-color: #f0f2f5;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 20px 0;
}

.markdown-content pre code {
  background-color: transparent;
  padding: 0;
  color: #333;
  font-size: 0.9em;
}

.markdown-content blockquote {
  border-left: 4px solid #3498db;
  padding: 12px 20px;
  margin: 20px 0;
  background-color: #ecf0f1;
  border-radius: 0 4px 4px 0;
}

.markdown-content ul,
.markdown-content ol {
  margin: 16px 0;
  padding-left: 32px;
}

.markdown-content li {
  margin: 8px 0;
}

.markdown-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.markdown-content th,
.markdown-content td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.markdown-content th {
  background-color: #f5f7fa;
  font-weight: 600;
}

/* 评论区 */
.comment-section {
  margin-top: 30px;
}

.comment-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #34495e;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

.comment-form-card {
  margin-bottom: 30px;
}

.comment-form {
  max-width: 100%;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  transition: all 0.3s ease;
}

.comment-item:hover {
  transform: translateY(-2px);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.comment-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-nickname {
  font-weight: 600;
  color: #34495e;
}

.comment-time {
  color: #95a5a6;
  font-size: 14px;
}

.comment-content {
  margin-bottom: 12px;
  color: #555;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 回复列表 */
.reply-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ecf0f1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reply-item {
  padding-left: 48px;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.reply-user {
  font-weight: 600;
  color: #34495e;
  font-size: 14px;
}

.reply-time {
  color: #95a5a6;
  font-size: 12px;
}

.reply-content {
  color: #555;
  line-height: 1.5;
  font-size: 14px;
}

/* 回复列表 */
.reply-list {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reply-item {
  margin-left: 40px;
  padding: 12px;
  background-color: #f9f9f9;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.reply-user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.reply-time {
  font-size: 12px;
  color: #95a5a6;
}

.reply-content {
  font-size: 14px;
  color: #555;
  line-height: 1.5;
}

.reply-content .reply-to {
  color: #3498db;
  font-weight: 500;
  margin-right: 4px;
}

/* 回复表单 */
.reply-form-container {
  margin-top: 16px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
  margin-left: 40px;
}

.reply-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

/* 评论操作区域 */
.comment-actions {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}

/* 回复操作区域 */
.reply-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  justify-content: flex-start;
}

/* 评论分页 */
.comment-pagination {
  margin-top: 30px;
  text-align: center;
}

/* 相关文章 */
.sidebar {
  width: 300px;
}

.sidebar-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 100px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #34495e;
  padding-bottom: 8px;
  border-bottom: 2px solid #3498db;
}

.related-articles {
  list-style: none;
  padding: 0;
  margin: 0;
}

.related-article-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ecf0f1;
}

.related-article-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.related-article-link {
  text-decoration: none;
  color: #34495e;
  transition: color 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.related-article-link:hover {
  color: #3498db;
}

.related-article-title {
  font-weight: 500;
  line-height: 1.4;
  font-size: 16px;
}

.related-article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #95a5a6;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .article-body {
    flex-direction: column;
  }
  
  .toc-container {
    width: 100%;
    position: static;
    max-height: none;
    margin-bottom: 30px;
  }
}

@media (max-width: 992px) {
  .article-detail {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .sidebar-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .article-title {
    font-size: 24px;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .meta-right {
    justify-content: flex-start;
  }
}
</style>