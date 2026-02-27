## 设计标准 — GitHub Primer 风格 × Skeleton UI

> 参考来源：[GitHub Primer CSS](https://github.com/primer/css) · [Skeleton UI v3](https://www.skeleton.dev)
> 通过 Context7 提取核心设计 token，实现层使用 Skeleton v3 + Tailwind v4，视觉目标参考 GitHub Primer。

---

## ADDED Requirements

### Requirement: Skeleton UI 框架安装与配置
系统 SHALL 使用 Skeleton v3（配合 Tailwind v4）作为主要 UI 框架，通过 Vite 插件集成至 SvelteKit + Bun 项目。

```bash
# 安装依赖
bun add -d @skeletonlabs/skeleton @tailwindcss/vite tailwindcss
```

```typescript
// vite.config.ts — Tailwind v4 必须在 sveltekit() 之前注册
import tailwindcss from '@tailwindcss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss(),   // ← 先于 sveltekit
    sveltekit(),
  ],
})
```

```css
/* src/app.css — 引入 Skeleton 主题与 Tailwind */
@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton/themes/cerberus'; /* 基础主题，后续自定义覆盖 */
@import 'tailwindcss';
```

```svelte
<!-- src/app.html — data-theme 挂在 <html> 上（Skeleton v3 要求）-->
<html lang="zh-CN" data-theme="keynote">
```

#### Scenario: 开发服务器启动
- **WHEN** 执行 `bun run dev`
- **THEN** Skeleton 组件样式正确加载，无 CSS 报错，Tailwind v4 工具类可用

#### Scenario: 主题属性位置
- **WHEN** 渲染任意页面
- **THEN** `data-theme="keynote"` 属性挂载在 `<html>` 根元素，而非 `<body>`

---

### Requirement: 自定义主题 — GitHub Primer 色调
系统 SHALL 在 Skeleton 主题基础上，使用 oklch 色彩格式覆盖 primary/surface/success/warning/error 颜色，映射至 GitHub Primer 视觉风格。

```css
/* src/styles/theme-keynote.css */
/* Skeleton v3 使用 oklch 格式定义颜色 token */

[data-theme='keynote'] {
  /* Primary — GitHub 蓝（链接、主要操作） */
  --color-primary-50:  oklch(97% 0.02 250);
  --color-primary-100: oklch(93% 0.05 250);
  --color-primary-400: oklch(65% 0.18 250);
  --color-primary-500: oklch(55% 0.20 250);  /* #0969da 对应值 */
  --color-primary-600: oklch(48% 0.20 250);
  --color-primary-900: oklch(25% 0.12 250);

  /* Surface — GitHub canvas（背景层级） */
  --color-surface-50:  oklch(99% 0.002 250);  /* #ffffff */
  --color-surface-100: oklch(97% 0.005 250);  /* #f6f8fa 侧边栏 */
  --color-surface-200: oklch(94% 0.008 250);  /* #eaeef2 */
  --color-surface-700: oklch(40% 0.01 250);   /* 深色中层 */
  --color-surface-800: oklch(20% 0.01 250);   /* #161b22 深色侧边栏 */
  --color-surface-900: oklch(10% 0.01 250);   /* #0d1117 深色主背景 */
  --color-surface-950: oklch(5%  0.01 250);   /* #010409 深色内嵌 */

  /* Success — GitHub 绿 */
  --color-success-500: oklch(52% 0.17 145);   /* #1a7f37 */

  /* Warning — GitHub 黄 */
  --color-warning-500: oklch(62% 0.16 85);    /* #9a6700 */

  /* Error — GitHub 红（breaking 变更） */
  --color-error-500:   oklch(50% 0.22 25);    /* #d1242f */

  /* 字体栈（覆盖 Skeleton 默认） */
  --font-heading: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans",
                  Helvetica, Arial, sans-serif;
  --font-base:    -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans",
                  Helvetica, Arial, sans-serif;
  --font-mono:    ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
                  "Liberation Mono", monospace;

  /* 圆角（GitHub 风格偏小） */
  --radius-base: 6px;
  --radius-container: 6px;
}

/* 深色模式背景覆盖 */
[data-theme='keynote'] body {
  --body-background-color:      oklch(99% 0.002 250);  /* 浅色 */
  --body-background-color-dark: oklch(10% 0.01 250);   /* 深色 #0d1117 */
}
```

#### Scenario: 自定义主题加载
- **WHEN** `data-theme="keynote"` 生效
- **THEN** primary 色显示为 GitHub 蓝（#0969da 近似），而非 Skeleton 默认橙色

#### Scenario: 深色模式颜色切换
- **WHEN** 系统或用户切换为深色模式
- **THEN** 背景自动切换为 `#0d1117` 近似深色，文字为高对比浅色

---

### Requirement: 深色模式策略
系统 SHALL 使用 Skeleton 的 Media Strategy（默认行为），跟随系统 `prefers-color-scheme`，并提供手动切换开关持久化至 localStorage。

```svelte
<!-- 防闪烁脚本：在 <head> 内联，首帧即应用 -->
<script>
  const stored = localStorage.getItem('colorMode')
  if (stored === 'dark' ||
      (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark')
  }
</script>
```

#### Scenario: 系统深色自动适配
- **WHEN** 用户系统设置为深色模式，且未手动覆盖
- **THEN** 页面自动呈现深色主题，无需手动切换

#### Scenario: 手动切换持久化
- **WHEN** 用户点击主题切换按钮
- **THEN** 偏好写入 localStorage，刷新后保持，不跟随系统变化

#### Scenario: 无闪烁加载
- **WHEN** 用户刷新页面
- **THEN** 首帧即应用正确主题，不出现白色闪烁（FOUC）

---

### Requirement: Skeleton 组件使用规范
系统 SHALL 优先使用 Skeleton v3 的内置 preset 类构建 UI，减少自定义样式，保持一致性。

#### Scenario: 主要按钮
- **WHEN** 渲染"开始刷题"、"保存题目"等主操作
- **THEN** 使用 `btn preset-filled-primary-500` 类

```svelte
<button class="btn preset-filled-primary-500">开始刷题</button>
```

#### Scenario: 次要按钮
- **WHEN** 渲染"取消"、"返回"等次级操作
- **THEN** 使用 `btn preset-outlined-surface-500` 类

```svelte
<button class="btn preset-outlined-surface-500">取消</button>
```

#### Scenario: 危险操作按钮
- **WHEN** 渲染"删除题目"等破坏性操作
- **THEN** 默认使用 `btn preset-outlined-error-500`，hover 时变为 `preset-filled-error-500`

```svelte
<button class="btn preset-outlined-error-500 hover:preset-filled-error-500">
  删除题目
</button>
```

#### Scenario: 题目卡片
- **WHEN** 渲染题库列表中的题目卡片
- **THEN** 使用 `card p-4 preset-outlined-surface-200-800` 类，hover 时提升阴影

```svelte
<div class="card p-4 preset-tonal-surface hover:shadow-md transition-shadow">
  <!-- 题目内容 -->
</div>
```

#### Scenario: 版本注记徽章
- **WHEN** 渲染版本注记的 `change_type` 标签
- **THEN** 按以下 Skeleton preset 映射：

  | change_type | Skeleton 类                          |
  |-------------|--------------------------------------|
  | breaking    | `badge preset-filled-error-500`      |
  | fixed       | `badge preset-filled-success-500`    |
  | added       | `badge preset-filled-primary-500`    |
  | deprecated  | `badge preset-tonal-surface`         |

#### Scenario: 难度徽章
- **WHEN** 渲染题目难度（1-5）
- **THEN** 1-2 级 `badge preset-tonal-success`，3 级 `badge preset-tonal-warning`，4-5 级 `badge preset-tonal-error`

---

### Requirement: 排版系统（Skeleton 语义类 + 自定义 SCSS）
系统 SHALL 使用 Skeleton 的排版语义类作为基础，SCSS 变量管理非 Tailwind 场景的字号和行高。

```svelte
<!-- 使用 Skeleton 排版预设 -->
<h1 class="h1">KeyNote</h1>
<h2 class="h2">Golang 题库</h2>
<p class="text-surface-700-300">共 80 题</p>
```

```scss
// src/styles/_typography.scss — 补充 Skeleton 未覆盖的场景
// Markdown 渲染区域专属样式（.prose 风格）
.keynote-prose {
  font-family: var(--font-base);
  line-height: 1.6;
  color: var(--color-surface-900-50);  // Skeleton 双值语法：浅色/深色

  code {
    font-family: var(--font-mono);
    font-size: 0.875em;
    background: var(--color-surface-100-800);
    padding: 0.125em 0.375em;
    border-radius: var(--radius-base);
  }

  pre {
    background: var(--color-surface-100-800);
    border: 1px solid var(--color-surface-200-700);
    border-radius: var(--radius-base);
    padding: 1rem;
    overflow-x: auto;
  }
}
```

#### Scenario: 标题层级
- **WHEN** 渲染页面标题
- **THEN** 使用 Skeleton `h1`~`h4` 语义类，字体自动跟随 `--font-heading` 变量

#### Scenario: 代码块字体
- **WHEN** 渲染 Markdown 代码块
- **THEN** 使用 `var(--font-mono)`（已在主题中设置为 GitHub 等宽字体栈），字号 14px

---

### Requirement: 间距与布局（Tailwind v4 工具类）
系统 SHALL 使用 Tailwind v4 的间距工具类（基于 `--spacing` 设计 token），不再使用纯 SCSS 变量存储间距。

```svelte
<!-- Tailwind v4 间距工具类示例 -->
<div class="p-4 gap-3 mb-6">       <!-- 16px / 12px / 32px -->
<div class="px-4 py-3">            <!-- 卡片内边距 -->
<div class="space-y-3">            <!-- 列表项间距 12px -->
```

```
桌面端布局（≥ 1012px）
┌─────────────────────────────────────────────────┐
│  Topbar  h-16  border-b border-surface-200-800  │
├──────────────┬──────────────────────────────────┤
│  Sidebar     │  Main Content                    │
│  w-60        │  max-w-5xl mx-auto px-4          │
│  bg-surface  │                                  │
│  -100-800    │                                  │
└──────────────┴──────────────────────────────────┘

移动端（< 768px）
┌─────────────────────────────────────────────────┐
│  Topbar（汉堡菜单 — Skeleton Drawer）            │
├─────────────────────────────────────────────────┤
│  Main Content  px-3  全宽                       │
└─────────────────────────────────────────────────┘
```

#### Scenario: 卡片内边距
- **WHEN** 渲染题目卡片
- **THEN** 使用 `p-4`（16px），小屏 `p-3`（12px）

#### Scenario: 侧边栏当前路由高亮
- **WHEN** 用户当前路由匹配侧边栏某链接
- **THEN** 使用 `preset-tonal-primary` 背景 + 左侧 2px primary 色边条（`border-l-2 border-primary-500`）

---

### Requirement: 代码高亮规范
系统 SHALL 对 Markdown 渲染中的代码块进行语法高亮，主题与 Skeleton 深色/浅色模式联动。

#### Scenario: 浅色模式高亮
- **WHEN** 当前为浅色主题
- **THEN** 使用 `github-light` 主题（通过 shiki 或 highlight.js）

#### Scenario: 深色模式高亮
- **WHEN** 当前为深色主题
- **THEN** 自动切换至 `github-dark` 主题

#### Scenario: 语言标签与复制按钮
- **WHEN** 代码块包含语言声明（如 \`\`\`go）
- **THEN** 代码块右上角显示语言标签和一键复制按钮

---

### Requirement: 交互动效规范
系统 SHALL 使用克制动效，Skeleton 内置过渡为基准，自定义动效不超过以下时长。

```scss
// src/styles/_motion.scss
$duration-fast:   80ms;    // 按钮 hover、focus ring（Tailwind: duration-75）
$duration-normal: 150ms;   // 卡片 hover、下拉（Tailwind: duration-150）
$duration-slow:   300ms;   // 翻牌动画、侧边栏折叠（Tailwind: duration-300）

$ease-out:    cubic-bezier(0, 0, 0.5, 1);
$ease-in-out: cubic-bezier(0.5, 0, 0.5, 1);

// 翻牌动画（核心交互）
.flashcard-inner {
  transition: transform $duration-slow $ease-out;
  transform-style: preserve-3d;
}
.flashcard-inner.flipped {
  transform: rotateY(180deg);
}

// 无障碍：减弱动效
@media (prefers-reduced-motion: reduce) {
  .flashcard-inner {
    transition: opacity $duration-fast ease;
  }
  .flashcard-inner.flipped {
    transform: none;
    opacity: 0;
  }
}
```

#### Scenario: 按钮 hover 响应
- **WHEN** 用户悬停在按钮上
- **THEN** Skeleton preset 自动处理 hover 样式，响应在 80ms 内完成

#### Scenario: 翻牌动画
- **WHEN** 用户点击"查看答案"
- **THEN** CSS 3D 翻转，总时长 300ms，`$ease-out` 缓动

#### Scenario: 尊重系统减弱动效
- **WHEN** `prefers-reduced-motion: reduce` 开启
- **THEN** 翻牌改为淡入淡出，所有过渡时长降至 80ms 以内
