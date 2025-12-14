<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>技术博客</h3>
          <p>分享技术知识，交流学习经验</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <div class="footer-links">
            <router-link to="/">首页</router-link>
            <span class="link-divider">|</span>
            <router-link to="/articles">文章</router-link>
            <span class="link-divider">|</span>
            <router-link to="/categories">分类</router-link>
            <span class="link-divider">|</span>
            <router-link to="/tags">标签</router-link>
            <span class="link-divider">|</span>
            <router-link to="/about">关于</router-link>
          </div>
        </div>
        <div class="footer-section">
          <h4>联系方式</h4>
          <div class="footer-contact">
            <span>邮箱：admin@example.com</span>
            <span class="contact-divider">|</span>
            <span>微信：tech-blog</span>
            <span class="contact-divider">|</span>
            <span>GitHub：@tech-blog</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} 技术博客. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.footer {
  background-color: #34495e;
  color: #ecf0f1;
  padding: 20px 0;
  margin-top: 40px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 16px;
}

.footer-section {
  flex: 1;
  min-width: 180px;
}

.footer-section h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #3498db;
}

.footer-section h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #3498db;
}

.footer-section p {
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.footer-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
}

.footer-links a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #3498db;
}

.link-divider {
  color: #7f8c8d;
  font-size: 12px;
}

.footer-contact {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  margin: 0;
  font-size: 13px;
}

.contact-divider {
  color: #7f8c8d;
  font-size: 12px;
}

.footer-bottom {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #7f8c8d;
  font-size: 12px;
  color: #bdc3c7;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .footer-section {
    min-width: 100%;
  }
}
</style>