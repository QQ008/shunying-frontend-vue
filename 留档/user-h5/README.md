# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).


# 瞬影前端项目目录说明

## 项目概述
瞬影前端项目是一个基于Vue 3 + TypeScript开发的移动端H5应用，主要为骑行爱好者和摄影师提供照片查找、购买等服务。项目使用Vant UI组件库构建界面，采用模块化的架构设计。

## 目录结构说明

user-h5/src/
├─ main.ts              # 应用程序入口文件，初始化Vue实例及全局配置
├─ App.vue              # 根组件，所有页面的容器
├─ assets/              # 静态资源目录
│  ├─ styles/           # 样式相关文件
│  └─ images/           # 图片资源
├─ components/          # 通用组件
│  ├─ layout/           # 布局相关组件（如TabBar导航栏）
│  └─ [其他业务组件]
├─ pages/               # 页面组件，对应路由
│  ├─ HomePage.vue      # 首页
│  ├─ SearchPage.vue    # 查找页
│  ├─ ExplorePage.vue   # 探索页
│  ├─ ProfilePage.vue   # 我的页面
│  └─ [其他页面组件]
├─ layouts/             # 布局模板
│  ├─ TabLayout.vue     # 带底部标签栏的布局
│  └─ DefaultLayout.vue # 默认布局（二级页面使用）
├─ router/              # 路由配置
│  └─ index.ts          # 路由定义和导航守卫
├─ store/               # 状态管理
│  ├─ index.ts          # Store入口
│  └─ modules/          # 按功能模块拆分的状态
│     ├─ user.ts        # 用户相关状态
│     ├─ cart.ts        # 购物车相关状态
│     └─ search.ts      # 搜索相关状态
├─ api/                 # API接口封装
│  ├─ image.ts          # 图片相关接口
│  └─ common.ts         # 通用接口
├─ utils/               # 工具函数和服务
│  ├─ navigation.ts     # 导航服务
│  └─ [其他工具]
├─ vite-env.d.ts        # TypeScript环境声明文件
└─ style.css            # 全局样式


## 模块功能说明

### 核心文件
- main.ts: 应用入口，负责Vue实例初始化、插件注册和全局配置
- App.vue: 根组件，包含全局布局和路由出口

### 页面与路由
- pages/: 存放所有页面组件，每个文件对应一个路由
- router/: 定义应用的路由和导航守卫，处理页面跳转

### 组件系统
- components/: 可复用的业务组件和UI组件
- layout/: 包含TabBar等布局相关组件
- layouts/: 页面布局模板，定义不同类型页面的通用结构

### 状态管理
- store/: 使用Pinia管理应用状态
- modules/: 按功能模块拆分的状态管理
- user.ts: 管理用户信息、登录状态
- cart.ts: 管理购物车数据
- search.ts: 管理搜索条件和结果

### 数据与服务
- api/: 封装与后端的接口交互
- image.ts: 图片查询、图片组详情等接口
- common.ts: 通用接口如登录、支付等
- utils/: 工具函数和服务
- navigation.ts: 统一的页面导航服务

### 静态资源
- assets/: 存放图片、样式等静态资源
- style.css: 全局样式定义