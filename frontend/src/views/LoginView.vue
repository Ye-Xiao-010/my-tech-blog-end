<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <template #header>
        <h2 class="login-title">登录</h2>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item class="login-actions">
          <el-button type="primary" size="large" class="login-btn" @click="handleLogin">
            登录
          </el-button>
          <el-button size="large" @click="$router.push('/register')">
            去注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { userApi } from '../api'

export default {
  name: 'LoginView',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleLogin() {
      try {
        const valid = await this.$refs.loginFormRef.validate()
        if (valid) {
          try {
            // 调用登录API
            const response = await userApi.login(this.loginForm)
            console.log('登录响应:', response)
            
            // 检查登录是否成功
            if (response.success) {
              // 保存用户信息到localStorage，确保包含角色信息
              const userInfo = response.user || {}
              // 确保角色字段存在
              if (!userInfo.role) {
                // 如果后端没有返回角色，默认设置为USER
                userInfo.role = 'USER'
              }
              localStorage.setItem('userInfo', JSON.stringify(userInfo))
              localStorage.setItem('isLoggedIn', 'true')
              this.$message.success(response.message || '登录成功')
              // 跳转到之前访问的页面或首页
              const redirectUrl = this.$route.query.redirect || '/'
              this.$router.push(redirectUrl)
            } else {
              // 显示登录失败信息
              this.$message.error(response.message || '登录失败')
            }
          } catch (error) {
            console.error('登录请求错误:', error)
            this.$message.error(error.response?.data?.message || '登录失败，请检查用户名和密码')
          }
        }
      } catch (error) {
        console.error('登录失败:', error)
        this.$message.error(error.response?.data?.message || '登录失败，请检查用户名和密码')
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin: 0;
  color: #3498db;
  font-size: 24px;
}

.login-form {
  margin-top: 30px;
}

.login-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.login-btn {
  width: 120px;
}
</style>