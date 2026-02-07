## ADDED Requirements

### Requirement: Create new skill node
系统必须允许用户创建新的技能节点。

#### Scenario: Add skill with basic information
- **WHEN** 用户点击"添加技能"并输入名称"Go语言"、分类"编程语言"
- **THEN** 系统创建新技能节点并显示在技能树中

#### Scenario: Validate required fields
- **WHEN** 用户尝试创建技能但未填写名称
- **THEN** 系统显示错误提示"技能名称不能为空"

### Requirement: Edit skill information
系统必须允许用户编辑现有技能的信息。

#### Scenario: Update skill details
- **WHEN** 用户编辑技能"React"的描述和掌握度
- **THEN** 系统保存更改并更新技能树显示

#### Scenario: Change skill category
- **WHEN** 用户将技能从"前端框架"移动到"JavaScript生态"
- **THEN** 系统更新分类并重新组织技能树结构

### Requirement: Delete skill node
系统必须允许用户删除技能节点。

#### Scenario: Delete skill without dependencies
- **WHEN** 用户删除没有被其他技能依赖的技能节点
- **THEN** 系统删除该节点及其所有关联数据

#### Scenario: Warn before deleting skill with dependencies
- **WHEN** 用户尝试删除被其他技能依赖的节点
- **THEN** 系统显示警告"该技能被X个其他技能依赖，确认删除？"

### Requirement: Manage skill relationships
系统必须支持创建和管理技能之间的关系。

#### Scenario: Add prerequisite relationship
- **WHEN** 用户设置"JavaScript"为"React"的前置技能
- **THEN** 系统创建依赖关系并在技能树中显示连线

#### Scenario: Remove relationship
- **WHEN** 用户删除技能关系
- **THEN** 系统移除连线并更新技能树布局

### Requirement: Categorize skills by tech stack
系统必须支持按技术栈分类管理技能。

#### Scenario: Create new category
- **WHEN** 用户创建新分类"AI Agent工程"
- **THEN** 系统添加该分类并允许添加相关技能

#### Scenario: Move skills between categories
- **WHEN** 用户将多个技能批量移动到新分类
- **THEN** 系统更新所有技能的分类属性

### Requirement: Tag skills with labels
系统必须支持为技能添加标签。

#### Scenario: Add multiple tags
- **WHEN** 用户为"Docker"添加标签"容器"、"DevOps"、"云原生"
- **THEN** 系统保存标签并支持按标签筛选

#### Scenario: Search by tags
- **WHEN** 用户搜索标签"面试重点"
- **THEN** 系统显示所有带该标签的技能

### Requirement: Set skill mastery level
系统必须允许用户设置和更新技能掌握度。

#### Scenario: Update mastery percentage
- **WHEN** 用户将"Python"的掌握度从60%更新到80%
- **THEN** 系统保存新值并更新可视化颜色

#### Scenario: Auto-suggest mastery level
- **WHEN** 用户完成学习记录和复习
- **THEN** 系统根据学习时间和复习表现建议掌握度

### Requirement: Bulk operations on skills
系统必须支持批量操作多个技能。

#### Scenario: Batch update category
- **WHEN** 用户选择10个技能并批量修改分类
- **THEN** 系统更新所有选中技能的分类

#### Scenario: Batch delete skills
- **WHEN** 用户选择多个技能并点击删除
- **THEN** 系统显示确认对话框并批量删除
