<template>
  <div class="write-article-page">
    <h2 class="page-title">写文章</h2>
    
    <el-card shadow="hover" class="write-article-card">
      <el-form
        ref="articleFormRef"
        :model="articleForm"
        :rules="articleRules"
        class="write-article-form"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="articleForm.title"
            placeholder="请输入文章标题"
            size="large"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="文章摘要" prop="summary">
          <el-input
            v-model="articleForm.summary"
            type="textarea"
            placeholder="请输入文章摘要"
            rows="3"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="封面图片URL" prop="coverImage">
          <el-input
            v-model="articleForm.coverImage"
            placeholder="请输入封面图片URL"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="文章内容" prop="content">
          <el-input
            v-model="articleForm.content"
            type="textarea"
            placeholder="请输入文章内容"
            rows="15"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-select v-model="articleForm.status" placeholder="请选择文章状态">
            <el-option label="草稿" value="DRAFT"></el-option>
            <el-option label="已发布" value="PUBLISHED"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="分类" prop="categoryIds">
          <el-select
            v-model="articleForm.categoryIds"
            placeholder="请选择分类"
            multiple
            style="width: 100%"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            ></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="标签" prop="tagNames">
          <tag-input
            v-model="articleForm.tagNames"
            placeholder="请输入标签，按Enter键添加"
            style="width: 100%"
          ></tag-input>
        </el-form-item>
        
        <el-form-item class="form-actions">
          <el-button type="primary" size="large" @click="handleSubmit">
            保存并发布
          </el-button>
          <el-button size="large" @click="handleSaveDraft">
            保存草稿
          </el-button>
          <el-button size="large" @click="$router.push('/articles')">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { articleApi, categoryApi } from '../api'
import TagInput from '../components/TagInput.vue'

export default {
  name: 'WriteArticleView',
  components: {
    TagInput
  },
  data() {
    return {
      articleForm: {
        title: '',
        content: '',
        summary: '',
        coverImage: '',
        status: 'DRAFT',
        categoryIds: [],
        tagNames: []
      },
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 100, message: '文章标题长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          { min: 10, message: '文章内容至少 10 个字符', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入文章摘要', trigger: 'blur' },
          { min: 20, max: 200, message: '文章摘要长度在 20 到 200 个字符', trigger: 'blur' }
        ]
      },
      categories: [],
      loading: false
    }
  },
  mounted() {
    this.loadCategories()
  },
  methods: {
    // 加载分类数据
    async loadCategories() {
      try {
        const response = await categoryApi.getCategories({ size: 100 })
        this.categories = response.categories || []
      } catch (error) {
        console.error('加载分类失败:', error)
        this.$message.error('加载分类失败，请稍后重试')
      }
    },
    
    // 提交文章
    async handleSubmit() {
      try {
        const valid = await this.$refs.articleFormRef.validate()
        if (valid) {
          this.loading = true
          
          // 构建文章数据
          const articleData = {
            ...this.articleForm,
            authorId: 1, // 这里应该从登录用户信息中获取，暂时硬编码为1
            publishTime: this.articleForm.status === 'PUBLISHED' ? new Date().toISOString().slice(0, 19) : null
          }
          
          // 调用API创建文章
          const response = await articleApi.createArticle(articleData)
          
          this.$message.success('文章发布成功')
          this.$router.push('/articles')
        }
      } catch (error) {
        console.error('发布文章失败:', error)
        this.$message.error(error.response?.data?.message || '发布文章失败，请稍后重试')
      } finally {
        this.loading = false
      }
    },
    
    // 保存草稿
    async handleSaveDraft() {
      try {
        this.articleForm.status = 'DRAFT'
        const valid = await this.$refs.articleFormRef.validate()
        if (valid) {
          this.loading = true
          
          // 构建文章数据
          const articleData = {
            ...this.articleForm,
            authorId: 1, // 这里应该从登录用户信息中获取，暂时硬编码为1
            publishTime: null
          }
          
          // 调用API创建文章
          const response = await articleApi.createArticle(articleData)
          
          this.$message.success('草稿保存成功')
          this.$router.push('/articles')
        }
      } catch (error) {
        console.error('保存草稿失败:', error)
        this.$message.error(error.response?.data?.message || '保存草稿失败，请稍后重试')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.write-article-page {
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

.write-article-card {
  margin-bottom: 20px;
}

.write-article-form {
  margin-top: 20px;
}

.form-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 30px;
}
</style>