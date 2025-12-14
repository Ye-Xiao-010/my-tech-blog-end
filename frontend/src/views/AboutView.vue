<template>
  <div class="about-page">
    <h2 class="page-title">关于我们</h2>
    <el-card shadow="hover" class="about-card">
      <div class="about-content">
        <h3>技术博客</h3>
        <p>技术博客是一个分享技术知识、交流学习经验的平台，旨在帮助开发者更好地学习和成长。</p>
        <h4>我们的愿景</h4>
        <p>成为最受欢迎的技术博客平台，为开发者提供高质量的技术内容和良好的学习环境。</p>
        <h4>我们的使命</h4>
        <p>分享技术知识，促进技术交流，推动技术发展。</p>
        <h4>联系我们</h4>
        <ul class="contact-list">
          <li>邮箱：admin@example.com</li>
          <li>微信：tech-blog</li>
          <li>GitHub：@tech-blog</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AboutView'
}
</script>

<style scoped>
.about-page {
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

.about-card {
  max-width: 800px;
  margin: 0 auto;
}

.about-content {
  padding: 20px;
}

.about-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #34495e;
}

.about-content h4 {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px 0;
  color: #34495e;
}

.about-content p {
  margin-bottom: 16px;
  color: #555;
  line-height: 1.6;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 16px 0;
}

.contact-list li {
  margin-bottom: 12px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .about-content h3 {
    font-size: 20px;
  }
  
  .about-content h4 {
    font-size: 18px;
  }
}
</style>