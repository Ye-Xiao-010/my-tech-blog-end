# 故事 6.2: 管理员内容管理

状态: drafted

## 故事

作为 博客管理员,
我希望 能够在后台管理系统中管理所有内容,
以便 监控和维护平台上的文章、分类和评论。

## 验收标准

1. 管理员可以查看所有文章列表，包括标题、作者、发布时间、状态
2. 管理员可以搜索和筛选文章
3. 管理员可以发布、编辑、删除任何文章
4. 管理员可以审核、批准或拒绝评论
5. 管理员可以管理分类（创建、编辑、删除）
6. 管理员可以查看内容统计数据

## 任务/子任务

- [ ] 设计管理员内容管理界面 (AC: 1, 2, 3, 4, 5, 6)
  - [ ] 创建文章管理页面
  - [ ] 创建评论管理页面
  - [ ] 创建分类管理页面
  - [ ] 实现搜索和筛选功能
  - [ ] 实现统计数据展示
- [ ] 实现内容管理API (AC: 1, 2, 3, 4, 5, 6)
  - [ ] 扩展ArticleController.java，添加管理员相关接口
  - [ ] 扩展CommentController.java，添加评论审核接口
  - [ ] 扩展CategoryController.java，完善分类管理接口
  - [ ] 实现内容统计API
- [ ] 实现前端内容管理功能 (AC: 1, 2, 3, 4, 5, 6)
  - [ ] 创建文章管理组件
  - [ ] 创建评论管理组件
  - [ ] 创建分类管理组件
  - [ ] 实现内容统计展示
- [ ] 编写测试用例 (AC: 1, 2, 3, 4, 5, 6)
  - [ ] 编写API测试
  - [ ] 编写前端组件测试

## 开发笔记

- 相关架构模式和约束
  - 遵循现有的Spring Boot + Vue 3架构
  - 使用JWT进行身份验证和授权
  - 权限管理基于角色的访问控制(RBAC)
- 需要修改的源代码组件
  - 后端：ArticleController.java, ArticleService.java, ArticleServiceImpl.java, CommentController.java, CommentService.java, CommentServiceImpl.java, CategoryController.java, CategoryService.java, CategoryServiceImpl.java
  - 前端：src/views/admin/ 目录下创建内容管理相关组件
- 测试标准摘要
  - API测试覆盖率达到80%以上
  - 前端组件测试覆盖率达到70%以上

### 项目结构说明

- 与统一项目结构的对齐情况（路径、模块、命名）
  - 后端：遵循现有的MVC架构，在相应的控制器中添加管理员相关接口
  - 前端：在src/views/admin/目录下创建AdminArticles.vue, AdminComments.vue, AdminCategories.vue组件
- 检测到的冲突或差异（包含理由）
  - 无

### 参考资料

- 来源: docs/epics.md#史诗6：管理后台
- 来源: docs/prd.md#管理员功能

## 开发代理记录

### 上下文参考

<!-- 故事上下文XML的路径将由上下文工作流添加到此处 -->

### 使用的代理模型

{{agent_model_name_version}}

### 调试日志参考

### 完成笔记列表

### 文件列表