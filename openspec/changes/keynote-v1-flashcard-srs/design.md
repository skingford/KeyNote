# 设计文档

## 架构

```
SvelteKit (Bun)
├── Pages (.svelte + SCSS)
│   ├── /              → +page.svelte (首页)
│   ├── /study         → +page.svelte (背题)
│   └── /questions     → +page.svelte (题库)
├── Server Routes (+server.ts / +page.server.ts)
│   ├── load functions → 查询待复习/题目列表
│   └── form actions   → 提交评分结果
├── Lib
│   ├── server/db.ts       → drizzle-orm + SQLite
│   ├── server/srs.ts      → SM-2 算法
│   ├── server/seed.ts     → Markdown seed 导入
│   └── components/        → Svelte 组件
└── SQLite (data.db)
```

## 数据模型

### questions

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增 |
| title | TEXT NOT NULL | 题目标题 |
| content | TEXT NOT NULL | 问题内容 (Markdown) |
| answer | TEXT NOT NULL | 答案 (Markdown) |
| category | TEXT NOT NULL | 'go' \| 'architecture' |
| difficulty | INTEGER DEFAULT 1 | 1-3 |
| tags | TEXT DEFAULT '[]' | JSON array |
| created_at | DATETIME | 创建时间 |

### cards

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增 |
| question_id | INTEGER FK UNIQUE | 一题一卡 |
| ease_factor | REAL DEFAULT 2.5 | SM-2 难度因子 |
| interval | INTEGER DEFAULT 0 | 当前间隔 (天) |
| repetitions | INTEGER DEFAULT 0 | 连续正确次数 |
| due_date | TEXT | 下次复习日期 (YYYY-MM-DD) |
| updated_at | DATETIME | 最后更新 |

### review_logs

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INTEGER PK | 自增 |
| card_id | INTEGER FK | 关联卡片 |
| rating | INTEGER | 0-5 SM-2 评分 |
| reviewed_at | DATETIME | 复习时间 |

## SM-2 算法

四个评分按钮映射：

| 按钮 | SM-2 rating | 行为 |
|------|------------|------|
| Again | 0 | interval=1, repetitions=0, EF 下降 |
| Hard | 3 | interval×1.2, EF 微降 |
| Good | 4 | interval×EF, EF 不变 |
| Easy | 5 | interval×EF×1.3, EF 上升 |

- EF 下限 1.3，初始 2.5
- 首次学习序列：当日 → 1天 → 3天 → 按公式
- due_date = today + interval

## Markdown Seed 格式

```markdown
---
title: 题目标题
category: go
tags: [goroutine, 调度]
difficulty: 2
---

## 问题

问题内容，支持 Markdown。

## 答案

答案内容，支持代码块和 Mermaid。
```

目录结构：

```
seed/
├── go/
│   ├── basics/
│   ├── concurrency/
│   ├── runtime/
│   ├── stdlib/
│   └── engineering/
└── architecture/
    ├── principles/
    ├── distributed/
    ├── microservice/
    ├── middleware/
    ├── availability/
    └── system-design/
```

seed 脚本：解析 frontmatter + 按 `## 问题` / `## 答案` 分割内容 → 写入 questions 表 → 自动创建 cards 记录���

## SCSS 体系

```scss
// Design tokens
$primary: #3b82f6;
$surface: #1e1e2e;
$surface-hover: #2a2a3e;
$text: #cdd6f4;
$text-muted: #6c7086;
$success: #a6e3a1;
$warning: #f9e2af;
$danger: #f38ba8;

$radius-sm: 4px;
$radius-md: 8px;
$radius-lg: 16px;

$breakpoint-mobile: 768px;

// Responsive mixin
@mixin mobile {
  @media (max-width: $breakpoint-mobile) { @content; }
}
```

## 交互设计

### 背题流程

1. 进入 /study，加载今日到期的 cards (due_date <= today)
2. 支持标签筛选 (URL query params: ?tags=goroutine,channel)
3. 展示问题面 → 用户思考 → 点击/按空格翻转 → 展示答案面
4. 用户点击评分按钮 (或按键盘 1-4) → SM-2 计算 → 更新 card → 下一题
5. 进度条实时更新，全部完成显示总结

### 键盘快捷键

| 键 | 功能 |
|---|---|
| Space / Enter | 翻转卡片 |
| 1 | Again |
| 2 | Hard |
| 3 | Good |
| 4 | Easy |

### 标签筛选

- 题库页面：点击标签 chip 切换选中状态，组合过滤
- 背题页面：顶部标签栏快速筛选，筛选后只复习匹配题目
