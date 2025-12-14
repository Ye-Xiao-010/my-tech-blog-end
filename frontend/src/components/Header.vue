<template>
  <header class="header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/" class="logo-link">
          <h1>技术博客</h1>
        </router-link>
      </div>
      <nav class="nav">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">首页</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/articles" class="nav-link" active-class="active">文章</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/categories" class="nav-link" active-class="active">分类</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/tags" class="nav-link" active-class="active">标签</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" active-class="active">关于</router-link>
          </li>
        </ul>
      </nav>
      <div class="header-actions">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文章"
          clearable
          class="search-input"
          @keyup.enter="handleSearch"
          :prefix-icon="Search"
        >
          <template #append>
            <el-button type="primary" round @click="handleSearch">
              搜索
            </el-button>
          </template>
        </el-input>
        
        <!-- 写文章按钮 -->
        <el-button v-if="isLoggedIn" type="primary" size="small" @click="$router.push('/write-article')">
          写文章
        </el-button>
        
        <!-- 用户信息/登录注册按钮 -->
        <div v-if="isLoggedIn" class="user-info">
          <el-dropdown @command="handleDropdownCommand">
            <div class="user-dropdown">
              <el-avatar :size="32" :src="userInfo.avatar || defaultAvatar" class="user-avatar"></el-avatar>
              <span class="user-name">{{ userInfo.username }}</span>
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <!-- 管理员入口，只对管理员显示 -->
                <el-dropdown-item v-if="userInfo.role === 'ADMIN'" command="admin">管理员面板</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div v-else class="auth-buttons">
          <el-button size="small" @click="$router.push('/login')">登录</el-button>
          <el-button type="primary" size="small" @click="$router.push('/register')">注册</el-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { userApi } from '../api'
import { ArrowDown, Search } from '@element-plus/icons-vue'

export default {
  name: 'Header',
  components: {
    ArrowDown,
    Search
  },
  data() {
    return {
      searchKeyword: '',
      isLoggedIn: false,
      userInfo: {
        username: '',
        avatar: '',
        role: 'USER'
      },
      defaultAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
    }
  },
  mounted() {
    // 检查登录状态
    this.checkLoginStatus()
    
    // 监听路由变化，确保在页面跳转时重新检查登录状态
    this.$router.afterEach(() => {
      this.checkLoginStatus()
    })
  },
  methods: {
    handleSearch() {
      if (this.searchKeyword) {
        this.$router.push({
          path: '/articles',
          query: { keyword: this.searchKeyword }
        })
      }
    },
    checkLoginStatus() {
      // 从localStorage获取登录状态和用户信息
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
    clearLoginInfo() {
      // 清除localStorage中的登录信息
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('token')
    },
    handleDropdownCommand(command) {
      switch (command) {
        case 'profile':
          // 跳转到个人中心
          this.$router.push('/profile')
          break
        case 'settings':
          // 跳转到设置页面
          this.$router.push('/settings')
          break
        case 'admin':
          // 跳转到管理员面板
          this.$router.push('/admin')
          break
        case 'logout':
          this.handleLogout()
          break
      }
    },
    handleLogout() {
      // 清除登录信息
      this.clearLoginInfo()
      // 更新登录状态
      this.isLoggedIn = false
      this.userInfo = {
        username: '',
        avatar: ''
      }
      // 显示退出成功消息
      this.$message.success('退出登录成功')
      // 跳转到首页
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  text-decoration: none;
  color: #3498db;
}

.logo h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 32px;
}

.nav-link {
  text-decoration: none;
  color: #34495e;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #3498db;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  width: 300px;
  border-radius: 25px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  background-color: #f5f7fa;
}

.search-input:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.search-input .el-input__inner {
  border-radius: 25px;
  border-color: transparent;
  background-color: transparent;
  transition: all 0.3s ease;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
}

.search-input .el-input__inner:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  background-color: #ffffff;
}

.search-input .el-input__prefix {
  left: 15px;
  color: #909399;
}

.search-input .el-input__suffix {
  right: 10px;
}

.search-input .el-input__append .el-button {
  border-radius: 20px;
  border: none;
  height: 32px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-input .el-input__append .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.search-input .el-input__clear {
  right: 90px;
  color: #909399;
}

/* 小屏幕适配 */
@media (max-width: 768px) {
  .search-input {
    width: 200px;
  }
  
  .search-input .el-input__append .el-button {
    padding: 0 12px;
    font-size: 12px;
  }
  
  .search-input .el-input__clear {
    right: 75px;
  }
}

.auth-buttons {
  display: flex;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f7fa;
}

.user-avatar {
  cursor: pointer;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .nav {
    display: none;
  }
  
  .search-input {
    width: 180px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
  
  .user-name {
    display: none;
  }
}
</style>