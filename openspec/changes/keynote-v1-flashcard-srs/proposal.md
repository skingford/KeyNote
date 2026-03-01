# KeyNote v1 — 闪卡背题 + 间隔重复

## 概述

个人面试背题工具，第一期聚焦 Go 语言 + 架构设计，约 100 道题。通过闪卡翻转交互 + SM-2 间隔重复算法，科学安排每日复习。

## 目标

- 闪卡翻转背题，支持 Markdown 渲染（代码高亮 + Mermaid 图表）
- SM-2 间隔重复调度，自动计算每日待复习题目
- 标签筛选，按分类/标签组合过滤题目
- 桌面优先、手机兼容的响应式布局
- 题目以 Markdown 文件维护，脚本导入 SQLite

## 非目标

- 用户系统 / 多用户
- 题目在线编辑管理后台
- AI 辅助生成题目
- 移动端 App

## 技术栈

| 层 | 选型 |
|---|---|
| Runtime | Bun |
| Framework | SvelteKit (adapter-node) |
| Style | SCSS (手写，无 UI 库) |
| DB | SQLite (better-sqlite3) |
| ORM | drizzle-orm (方便后续切换数据库) |
| Markdown | marked + shiki (代码高亮) + mermaid |
| SRS | SM-2 算法手写实现 |
| Deploy | 单进程，Docker / VPS |

## 页面

| 路由 | 功能 |
|---|---|
| `/` | 首页：今日待复习数 + 快速开始 |
| `/study` | 背题主界面：闪卡翻转、评分、进度条 |
| `/questions` | 题库浏览：分类/标签筛选、题目列表 |

## 题目分类 (第一期)

**Go 语言**: 基础语法 / 并发模型 / 运行时 / 标准库 / 工程实践

**架构设计**: 设计原则 / 分布式基础 / 微服务 / 中间件 / 高可用 / 场景设计

## 关键设计决策

1. **SCSS 手写，不引入 UI 库** — 项目规模小 (3 页面 ~10 组件)，核心组件 (闪卡) UI 库不提供，SCSS design token 体系足够保证一致性
2. **Markdown seed 而非在线管理** — 个人用，编辑器写 Markdown 比做后台更高效，版本可控
3. **SM-2 而非 FSRS** — 100 题规模，SM-2 实现简单且久经验证
4. **SvelteKit 全栈单体** — 前端 SSR + server routes 直连 SQLite，零网络开销，部署一个进程
