## 1. 项目脚手架

- [ ] 1.1 初始化 SvelteKit 项目（`bun create svelte@latest .`），选择 TypeScript + SCSS
- [ ] 1.2 安装 UI 框架：`bun add -d @skeletonlabs/skeleton @tailwindcss/vite tailwindcss`
- [ ] 1.3 配置 `vite.config.ts`：注册 `tailwindcss()` 插件（必须位于 `sveltekit()` 之前）
- [ ] 1.4 配置 `src/app.css`：导入 `@skeletonlabs/skeleton`、cerberus 基础主题、`tailwindcss`
- [ ] 1.5 创建 `src/styles/theme-keynote.css`：用 oklch 颜色覆盖 primary/surface/error/success/warning，映射 GitHub Primer 色调
- [ ] 1.6 在 `src/app.html` 的 `<html>` 上挂载 `data-theme="keynote"`，内联防 FOUC 脚本
- [ ] 1.7 安装其他依赖：`drizzle-orm`、`drizzle-kit`、`shiki`（代码高亮）
- [ ] 1.8 配置 `drizzle.config.ts`，指定 `bun:sqlite` 驱动和 `keynote.db` 路径
- [ ] 1.4 编写 `src/lib/db/schema.ts`：定义所有表结构（topics / questions / question_version_notes / tags / question_tags / quiz_records / settings）
- [ ] 1.5 生成并执行初始 migration，验证所有表创建成功
- [ ] 1.6 编写 `src/lib/db/index.ts`：模块级 SQLite 单例，供 Server Routes 使用
- [ ] 1.7 编写数据库种子脚本 `src/lib/db/seed.ts`：插入 Golang Topic 初始数据及常用标签（并发、接口、goroutine、channel、error、泛型等）
- [ ] 1.8 在应用启动时（`hooks.server.ts`）执行 migration 和种子数据检查

## 2. 全局布局与主题

- [ ] 2.1 创建 `src/styles/_motion.scss`：翻牌动画变量、`prefers-reduced-motion` 兜底
- [ ] 2.2 创建 `src/styles/_typography.scss`：`.keynote-prose` Markdown 渲染区域样式（代码块、行内代码）
- [ ] 2.3 实现主题切换逻辑：localStorage 读取 + `document.documentElement.classList` 切换 dark
- [ ] 2.4 创建 `src/routes/+layout.svelte`：Skeleton Topbar（应用名、主题切换按钮）+ Skeleton Drawer 侧边栏（Topic 列表，`preset-tonal-primary` 高亮当前路由）
- [ ] 2.5 实现响应式布局：移动端侧边栏使用 Skeleton Drawer 组件
- [ ] 2.6 创建 `src/lib/components/` 通用组件：`VersionBadge.svelte`（Skeleton badge + preset 映射）、`DifficultyBadge.svelte`、`MarkdownRenderer.svelte`（含 shiki 高亮）

## 3. Topic 与标签体系

- [ ] 3.1 创建 `GET /api/topics` Server Route：返回所有 Topic 列表（含题目数量）
- [ ] 3.2 创建 `GET /api/tags?topicId=` Server Route：按 Topic 返回标签列表
- [ ] 3.3 实现规则引擎 `src/lib/tag-engine.ts`：Golang 关键词字典（goroutine/channel/interface/defer/panic 等）→ 候选标签映射
- [ ] 3.4 实现标签推荐 API：`POST /api/tags/suggest`，接收文本内容，返回候选标签列表
- [ ] 3.5 创建标签管理 UI 组件 `TagInput.svelte`：展示已选标签、候选推荐标签、手动输入新标签

## 4. 题目管理

- [ ] 4.1 创建 `GET /api/questions` Server Route：支持 topicId、tagId、difficulty、keyword 查询参数
- [ ] 4.2 创建 `POST /api/questions` Server Route：新建题目，校验必填字段
- [ ] 4.3 创建 `GET /api/questions/[id]` Server Route：返回题目详情（含版本注记、标签）
- [ ] 4.4 创建 `PUT /api/questions/[id]` Server Route：更新题目
- [ ] 4.5 创建 `DELETE /api/questions/[id]` Server Route：删除题目及关联数据
- [ ] 4.6 实现版本注记 CRUD API：`POST/DELETE /api/questions/[id]/version-notes`
- [ ] 4.7 创建题库列表页 `src/routes/questions/+page.svelte`：列表展示、搜索框、难度/标签筛选
- [ ] 4.8 创建新建题目页 `src/routes/questions/new/+page.svelte`：Markdown 编辑器（分栏预览）、版本注记区、TagInput 组件
- [ ] 4.9 创建题目详情/编辑页 `src/routes/questions/[id]/+page.svelte`：展示完整内容、版本注记徽章、编辑/删除按钮
- [ ] 4.10 实现版本注记 UI：`VersionNoteList.svelte` 组件，breaking=红、fixed=绿、added=蓝、deprecated=灰

## 5. 刷题会话

- [ ] 5.1 创建 `POST /api/quiz/start` Server Route：根据配置抽题，返回题目 ID 列表，存入 session store
- [ ] 5.2 创建 `POST /api/quiz/record` Server Route：写入单条 `quiz_records`（question_id、result、time_spent_ms）
- [ ] 5.3 创建刷题配置页 `src/routes/quiz/+page.svelte`：题数、答题模式（随机/顺序，间隔重复禁用+提示）、难度过滤、标签过滤
- [ ] 5.4 创建答题页 `src/routes/quiz/session/+page.svelte`：翻牌交互（题干显示 → 点击翻开 → 展示答案/解释/版本注记 → 标记按钮）
- [ ] 5.5 实现答题进度条组件 `QuizProgress.svelte`：显示"第 N / M 题"和进度条
- [ ] 5.6 实现翻牌动画（CSS 3D transform）
- [ ] 5.7 会话完成后自动跳转至结果页，传递本次会话统计数据

## 6. 记录与统计

- [ ] 6.1 创建 `GET /api/records` Server Route：返回历史会话列表（按 session 聚合 quiz_records）
- [ ] 6.2 创建 `GET /api/records/wrong` Server Route：返回全局错题集，按错误频次降序
- [ ] 6.3 创建结果页 `src/routes/quiz/session/result/+page.svelte`：正确/错误/跳过统计、错题列表、重刷错题按钮
- [ ] 6.4 创建历史记录页 `src/routes/records/+page.svelte`：会话列表、Topic 筛选、空状态处理
- [ ] 6.5 实现准确率趋势 SVG 折线图组件 `AccuracyChart.svelte`（原生 SVG，无依赖）
- [ ] 6.6 实现"已掌握"判断逻辑：错题连续答对 3 次后显示"已掌握"徽章

## 7. 全局配置

- [ ] 7.1 创建 `GET /api/settings` 和 `PUT /api/settings` Server Route
- [ ] 7.2 创建设置页 `src/routes/settings/+page.svelte`：答题模式、默认题数、默认 Topic 选择器
- [ ] 7.3 实现设置读取工具函数 `src/lib/settings.ts`：含默认值兜底逻辑

## 8. Dashboard 首页

- [ ] 8.1 创建首页 `src/routes/+page.svelte`：Topic 总览卡片（题目数、已刷数、准确率）
- [ ] 8.2 显示热门标签（按出现频率排序）
- [ ] 8.3 显示最近错题（最近 5 条，附链接）
- [ ] 8.4 显示今日打卡状态（今天是否已刷题）

## 9. 收尾与验证

- [ ] 9.1 端到端流程验证：录入 3 道 Golang 题 → 开始刷题 → 完成会话 → 查看记录
- [ ] 9.2 深色模式全页面检查，确保无颜色遗漏
- [ ] 9.3 移动端响应式检查（Chrome DevTools）
- [ ] 9.4 执行 `bun run build` 确认生产构建无报错
- [ ] 9.5 更新 README.md：添加项目简介、技术栈、启动方式
