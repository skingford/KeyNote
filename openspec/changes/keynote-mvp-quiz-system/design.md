## Context

KeyNote 是一个个人技术学习平台，从零开始搭建。当前仓库仅有 README，无任何代码。MVP 阶段目标是打通"手动录题 → 刷题 → 查看记录"的核心闭环，以 Golang 为首个内容 Topic。

技术约束：
- 运行时：Bun（内置 SQLite、TypeScript 支持）
- 框架：SvelteKit（全栈，前后端一体，Server Routes 作为 API 层）
- 数据库：SQLite via `bun:sqlite`（本地自用，零配置）
- ORM：Drizzle ORM（类型安全，与 Bun SQLite 适配良好）
- 样式：SCSS（全局变量管理主题色、间距）
- 设计语言：参考 GitHub Primer —— 简洁、信息密度高、深色/浅色双模式

## Goals / Non-Goals

**Goals:**
- 完整可运行的 SvelteKit + Bun 项目脚手架，数据库 schema 就绪
- 手动录题：Markdown 编辑器支持题干/答案/解释/版本注记
- 刷题会话：翻牌交互，可配置模式（随机/顺序），结果标记
- 记录查看：准确率统计、错题列表
- Topic + Tag 体系，规则引擎推荐标签
- 响应式布局，支持深色模式

**Non-Goals:**
- GitHub 仓库导入（第二期）
- PDF 上传导入（第二期）
- 知识归档笔记模块（第二期）
- 间隔重复（Anki 算法）完整实现（仅预留 `next_review_at` 字段）
- 多用户 / 认证系统
- 云部署（本地自用优先）

## Decisions

### D1: 全栈选 SvelteKit，不单独起 Go 后端

**决定**：使用 SvelteKit Server Routes（`+server.ts`）作为 API 层，Bun 作为运行时。

**理由**：
- 避免维护两个进程（Go 后端 + 前端 devserver）
- `bun:sqlite` 性能对单用户场景绰绰有余（同步 API，无需异步处理）
- SvelteKit 的 Server Routes 天然支持 REST-like API，类型可共享
- 单 `bun run dev` 启动整个应用

**备选**：Go + Fiber 作为独立后端 → 复杂度高，对个人工具没有必要。

---

### D2: `bun:sqlite` 直接使用，Drizzle ORM 管理 Schema

**决定**：用 Drizzle ORM 定义 schema（TypeScript 类型安全），生成 migration SQL，通过 `bun:sqlite` 执行。

**理由**：
- Drizzle 是轻量级 ORM，不引入重量级连接池或 ORM 框架
- Schema 变更有 migration 文件追踪，方便后续云迁移
- `bun:sqlite` 同步 API 在 SvelteKit server context 中使用最简单

**备选**：直接写 SQL + better-sqlite3 → 失去类型安全和 migration 管理。

---

### D3: 题目与笔记分表存储，共享 Tag 体系

**决定**：`questions` 和 `notes`（第二期）分开建表，`tags` 和 `question_tags` / `note_tags` 统一管理。

**理由**：
- 题目有特定字段（`answer`、`type`、`difficulty`、版本注记），笔记是自由文本
- 分表结构清晰，不产生大量空字段
- Tag 体系统一，方便跨内容类型的标签过滤

---

### D4: 版本注记独立表，不嵌入 Markdown

**决定**：`question_version_notes` 独立表，字段：`version`、`change_type`（fixed/added/breaking/deprecated）、`note`。

**理由**：
- 版本注记可结构化展示（徽章颜色区分类型，breaking 用红色警示）
- 可按版本过滤查询
- 后续可扩展到 Rust edition、Node.js 版本等，同一结构复用

---

### D5: 规则引擎标签推荐，不接入外部 AI

**决定**：MVP 阶段用关键词字典匹配推荐候选标签（如检测到 "goroutine" → 推荐 [并发][goroutine]）。

**理由**：
- 离线可用，无 API 费用
- 对 Golang 技术词汇准确率已足够
- AI 增强作为后期可选扩展

---

### D6: 答题模式可配置，间隔重复预留字段

**决定**：`settings` 表存 `quiz_mode`（random/sequential/spaced），`quiz_records` 表预留 `next_review_at` 字段。MVP 只实现 random + sequential，spaced 模式显示"即将推出"。

**理由**：
- 数据结构提前兼容，后续加间隔重复算法无需改 schema
- 避免 MVP 过度复杂化

## Risks / Trade-offs

| 风险 | 缓解措施 |
|------|---------|
| SQLite 文件损坏（断电等）| Drizzle migration 可重建，建议定期备份 db 文件 |
| Markdown 编辑器 bundle 体积 | 使用轻量编辑器（如 CodeMirror 基础版），非所见即所得 |
| 规则引擎误推荐标签 | 候选标签仅为建议，用户手动确认后才写入 |
| bun:sqlite 在 SvelteKit SSR 中的单例管理 | 使用模块级单例 `db` 实例，避免重复初始化 |
| 深色模式闪烁（FOUC） | SvelteKit `app.html` 内联主题脚本，读取 localStorage 在首帧应用 |

## Migration Plan

1. 初始化 SvelteKit 项目（`bun create svelte`）
2. 配置 Drizzle ORM + `bun:sqlite`，执行初始 migration 建表
3. 种入 Golang Topic 初始数据
4. 按功能模块顺序开发：project-scaffold → tag-system → question-management → quiz-session → quiz-records → settings
5. 本地 `bun run build` + `bun run preview` 验证生产构建

云部署预留：SQLite 文件挂载持久化卷（Fly.io volumes 或 VPS 文件系统），无需改代码。

## Open Questions

- Markdown 编辑器选型：CodeMirror（轻量可控）vs. 其他？倾向 CodeMirror 基础版 + marked.js 预览。
- 准确率趋势图表库：Chart.js（重）vs. Svelte 原生 SVG 绘制（轻）？建议先用 SVG 手写折线图。
