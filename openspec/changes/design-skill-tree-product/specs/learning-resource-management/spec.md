## ADDED Requirements

### Requirement: Add learning resources to skills
系统必须允许为技能添加学习资源。

#### Scenario: Add resource link
- **WHEN** 用户为"React"添加官方文档链接
- **THEN** 系统保存链接并显示在技能详情中

#### Scenario: Categorize resource types
- **WHEN** 用户添加资源时选择类型"视频教程"
- **THEN** 系统按类型分类显示资源

### Requirement: Manage code snippets
系统必须支持保存和管理代码片段。

#### Scenario: Save code snippet
- **WHEN** 用户保存Go代码片段
- **THEN** 系统存储代码并应用语法高亮

#### Scenario: Search code snippets
- **WHEN** 用户搜索"goroutine"
- **THEN** 系统显示所有包含该关键词的代码片段

### Requirement: Link projects to skills
系统必须支持将项目与技能关联。

#### Scenario: Associate project with skills
- **WHEN** 用户添加项目"电商系统"并关联"Go"、"PostgreSQL"
- **THEN** 系统在相关技能下显示该项目

#### Scenario: Track skill usage in projects
- **WHEN** 用户查看技能"Docker"
- **THEN** 系统显示使用该技能的所有项目列表

### Requirement: Take learning notes
系统必须支持为技能添加学习笔记。

#### Scenario: Create note with Markdown
- **WHEN** 用户为技能创建笔记
- **THEN** 系统提供Markdown编辑器

#### Scenario: Organize notes by date
- **WHEN** 用户查看笔记列表
- **THEN** 系统按创建时间倒序显示
