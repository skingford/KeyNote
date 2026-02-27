## Why

个人技术学习缺乏结构化工具：笔记散落各处、刷题没有记录、知识点遗忘后难以回溯。KeyNote 作为个人技术学习平台，MVP 阶段先打通"录题 → 刷题 → 查看记录"的核心闭环，以 Golang 为内容起点，后续扩展至 Frontend、架构、Kafka、数据库、Rust 等。

## What Changes

- 新建 SvelteKit + Bun + SQLite 全栈项目脚手架
- 实现题目管理能力：手动创建/编辑题目，支持 Markdown 题干、答案、详细解释及版本注记（Go 版本差异说明）
- 实现刷题能力：可配置答题模式（随机/顺序/间隔重复预留），翻牌查看答案，标记正确/错误/跳过
- 实现记录查看能力：历史会话统计、准确率趋势、错题列表
- 实现 Topic 与标签体系：按技术分类组织题目，规则引擎自动推荐候选标签
- 实现全局配置：答题模式、每次题数、默认 Topic

## Capabilities

### New Capabilities

- `project-scaffold`: SvelteKit + Bun + SQLite + Drizzle ORM 项目初始化，包含目录结构、数据库 schema、基础路由
- `question-management`: 题目的增删改查，支持 Markdown 编辑、版本注记、难度/类型/标签属性
- `tag-system`: Topic 与 Tag 的层级管理，规则引擎基于关键词匹配自动推荐候选标签
- `quiz-session`: 可配置刷题会话，翻牌交互，答题结果标记，版本注记高亮展示
- `quiz-records`: 会话历史记录、准确率统计图表、错题列表与重刷入口
- `settings`: 全局配置（答题模式、默认题数、默认 Topic）

### Modified Capabilities

（无现有 spec，首次建立）

## Impact

- **新项目**：在 `/Users/kingford/workspace/github.com/KeyNote` 根目录初始化 SvelteKit 项目
- **依赖**：Bun runtime、SvelteKit、Drizzle ORM、`bun:sqlite`、SCSS
- **数据库**：本地 SQLite 文件（`keynote.db`），表：`topics`、`questions`、`question_version_notes`、`tags`、`question_tags`、`quiz_records`、`settings`
- **路由**：`/`、`/quiz`、`/quiz/session`、`/quiz/session/result`、`/questions`、`/questions/new`、`/questions/[id]`、`/records`、`/settings`
- **无破坏性变更**（全新项目）
