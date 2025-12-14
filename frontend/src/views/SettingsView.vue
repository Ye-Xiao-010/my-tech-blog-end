<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>账户设置</h1>
      <p>管理您的个人信息和账户安全</p>
    </div>

    <div class="settings-content">
      <!-- 个人信息设置 -->
      <div class="settings-card">
        <h4>个人信息</h4>
        <el-form :model="userForm" label-width="120px" class="settings-form">
          <el-form-item label="用户名">
            <el-input v-model="userForm.username" disabled placeholder="用户名不可修改" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="userForm.nickname" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" type="email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo" :loading="updateLoading">保存修改</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 密码修改 -->
      <div class="settings-card">
        <h4>修改密码</h4>
        <el-form :model="passwordForm" label-width="120px" class="settings-form" :rules="passwordRules" ref="passwordFormRef">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入旧密码" show-password />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePassword" :loading="changePasswordLoading">修改密码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '../api/index'

export default {
  name: 'SettingsView',
  setup() {
    const router = useRouter()
    const passwordFormRef = ref(null)
    const updateLoading = ref(false)
    const changePasswordLoading = ref(false)
    const userInfo = ref(null)
    
    // 用户信息表单
    const userForm = reactive({
      username: '',
      nickname: '',
      email: ''
    })
    
    // 密码修改表单
    const passwordForm = reactive({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    // 密码表单验证规则
    const passwordRules = {
      oldPassword: [
        { required: true, message: '请输入旧密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '新密码长度不能少于6个字符', trigger: 'blur' }
      ],
      confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            if (value !== passwordForm.newPassword) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
    
    // 获取用户信息
    const getUserInfo = async () => {
      try {
        // 先尝试从localStorage获取用户信息
        const storedUserInfo = localStorage.getItem('userInfo')
        if (storedUserInfo) {
          userInfo.value = JSON.parse(storedUserInfo)
          updateUserForm()
        } else {
          // 如果localStorage中没有用户信息，跳转到登录页面
          router.push({ path: '/login', query: { redirect: '/settings' } })
          return
        }
        
        // 然后尝试从后端获取最新的用户信息
        try {
          const res = await userApi.getUserInfo()
          if (res.success) {
            userInfo.value = res.user
            updateUserForm()
            // 更新localStorage中的用户信息
            localStorage.setItem('userInfo', JSON.stringify(res.user))
          }
        } catch (apiError) {
          console.log('从后端获取最新用户信息失败，使用localStorage中的用户信息作为备份:', apiError.message)
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果发生严重错误，跳转到登录页面
        router.push({ path: '/login', query: { redirect: '/settings' } })
      }
    }
    
    // 更新用户表单数据
    const updateUserForm = () => {
      if (userInfo.value) {
        userForm.username = userInfo.value.username || ''
        userForm.nickname = userInfo.value.nickname || ''
        userForm.email = userInfo.value.email || ''
      }
    }
    
    // 更新用户信息
    const updateUserInfo = async () => {
      updateLoading.value = true
      try {
        const res = await userApi.updateUserInfo(userForm)
        if (res.success) {
          // 更新用户信息
          userInfo.value = { ...userInfo.value, ...userForm }
          // 更新localStorage
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
          // 显示成功消息
          alert('个人信息更新成功！')
        }
      } catch (error) {
        console.error('更新个人信息失败:', error)
        alert('更新个人信息失败，请稍后重试')
      } finally {
        updateLoading.value = false
      }
    }
    
    // 修改密码
    const changePassword = async () => {
      // 表单验证
      if (!passwordFormRef.value) return
      const isValid = await passwordFormRef.value.validate()
      if (!isValid) return
      
      changePasswordLoading.value = true
      try {
        const res = await userApi.changePassword(passwordForm)
        if (res.success) {
          // 清空表单
          passwordForm.oldPassword = ''
          passwordForm.newPassword = ''
          passwordForm.confirmPassword = ''
          // 显示成功消息
          alert('密码修改成功！')
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        alert('修改密码失败，请检查旧密码是否正确或稍后重试')
      } finally {
        changePasswordLoading.value = false
      }
    }
    
    // 初始化数据
    onMounted(async () => {
      await getUserInfo()
    })
    
    return {
      passwordFormRef,
      updateLoading,
      changePasswordLoading,
      userForm,
      passwordForm,
      passwordRules,
      updateUserInfo,
      changePassword
    }
  }
}
</script>

<style scoped>
.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.settings-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.settings-header h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}

.settings-header p {
  color: #666;
  font-size: 1.1rem;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.settings-card {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-card h4 {
  margin: 0 0 20px 0;
  color: #555;
  font-size: 1.3rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.settings-form {
  max-width: 600px;
}

.settings-form .el-form-item {
  margin-bottom: 20px;
}

.settings-form .el-button {
  margin-right: 10px;
}

@media (max-width: 768px) {
  .settings-container {
    padding: 10px;
  }
  
  .settings-card {
    padding: 15px;
  }
  
  .settings-form {
    max-width: 100%;
  }
  
  .settings-header h1 {
    font-size: 2rem;
  }
}
</style>