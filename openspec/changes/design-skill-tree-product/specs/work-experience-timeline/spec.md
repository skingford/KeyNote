## ADDED Requirements

### Requirement: Record work experience
系统必须支持记录工作经历信息。

#### Scenario: Add work experience
- **WHEN** 用户添加工作经历"某公司 - 后端工程师 (2023-2025)"
- **THEN** 系统保存公司、职位、起止时间信息

#### Scenario: Add job description
- **WHEN** 用户填写工作描述和成就
- **THEN** 系统保存详细信息并支持Markdown格式

### Requirement: Display timeline view
系统必须以时间线形式展示工作经历。

#### Scenario: Show chronological timeline
- **WHEN** 用户打开工作经历页面
- **THEN** 系统按时间顺序显示所有工作经历

#### Scenario: Highlight current position
- **WHEN** 工作经历的结束日期为空
- **THEN** 系统标记为"至今"并高亮显示

### Requirement: Link tech stack to experience
系统必须支持关联技术栈到工作经历。

#### Scenario: Tag skills used in job
- **WHEN** 用户为工作经历添加使用的技术"Go, Docker, K8s"
- **THEN** 系统自动关联到技能树中的对应节点

#### Scenario: Auto-update skill mastery
- **WHEN** 工作经历中使用某技能超过1年
- **THEN** 系统建议提升该技能的掌握度

### Requirement: Track project experience
系统必须支持记录项目经验。

#### Scenario: Add project to experience
- **WHEN** 用户在工作经历中添加项目"电商平台重构"
- **THEN** 系统保存项目名称、描述、技术栈和成果

#### Scenario: Link projects to skills
- **WHEN** 项目使用了特定技术
- **THEN** 系统在技能详情中显示相关项目

### Requirement: Export experience data
系统必须支持导出工作经历数据。

#### Scenario: Export to resume
- **WHEN** 用户生成简历
- **THEN** 系统自动包含工作经历时间线内容

#### Scenario: Export as JSON
- **WHEN** 用户导出数据
- **THEN** 系统提供JSON格式的工作经历数据
