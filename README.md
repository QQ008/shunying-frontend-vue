# 瞬影-前端vue

# 目录结构说明

shunying-fronted-vue/
├── .cursor/                  # Cursor 编辑器相关配置
├── .vscode/                 # VSCode 编辑器配置（如插件推荐等）
│   ├── extensions.json
│   └── settings.json
├── node_modules/            # 项目依赖模块目录
├── public/                  # 公共静态资源目录
│   ├── images/
│   └── logo.ico             # 网站 favicon 图标
├── src/                     # 项目源码目录
│   ├── api/                 # 与后端接口相关的封装模块
│   ├── assets/              # 静态资源（如图片、样式等）
│   ├── components/          # 公共组件目录
│   ├── composables/         # 自定义组合式 API（Vue 3 Composition API）
│   ├── router/              # 路由配置
│   ├── stores/              # Pinia 状态管理目录
│   ├── views/               # 页面级组件目录
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口文件
├── index.html               # 入口 HTML 文件
├── .gitattributes           # Git 属性配置
├── .gitignore               # Git 忽略配置
├── package.json             # 项目依赖与脚本配置
├── package-lock.json        # 锁定的依赖版本
├── tsconfig.json            # TypeScript 配置入口
├── tsconfig.app.json        # App 项目的 ts 配置
├── tsconfig.node.json       # Node 环境的 ts 配置
├── tsconfig.vitest.json     # Vitest 测试相关的 ts 配置
├── vitest.config.ts         # Vitest 测试配置
├── vite.config.ts           # Vite 打包与开发配置
├── env.d.ts                 # 环境变量类型声明
├── shims-vue.d.ts           # Vue 模块声明（用于支持 *.vue 文件）
├── .editorconfig            # 编辑器统一风格配置
└── README.md                # 项目说明文档（本文件）




# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
