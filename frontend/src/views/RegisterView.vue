<template>
  <div class="register-page">
    <el-card class="register-card" shadow="hover">
      <template #header>
        <h2 class="register-title">注册</h2>
      </template>
      <el-form
        ref="registerFormRef"
        :model="registerForm"
        :rules="registerRules"
        class="register-form"
        @submit.prevent="handleRegister"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="registerForm.email"
            type="email"
            placeholder="请输入邮箱"
            size="large"
            prefix-icon="Message"
          ></el-input>
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            size="large"
            prefix-icon="Lock"
            show-password
          ></el-input>
        </el-form-item>
        
        <el-form-item class="register-actions">
          <el-button type="primary" size="large" class="register-btn" @click="handleRegister">
            注册
          </el-button>
          <el-button size="large" @click="$router.push('/login')">
            去登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { userApi } from '../api'

export default {
  name: 'RegisterView',
  data() {
    return {
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '密码长度在 8 到 20 个字符', trigger: 'blur' },
          { pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: '密码必须包含大写字母、数字和特殊字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    
    async handleRegister() {
      try {
        const valid = await this.$refs.registerFormRef.validate()
        if (valid) {
          // 创建注册API请求
          const response = await userApi.register(this.registerForm)
          
          this.$message.success('注册成功，请登录')
          this.$router.push('/login')
        }
      } catch (error) {
        console.error('注册失败:', error)
        this.$message.error(error.response?.data?.message || '注册失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 20px;
}

.register-card {
  width: 100%;
  max-width: 400px;
}

.register-title {
  text-align: center;
  margin: 0;
  color: #3498db;
  font-size: 24px;
}

.register-form {
  margin-top: 30px;
}

.register-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
}

.register-btn {
  width: 120px;
}
</style>