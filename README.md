# 淘宝仿制前端项目

这是一个基于 Vue 3 + TypeScript + Vite 构建的仿淘宝电商平台前端项目，作为课程期末项目，实现了完整的电商功能模块，包括用户端、商家端和管理端三个主要部分。

## 🌟 项目特点

- 使用 Vue 3 Composition API 和 `<script setup>` 语法糖
- 强类型支持：TypeScript 全面集成
- 构建工具：Vite 提供快速开发体验
- 组件库：Element Plus UI 框架
- 状态管理：Pinia
- 路由管理：Vue Router
- HTTP 客户端：Axios
- 样式预处理器：Sass

## 🏗️ 项目架构

### 技术栈

| 类别 | 技术 |
|------|------|
| 核心框架 | Vue 3 |
| 编程语言 | TypeScript |
| 构建工具 | Vite |
| 包管理器 | pnpm |
| UI 框架 | Element Plus |
| 状态管理 | Pinia |
| 路由 | Vue Router |
| HTTP 客户端 | Axios |
| 图表库 | ECharts |

### 功能模块

#### 用户端功能
- 用户注册/登录
- 商品浏览与搜索
- 商品详情查看
- 购物车管理
- 订单结算流程
- 个人中心（个人信息、收货地址、订单管理、安全设置）

#### 商家端功能
- 商家入驻申请
- 商品管理（发布、编辑、上下架）
- 订单管理
- 店铺设置
- 数据统计看板

#### 管理端功能
- 用户管理
- 商家管理
- 商品审核
- 订单监控
- 系统配置

### 目录结构

```
src/
├── api/              # API 接口封装
├── assets/           # 静态资源文件
├── components/       # 公共组件
├── router/           # 路由配置
├── stores/           # 状态管理
├── styles/           # 全局样式
├── types/            # TypeScript 类型定义
├── utils/            # 工具函数
└── views/            # 页面视图
    ├── admin/        # 管理端页面
    ├── auth/         # 认证相关页面
    ├── cart/         # 购物车页面
    ├── checkout/     # 结算页面
    ├── home/         # 首页
    ├── merchant/     # 商家端页面
    ├── product/      # 商品详情页面
    └── profile/      # 用户个人中心页面
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.x
- pnpm >= 8.x

### 安装依赖

```bash
pnpm install
```

### 开发环境启动

```bash
pnpm dev
```

### 生产环境构建

```bash
pnpm build
```


## 📁 核心配置说明

### 路由配置

项目采用 Vue Router 进行路由管理，通过路由守卫实现权限控制：
- 用户端路由：`/` 开头的路径
- 商家端路由：`/merchant` 开头的路径
- 管理端路由：`/admin` 开头的路径


## 🔐 权限设计

项目实现了多角色权限控制：
1. 普通用户：可浏览商品、下单购买、管理个人信息
2. 商家用户：可管理商品、处理订单、查看经营数据
3. 管理员：可管理系统用户、商家、商品审核等

## 🎨 UI 设计

- 使用 Element Plus 组件库提供丰富的 UI 组件
- 自定义主题样式，符合电商网站视觉风格
- 响应式设计，适配不同屏幕尺寸



## 🧪 测试

目前项目暂无单元测试，建议后续添加：
- Vitest 进行单元测试
- Cypress 进行 E2E 测试

## 📦 部署

构建后的静态文件可以部署到任意静态服务器上，如：
- Nginx
- Apache
- Vercel
- Netlify

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request 来改进项目。

## 📄 许可证

[MIT License](./LICENSE)