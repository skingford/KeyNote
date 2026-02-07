## ADDED Requirements

### Requirement: Full-text search
系统必须支持全文搜索功能。

#### Scenario: Search by keyword
- **WHEN** 用户搜索"kubernetes"
- **THEN** 系统返回名称或内容包含该关键词的所有技能

#### Scenario: Fuzzy search
- **WHEN** 用户输入"k8s"
- **THEN** 系统识别为"Kubernetes"并返回结果

### Requirement: Advanced filtering
系统必须提供高级筛选功能。

#### Scenario: Filter by mastery range
- **WHEN** 用户筛选掌握度50%-80%的技能
- **THEN** 系统显示符合范围的技能列表

#### Scenario: Filter by last review date
- **WHEN** 用户筛选"30天未复习"的技能
- **THEN** 系统显示需要复习的技能

### Requirement: Save search filters
系统必须支持保存常用筛选条件。

#### Scenario: Save filter preset
- **WHEN** 用户保存筛选条件为"面试重点"
- **THEN** 系统保存配置供快速应用

#### Scenario: Quick apply saved filter
- **WHEN** 用户选择已保存的筛选器
- **THEN** 系统立即应用筛选条件
