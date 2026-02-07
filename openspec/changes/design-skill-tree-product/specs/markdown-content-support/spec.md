## ADDED Requirements

### Requirement: Edit Markdown content
系统必须提供Markdown编辑器用于编辑技能内容。

#### Scenario: Write Markdown text
- **WHEN** 用户在编辑器中输入Markdown文本
- **THEN** 系统实时显示格式化预览

#### Scenario: Insert code block
- **WHEN** 用户插入代码块并选择语言"python"
- **THEN** 系统应用Python语法高亮

### Requirement: Render Markdown with syntax highlighting
系统必须正确渲染Markdown内容并支持代码高亮。

#### Scenario: Display formatted content
- **WHEN** 用户查看包含标题、列表、链接的Markdown内容
- **THEN** 系统正确渲染所有Markdown语法元素

#### Scenario: Highlight code syntax
- **WHEN** Markdown内容包含Go代码块
- **THEN** 系统使用Prism.js高亮显示Go语法

### Requirement: Support Markdown extensions
系统必须支持扩展的Markdown语法。

#### Scenario: Render tables
- **WHEN** 用户创建Markdown表格
- **THEN** 系统渲染为HTML表格

#### Scenario: Support task lists
- **WHEN** 用户使用`- [ ]`语法创建任务列表
- **THEN** 系统渲染为可交互的复选框

### Requirement: Real-time preview
系统必须提供实时预览功能。

#### Scenario: Split view editing
- **WHEN** 用户在编辑器中输入内容
- **THEN** 系统在右侧实时显示渲染结果

#### Scenario: Sync scroll position
- **WHEN** 用户滚动编辑器
- **THEN** 预览窗口同步滚动到对应位置

### Requirement: Import and export Markdown
系统必须支持Markdown文件的导入导出。

#### Scenario: Import Markdown file
- **WHEN** 用户导入.md文件
- **THEN** 系统解析内容并填充到编辑器

#### Scenario: Export as Markdown
- **WHEN** 用户点击"导出Markdown"
- **THEN** 系统下载包含所有技能内容的.md文件

### Requirement: Auto-save content
系统必须自动保存编辑中的内容。

#### Scenario: Save on typing pause
- **WHEN** 用户停止输入3秒
- **THEN** 系统自动保存内容到本地数据库

#### Scenario: Show save status
- **WHEN** 内容正在保存
- **THEN** 系统显示"保存中..."状态提示

### Requirement: Support image insertion
系统必须支持在Markdown中插入图片。

#### Scenario: Upload and insert image
- **WHEN** 用户上传图片文件
- **THEN** 系统存储图片并插入Markdown图片语法

#### Scenario: Paste image from clipboard
- **WHEN** 用户从剪贴板粘贴图片
- **THEN** 系统自动上传并插入图片链接

### Requirement: Provide editor shortcuts
系统必须提供常用的编辑器快捷键。

#### Scenario: Format text with shortcuts
- **WHEN** 用户按Ctrl+B
- **THEN** 系统将选中文本加粗

#### Scenario: Insert code block shortcut
- **WHEN** 用户按Ctrl+Shift+C
- **THEN** 系统插入代码块模板
