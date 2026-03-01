# 任务拆解

## 1. 项目脚手架

- [x] SvelteKit + Bun 项目初始化
- [x] SCSS 配置 (svelte-preprocess)
- [x] SQLite 连接 (better-sqlite3)
- [x] 目录结构搭建 (lib/server, lib/components, seed/)
- [x] Design tokens SCSS 变量文件

## 2. 数据层

- [x] SQLite schema 定义 (questions, cards, review_logs)
- [x] 数据库初始化脚本 (建表)
- [x] Markdown seed 解析器 (frontmatter + 问题/答案分割)
- [x] Seed 导入脚本 (Markdown → SQLite)
- [x] 写 3-5 道示例题目用于开发调试

## 3. SM-2 引擎

- [x] SM-2 核心算法实现 (rating → interval/EF/repetitions 计算)
- [x] 获取今日待复习列表 (due_date <= today)
- [x] 记录评��并更新 card 状态
- [x] 新卡片初始化逻辑 (首次学习序列)

## 4. Markdown 渲染

- [x] marked + shiki 集成 (Go 代码高亮)
- [x] Mermaid 图表渲染
- [x] 渲染组件封装 (MarkdownRenderer.svelte)

## 5. 背题页面 (/study)

- [x] 闪卡组件 (问题面/答案面，翻转动画)
- [x] 评分按钮组 (Again/Hard/Good/Easy + 预计间隔显示)
- [x] 键盘快捷键 (Space 翻转, 1-4 评分)
- [x] 进度条
- [x] 标签筛选栏 (query params)
- [x] 全部完成状态
- [x] SvelteKit load function + form action

## 6. 首页 (/)

- [x] 今日待复习数量展示
- [x] 快速开始按钮
- [x] 分类统计概览 (Go / 架构各多少题待复习)

## 7. 题库页面 (/questions)

- [x] 题目列表展示
- [x] 分类筛选 (Go / 架构)
- [x] 标签筛选 (chips 多选)
- [x] 题目详情展开/跳转

## 8. 响应式 + 全局样式

- [x] 全局 SCSS reset + typography
- [x] 桌面布局
- [x] 移动端适配 (@media breakpoint)
- [x] 导航栏 (桌面 + 移动端)
