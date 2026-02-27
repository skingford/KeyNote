## ADDED Requirements

### Requirement: SvelteKit 项目初始化
系统 SHALL 以 SvelteKit + Bun 为基础初始化项目，包含必要的依赖配置和目录结构。

#### Scenario: 项目启动
- **WHEN** 用户执行 `bun run dev`
- **THEN** 开发服务器在 localhost:5173 启动，无报错

#### Scenario: 生产构建
- **WHEN** 用户执行 `bun run build && bun run preview`
- **THEN** 生产构建成功，应用可正常访问

---

### Requirement: SQLite 数据库初始化
系统 SHALL 在首次启动时自动创建 SQLite 数据库文件并执行所有 migration，建立完整的表结构。

#### Scenario: 首次启动建表
- **WHEN** 应用首次启动，`keynote.db` 不存在
- **THEN** 自动创建 `keynote.db`，所有表（topics/questions/question_version_notes/tags/question_tags/quiz_records/settings）初始化完成

#### Scenario: 重复启动幂等性
- **WHEN** 应用重复启动，`keynote.db` 已存在
- **THEN** 不重复创建表，已有数据保持不变

---

### Requirement: Golang Topic 种子数据
系统 SHALL 在数据库初始化时预置 Golang Topic，作为第一个内容分类。

#### Scenario: Golang Topic 存在
- **WHEN** 数据库初始化完成
- **THEN** `topics` 表中存在 `slug = 'golang'` 的记录，包含名称、图标、颜色字段

---

### Requirement: 全局布局与主题
系统 SHALL 提供统一的页面布局框架，支持深色/浅色双主题，参考 GitHub Primer 设计语言。

#### Scenario: 顶部导航渲染
- **WHEN** 用户访问任意页面
- **THEN** 顶部导航栏显示，包含应用名称、主题切换按钮、主要导航链接

#### Scenario: 深色模式切换
- **WHEN** 用户点击主题切换按钮
- **THEN** 页面切换至深色/浅色模式，偏好持久化至 localStorage，刷新后保持

#### Scenario: 深色模式无闪烁
- **WHEN** 用户刷新页面
- **THEN** 在首帧即应用正确主题，不出现白色闪烁（FOUC）

---

### Requirement: 响应式布局
系统 SHALL 支持桌面端和移动端的响应式布局。

#### Scenario: 桌面端布局
- **WHEN** 视口宽度 ≥ 768px
- **THEN** 侧边导航展开，主内容区两列排列（如适用）

#### Scenario: 移动端布局
- **WHEN** 视口宽度 < 768px
- **THEN** 侧边导航折叠为汉堡菜单，主内容区单列全宽
