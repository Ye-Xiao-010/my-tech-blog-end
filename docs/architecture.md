# 技术博客平台架构文档

## 1. 执行摘要

本架构文档描述了 my-tech-blog-copy 项目的技术架构设计，该项目是一个基于 Spring Boot 后端和 Vue.js 前端的技术博客平台。架构采用分层设计，确保系统的可扩展性、安全性和可维护性。文档涵盖了技术栈选择、系统架构、API 设计、安全设计、部署架构等关键方面，为开发团队提供了清晰的技术指导。

## 2. 项目初始化

### 2.1 后端初始化

```bash
# 使用 Spring Boot Initializr 创建项目
curl -s https://start.spring.io/starter.tgz \n  -d dependencies=web,data-jpa,security,validation,mail,lombok \n  -d javaVersion=17 \n  -d groupId=com.example \n  -d artifactId=my-tech-blog \n  -d name=my-tech-blog \n  -d description=Tech Blog Platform \n  -d packageName=com.example.mytechblog | tar -xzvf -
```

### 2.2 前端初始化

```bash
# 使用 Vite 创建 Vue 项目
npm create vite@latest my-tech-blog-frontend -- --template vue
cd my-tech-blog-frontend
npm install
```

## 3. 技术栈

### 3.1 后端技术栈

| 技术 | 版本 | 用途 | 决策理由 |
|------|------|------|----------|
| Java | 17 | 编程语言 | 稳定、成熟，适合企业级应用开发 |
| Spring Boot | 3.3.5 | 应用框架 | 简化开发，提供丰富的生态系统 |
| Spring Data JPA | 3.3.5 | ORM 框架 | 简化数据库操作，提高开发效率 |
| Spring Security | 6.3.3 | 安全框架 | 提供完整的认证和授权解决方案 |
| MySQL | 8.0 | 数据库 | 稳定、可靠，适合关系型数据存储 |
| Lombok | 1.18.34 | 代码简化库 | 减少样板代码，提高代码可读性 |
| JJWT | 0.12.6 | JWT 库 | 实现无状态认证 |
| BCrypt | 内置 | 密码哈希 | 安全的密码存储方案 |

### 3.2 前端技术栈

| 技术 | 版本 | 用途 | 决策理由 |
|------|------|------|----------|
| Vue.js | 3.4.38 | 前端框架 | 轻量、高效，提供响应式设计 |
| Vite | 5.4.8 | 构建工具 | 快速的开发体验和构建速度 |
| Vue Router | 4.4.5 | 路由管理 | 单页应用路由解决方案 |
| Pinia | 2.2.8 | 状态管理 | 轻量、直观的状态管理方案 |
| Axios | 1.7.7 | HTTP 客户端 | 简洁的 API，支持拦截器和取消请求 |
| Element Plus | 2.8.3 | UI 组件库 | 丰富的组件，支持响应式设计 |
| WangEditor | 5.1.23 | 富文本编辑器 | 轻量、易用，支持代码语法高亮 |
| Day.js | 1.11.13 | 日期处理 | 轻量、高性能的日期处理库 |

## 4. 系统架构

### 4.1 架构概览

采用经典的三层架构设计：

```
┌───────────────────────────────────────────────────────────────────┐
│                          前端层 (Vue.js)                          │
├───────────────────────────────────────────────────────────────────┤
│                          API 网关层                              │
├───────────────────────────────────────────────────────────────────┤
│                          业务逻辑层 (Spring Boot)                 │
├───────────────────────────────────────────────────────────────────┤
│                          数据访问层 (Spring Data JPA)             │
├───────────────────────────────────────────────────────────────────┤
│                          数据库层 (MySQL)                        │
└───────────────────────────────────────────────────────────────────┘
```

### 4.2 模块划分

#### 后端模块

```
my-tech-blog/
├── src/main/java/com/example/mytechblog/
│   ├── config/          # 配置类
│   ├── controller/      # REST API 控制器
│   ├── dto/             # 数据传输对象
│   ├── entity/          # 实体类
│   ├── exception/       # 异常处理
│   ├── repository/      # 数据访问接口
│   ├── security/        # 安全配置
│   ├── service/         # 业务逻辑
│   ├── util/            # 工具类
│   └── MyTechBlogApplication.java  # 应用入口
└── src/main/resources/
    ├── application.properties  # 应用配置
    └── static/          # 静态资源
```

#### 前端模块

```
my-tech-blog-frontend/
├── src/
│   ├── assets/          # 静态资源
│   ├── components/      # 通用组件
│   ├── layouts/         # 页面布局
│   ├── router/          # 路由配置
│   ├── stores/          # 状态管理
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   ├── App.vue          # 根组件
│   └── main.js          # 应用入口
├── public/              # 公共资源
└── vite.config.js       # Vite 配置
```

## 5. 数据架构

### 5.1 实体关系图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │     │   Article   │     │  Category   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │1  ── ∞│ id          │∞  ── 1│ id          │
│ username    │     │ title       │     │ name        │
│ email       │     │ content     │     │ description │
│ password    │     │ author_id   │     │ created_at  │
│ avatar      │     │ category_id │     │ updated_at  │
│ bio         │     │ status      │     └─────────────┘
│ role        │     │ created_at  │
│ status      │     │ updated_at  │     ┌─────────────┐
│ created_at  │     └─────────────┘     │   Comment   │
│ updated_at  │                          ├─────────────┤
└─────────────┘                          │ id          │
                                         │ content     │
                                         │ author_id   │
                                         │ article_id  │
                                         │ parent_id   │
                                         │ status      │
                                         │ created_at  │
                                         │ updated_at  │
                                         └─────────────┘
```

### 5.2 核心实体定义

#### 5.2.1 User 实体

```java
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String avatar;
    
    private String bio;
    
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;
    
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### 5.2.2 Article 实体

```java
@Entity
@Table(name = "articles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    @Enumerated(EnumType.STRING)
    private ArticleStatus status = ArticleStatus.DRAFT;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### 5.2.3 Category 实体

```java
@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    private String description;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

#### 5.2.4 Comment 实体

```java
@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @ManyToOne
    @JoinColumn(name = "article_id", nullable = false)
    private Article article;
    
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Comment parent;
    
    @Enumerated(EnumType.STRING)
    private CommentStatus status = CommentStatus.PENDING;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

## 6. API 设计

### 6.1 API 设计原则

- 遵循 RESTful 设计风格
- 使用 HTTP 方法表示操作类型
- 使用状态码表示操作结果
- 统一的响应格式
- 版本化 API

### 6.2 统一响应格式

```json
{
  "code": 200,
  "message": "Success",
  "data": { /* 响应数据 */ },
  "timestamp": "2025-11-28T10:00:00Z"
}
```

### 6.3 核心 API 端点

#### 6.3.1 用户管理 API

| API 端点 | 方法 | 认证 | 用途 |
|----------|------|------|------|
| /api/v1/auth/register | POST | 否 | 用户注册 |
| /api/v1/auth/login | POST | 否 | 用户登录 |
| /api/v1/auth/refresh | POST | 是 | 刷新令牌 |
| /api/v1/auth/password-reset | POST | 否 | 密码重置请求 |
| /api/v1/auth/password-reset/{token} | PUT | 否 | 重置密码 |
| /api/v1/users/me | GET | 是 | 获取当前用户信息 |
| /api/v1/users/me | PUT | 是 | 更新用户信息 |
| /api/v1/users/me/avatar | POST | 是 | 更新用户头像 |

#### 6.3.2 文章管理 API

| API 端点 | 方法 | 认证 | 用途 |
|----------|------|------|------|
| /api/v1/articles | GET | 否 | 获取文章列表 |
| /api/v1/articles/{id} | GET | 否 | 获取文章详情 |
| /api/v1/articles | POST | 是 | 创建文章 |
| /api/v1/articles/{id} | PUT | 是 | 更新文章 |
| /api/v1/articles/{id} | DELETE | 是 | 删除文章 |
| /api/v1/articles/{id}/status | PUT | 是 | 更新文章状态 |
| /api/v1/articles/categories/{categoryId} | GET | 否 | 按分类获取文章 |
| /api/v1/articles/search | GET | 否 | 搜索文章 |

#### 6.3.3 分类管理 API

| API 端点 | 方法 | 认证 | 用途 |
|----------|------|------|------|
| /api/v1/categories | GET | 否 | 获取分类列表 |
| /api/v1/categories/{id} | GET | 否 | 获取分类详情 |
| /api/v1/categories | POST | 是 | 创建分类 |
| /api/v1/categories/{id} | PUT | 是 | 更新分类 |
| /api/v1/categories/{id} | DELETE | 是 | 删除分类 |

#### 6.3.4 评论管理 API

| API 端点 | 方法 | 认证 | 用途 |
|----------|------|------|------|
| /api/v1/articles/{articleId}/comments | GET | 否 | 获取文章评论 |
| /api/v1/articles/{articleId}/comments | POST | 是 | 添加评论 |
| /api/v1/comments/{id} | PUT | 是 | 更新评论 |
| /api/v1/comments/{id} | DELETE | 是 | 删除评论 |
| /api/v1/comments/{id}/status | PUT | 是 | 更新评论状态 |

#### 6.3.5 管理后台 API

| API 端点 | 方法 | 认证 | 用途 |
|----------|------|------|------|
| /api/v1/admin/users | GET | 是 | 获取用户列表 |
| /api/v1/admin/users/{id} | GET | 是 | 获取用户详情 |
| /api/v1/admin/users/{id} | PUT | 是 | 更新用户信息 |
| /api/v1/admin/users/{id}/status | PUT | 是 | 更新用户状态 |
| /api/v1/admin/articles | GET | 是 | 获取所有文章 |
| /api/v1/admin/comments | GET | 是 | 获取所有评论 |
| /api/v1/admin/comments/pending | GET | 是 | 获取待审核评论 |

## 7. 安全设计

### 7.1 认证机制

- 使用 JWT (JSON Web Token) 进行无状态认证
- 实现 Access Token 和 Refresh Token 机制
- Access Token 有效期：15 分钟
- Refresh Token 有效期：7 天
- 使用 BCrypt 进行密码哈希

### 7.2 授权机制

- 基于角色的访问控制 (RBAC)
- 定义三种角色：
  - ADMIN：拥有所有权限
  - AUTHOR：可以创建和管理自己的文章
  - USER：可以阅读文章和发表评论
- 使用 Spring Security 实现细粒度的权限控制

### 7.3 安全防护

- 实现 CSRF 保护
- 输入验证和 sanitization，防止 XSS 和 SQL 注入
- 密码强度验证
- 敏感数据加密存储
- 安全的错误处理，避免泄露敏感信息
- 限制 API 请求频率，防止暴力攻击

## 8. 实现模式

### 8.1 命名模式

- 数据库表名：使用复数形式，下划线分隔（如 `users`, `articles`）
- 实体类名：使用单数形式，驼峰命名（如 `User`, `Article`）
- 字段名：使用驼峰命名（如 `firstName`, `createdAt`）
- API 端点：使用小写，连字符分隔（如 `/api/v1/articles`）
- 常量：使用大写，下划线分隔（如 `MAX_PAGE_SIZE`）

### 8.2 代码结构模式

- 遵循分层架构：Controller → Service → Repository
- 每个实体对应一个 Controller、Service 和 Repository
- 使用 DTO 进行数据传输，避免直接暴露实体
- 实现统一的异常处理
- 使用 Lombok 减少样板代码

### 8.3 错误处理模式

- 定义统一的异常类型
- 实现全局异常处理器
- 返回统一的错误响应格式
- 记录详细的错误日志

### 8.4 日志记录模式

- 使用 SLF4J + Logback 进行日志记录
- 定义不同的日志级别：DEBUG, INFO, WARN, ERROR
- 记录请求和响应日志
- 记录关键业务操作日志
- 敏感数据脱敏处理

## 9. 部署架构

### 9.1 开发环境

- 后端：本地 Spring Boot 应用（端口 8080）
- 前端：本地 Vite 开发服务器（端口 5173）
- 数据库：本地 MySQL 实例
- 邮件服务器：使用 Mailtrap 进行测试

### 9.2 生产环境

```
┌───────────────────────────────────────────────────────────────────┐
│                          负载均衡器 (Nginx)                       │
├───────────────────────────────────────────────────────────────────┤
│                          前端应用 (Vue.js)                        │
│                          部署在 Nginx 上                          │
├───────────────────────────────────────────────────────────────────┤
│                          后端应用 (Spring Boot)                 │
│                          部署在 Docker 容器中                     │
├───────────────────────────────────────────────────────────────────┤
│                          数据库 (MySQL)                          │
│                          主从复制配置                            │
├───────────────────────────────────────────────────────────────────┤
│                          缓存 (Redis)                            │
│                          用于缓存热点数据                        │
├───────────────────────────────────────────────────────────────────┤
│                          对象存储 (MinIO/AWS S3)                 │
│                          用于存储用户头像和文章图片              │
└───────────────────────────────────────────────────────────────────┘
```

### 9.3 CI/CD 流程

1. 代码提交到 Git 仓库
2. GitHub Actions 自动触发构建
3. 运行单元测试和集成测试
4. 构建 Docker 镜像
5. 推送到 Docker Hub
6. 部署到测试环境
7. 运行端到端测试
8. 手动批准后部署到生产环境

## 10. 性能优化

### 10.1 后端优化

- 使用 Spring Cache 缓存热点数据
- 实现分页查询，避免一次性加载大量数据
- 优化数据库查询，添加适当的索引
- 使用异步处理非关键任务
- 实现延迟加载，避免不必要的关联查询

### 10.2 前端优化

- 使用 Vue 的异步组件和代码分割
- 优化图片加载，使用适当的格式和尺寸
- 实现路由懒加载
- 使用缓存减少 API 请求
- 优化组件渲染性能

## 11. 监控和日志

### 11.1 后端监控

- 使用 Spring Boot Actuator 暴露应用指标
- 集成 Prometheus 和 Grafana 进行监控
- 实现健康检查端点
- 记录应用性能指标

### 11.2 日志管理

- 使用 ELK Stack (Elasticsearch, Logstash, Kibana) 进行日志收集和分析
- 实现日志轮转和归档
- 设置适当的日志保留策略

## 12. 测试策略

### 12.1 后端测试

- 单元测试：使用 JUnit 5 和 Mockito
- 集成测试：使用 Testcontainers 测试数据库交互
- API 测试：使用 Spring Boot Test 和 REST Assured
- 安全测试：测试认证和授权机制

### 12.2 前端测试

- 单元测试：使用 Vitest 和 Vue Test Utils
- 组件测试：测试组件渲染和交互
- 端到端测试：使用 Playwright 测试完整的用户流程

## 13. 项目管理

### 13.1 开发流程

- 采用敏捷开发方法
- 两周一个 sprint
- 每日站会
- Sprint 计划、评审和回顾会议
- 使用 Jira 进行任务管理

### 13.2 代码质量

- 使用 SonarQube 进行代码质量检查
- 实施代码审查机制
- 遵循代码风格指南
- 定期进行代码重构

## 14. 总结

本架构文档为 my-tech-blog-copy 项目提供了完整的技术指导，包括技术栈选择、系统架构、API 设计、安全设计、部署架构等关键方面。架构采用分层设计，确保系统的可扩展性、安全性和可维护性。文档中的设计决策基于项目需求和最佳实践，为开发团队提供了清晰的技术路线图。

随着项目的发展，架构可能需要根据实际情况进行调整和优化。建议定期 review 架构设计，确保其与项目需求保持一致。