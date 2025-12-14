# 技术博客后端API接口文档

## 1. 文档概述

### 1.1 文档目的
本文档定义了技术博客后端API的接口规范，包括接口URL、请求方法、请求参数、响应格式和错误码等，为前后端开发提供统一的接口标准。

### 1.2 技术栈
- **后端框架**：Spring Boot 3.0+
- **数据库**：MySQL 8.0+
- **ORM框架**：MyBatis Plus 3.5+
- **API风格**：RESTful

### 1.3 基础URL
```
https://api.example.com/v1
```

### 1.4 响应格式

#### 1.4.1 成功响应
```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

#### 1.4.2 失败响应
```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```

## 2. 认证与授权

### 2.1 JWT Token获取
```
POST /auth/login
```

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expireTime": 1733644800000,
    "userInfo": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "role": "admin"
    }
  }
}
```

### 2.2 Token刷新
```
POST /auth/refresh
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expireTime": 1733644800000
  }
}
```

## 3. 文章管理

### 3.1 获取文章列表
```
GET /articles
```

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | Integer | 否 | 页码，默认1 |
| size | Integer | 否 | 每页大小，默认10 |
| categoryId | Long | 否 | 分类ID |
| tagId | Long | 否 | 标签ID |
| keyword | String | 否 | 搜索关键词 |
| status | String | 否 | 文章状态（draft/published） |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "pages": 10,
    "current": 1,
    "records": [
      {
        "id": 1,
        "title": "Spring Boot入门教程",
        "summary": "Spring Boot是一个快速开发框架...",
        "coverImage": "https://example.com/image.jpg",
        "category": {
          "id": 1,
          "name": "Java"
        },
        "tags": [
          {
            "id": 1,
            "name": "Spring Boot"
          }
        ],
        "viewCount": 1000,
        "commentCount": 50,
        "likeCount": 200,
        "publishTime": "2025-12-01T10:00:00",
        "author": {
          "id": 1,
          "nickname": "管理员"
        }
      }
    ]
  }
}
```

### 3.2 获取文章详情
```
GET /articles/{id}
```

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 文章ID |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "Spring Boot入门教程",
    "content": "# Spring Boot入门教程\n...",
    "summary": "Spring Boot是一个快速开发框架...",
    "coverImage": "https://example.com/image.jpg",
    "category": {
      "id": 1,
      "name": "Java"
    },
    "tags": [
      {
        "id": 1,
        "name": "Spring Boot"
      }
    ],
    "viewCount": 1000,
    "commentCount": 50,
    "likeCount": 200,
    "publishTime": "2025-12-01T10:00:00",
    "updateTime": "2025-12-02T15:30:00",
    "author": {
      "id": 1,
      "nickname": "管理员",
      "avatar": "https://example.com/avatar.jpg"
    },
    "status": "published"
  }
}
```

### 3.3 创建文章
```
POST /articles
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**请求体**：
```json
{
  "title": "Spring Boot入门教程",
  "content": "# Spring Boot入门教程\n...",
  "summary": "Spring Boot是一个快速开发框架...",
  "coverImage": "https://example.com/image.jpg",
  "categoryId": 1,
  "tagIds": [1, 2],
  "status": "draft",
  "isTop": false,
  "isFeatured": false
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1
  }
}
```

### 3.4 更新文章
```
PUT /articles/{id}
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**请求体**：
```json
{
  "title": "Spring Boot入门教程（更新版）",
  "content": "# Spring Boot入门教程\n...",
  "summary": "Spring Boot是一个快速开发框架...",
  "coverImage": "https://example.com/image.jpg",
  "categoryId": 1,
  "tagIds": [1, 2, 3],
  "status": "published",
  "isTop": true,
  "isFeatured": true
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 3.5 删除文章
```
DELETE /articles/{id}
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 3.6 文章点赞
```
POST /articles/{id}/like
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "likeCount": 201
  }
}
```

## 4. 分类管理

### 4.1 获取分类列表
```
GET /categories
```

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | Integer | 否 | 页码，默认1 |
| size | Integer | 否 | 每页大小，默认10 |
| keyword | String | 否 | 搜索关键词 |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 20,
    "pages": 2,
    "current": 1,
    "records": [
      {
        "id": 1,
        "name": "Java",
        "slug": "java",
        "articleCount": 50,
        "createTime": "2025-12-01T10:00:00"
      }
    ]
  }
}
```

### 4.2 创建分类
```
POST /categories
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**请求体**：
```json
{
  "name": "Spring Boot",
  "slug": "spring-boot",
  "description": "Spring Boot相关文章"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 2
  }
}
```

### 4.3 更新分类
```
PUT /categories/{id}
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**请求体**：
```json
{
  "name": "Spring Boot框架",
  "slug": "spring-boot",
  "description": "Spring Boot框架相关文章"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 4.4 删除分类
```
DELETE /categories/{id}
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 5. 标签管理

### 5.1 获取标签列表
```
GET /tags
```

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | Integer | 否 | 页码，默认1 |
| size | Integer | 否 | 每页大小，默认10 |
| keyword | String | 否 | 搜索关键词 |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 50,
    "pages": 5,
    "current": 1,
    "records": [
      {
        "id": 1,
        "name": "Spring Boot",
        "slug": "spring-boot",
        "articleCount": 20,
        "createTime": "2025-12-01T10:00:00"
      }
    ]
  }
}
```

### 5.2 创建标签
```
POST /tags
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**请求体**：
```json
{
  "name": "Spring Cloud",
  "slug": "spring-cloud",
  "description": "Spring Cloud相关文章"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 2
  }
}
```

### 5.3 更新标签
```
PUT /tags/{id}
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**请求体**：
```json
{
  "name": "Spring Cloud Alibaba",
  "slug": "spring-cloud-alibaba",
  "description": "Spring Cloud Alibaba相关文章"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 5.4 删除标签
```
DELETE /tags/{id}
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 6. 评论管理

### 6.1 获取文章评论列表
```
GET /articles/{articleId}/comments
```

**请求参数**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| articleId | Long | 是 | 文章ID |
| page | Integer | 否 | 页码，默认1 |
| size | Integer | 否 | 每页大小，默认10 |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 50,
    "pages": 5,
    "current": 1,
    "records": [
      {
        "id": 1,
        "content": "这篇文章写得很好！",
        "createTime": "2025-12-01T10:00:00",
        "user": {
          "id": 2,
          "nickname": "读者",
          "avatar": "https://example.com/avatar.jpg"
        },
        "replies": [
          {
            "id": 2,
            "content": "感谢支持！",
            "createTime": "2025-12-01T11:00:00",
            "user": {
              "id": 1,
              "nickname": "管理员",
              "avatar": "https://example.com/avatar.jpg"
            }
          }
        ]
      }
    ]
  }
}
```

### 6.2 创建评论
```
POST /comments
```

**请求体**：
```json
{
  "articleId": 1,
  "content": "这篇文章写得很好！",
  "parentId": null
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 3
  }
}
```

### 6.3 删除评论
```
DELETE /comments/{id}
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 7. 用户管理

### 7.1 获取用户信息
```
GET /users/me
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": "https://example.com/avatar.jpg",
    "email": "admin@example.com",
    "bio": "技术博客管理员",
    "role": "admin",
    "createTime": "2025-12-01T10:00:00"
  }
}
```

### 7.2 更新用户信息
```
PUT /users/me
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**请求体**：
```json
{
  "nickname": "管理员",
  "avatar": "https://example.com/avatar.jpg",
  "email": "admin@example.com",
  "bio": "技术博客管理员"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 7.3 修改密码
```
PUT /users/me/password
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**请求体**：
```json
{
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

## 8. 统计信息

### 8.1 获取仪表盘统计
```
GET /stats/dashboard
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "totalArticles": 100,
    "publishedArticles": 80,
    "draftArticles": 20,
    "totalCategories": 20,
    "totalTags": 50,
    "totalComments": 500,
    "totalUsers": 1000,
    "todayViews": 500,
    "thisWeekViews": 3000,
    "thisMonthViews": 10000
  }
}
```

### 8.2 获取文章访问统计
```
GET /stats/articles/{id}
```

**请求头**：
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Authorization | String | 是 | Bearer {token} |

**响应示例**：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "articleId": 1,
    "totalViews": 1000,
    "todayViews": 50,
    "thisWeekViews": 300,
    "thisMonthViews": 1000,
    "viewTrend": [
      {
        "date": "2025-12-01",
        "views": 100
      },
      {
        "date": "2025-12-02",
        "views": 150
      }
    ]
  }
}
```

## 9. 错误码说明

| 错误码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 501 | 未实现 |
| 502 | 网关错误 |
| 503 | 服务不可用 |
| 504 | 网关超时 |

## 10. 附录

### 10.1 数据类型说明
| 类型 | 描述 |
|------|------|
| String | 字符串类型 |
| Integer | 整数类型 |
| Long | 长整数类型 |
| Boolean | 布尔类型 |
| Date | 日期类型，格式：yyyy-MM-dd HH:mm:ss |
| DateTime | 日期时间类型，格式：yyyy-MM-dd'T'HH:mm:ss |

### 10.2 字段说明
| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | Long | 主键ID |
| createTime | DateTime | 创建时间 |
| updateTime | DateTime | 更新时间 |
| isDeleted | Boolean | 是否删除 |

---

**文档版本**：1.0
**创建日期**：2025-12-08
**作者**：后端开发团队
**审批状态**：待审批