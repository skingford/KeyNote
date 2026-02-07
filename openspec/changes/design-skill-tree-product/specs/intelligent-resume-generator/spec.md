## ADDED Requirements

### Requirement: Generate resume from skill tree
系统必须基于技能树自动生成简历内容。

#### Scenario: Extract skills section
- **WHEN** 用户点击"生成简历"
- **THEN** 系统从技能树提取所有技能并按分类组织到简历技能部分

#### Scenario: Include mastery levels
- **WHEN** 生成技能列表
- **THEN** 系统只包含掌握度大于60%的技能

### Requirement: Integrate work experience timeline
系统必须将工作经历整合到简历中。

#### Scenario: Format work history
- **WHEN** 生成简历
- **THEN** 系统按时间倒序排列工作经历

#### Scenario: Link skills to experience
- **WHEN** 工作经历中使用了某项技能
- **THEN** 系统在工作描述中突出显示该技能

### Requirement: Support multiple resume templates
系统必须提供多种简历模板供选择。

#### Scenario: Choose template style
- **WHEN** 用户选择"技术型"模板
- **THEN** 系统使用强调技术技能的布局生成简历

#### Scenario: Preview template
- **WHEN** 用户浏览模板
- **THEN** 系统显示每个模板的预览图

### Requirement: Real-time resume updates
系统必须在数据变更时自动更新简历。

#### Scenario: Auto-update on skill change
- **WHEN** 用户更新技能掌握度或添加新技能
- **THEN** 系统自动刷新简历预览

#### Scenario: Sync work experience changes
- **WHEN** 用户修改工作经历
- **THEN** 系统立即更新简历中的相关部分

### Requirement: Customize resume content
系统必须允许用户自定义简历内容。

#### Scenario: Edit generated content
- **WHEN** 用户编辑简历中的技能描述
- **THEN** 系统保存自定义内容并在后续生成中保留

#### Scenario: Reorder sections
- **WHEN** 用户拖拽简历章节
- **THEN** 系统调整章节顺序并保存布局

### Requirement: Export resume in multiple formats
系统必须支持导出多种格式的简历。

#### Scenario: Export as PDF
- **WHEN** 用户点击"导出PDF"
- **THEN** 系统生成高质量PDF文件供下载

#### Scenario: Export as Word document
- **WHEN** 用户选择导出为Word
- **THEN** 系统生成.docx格式文件

#### Scenario: Export as Markdown
- **WHEN** 用户选择Markdown格式
- **THEN** 系统导出纯文本Markdown文件

### Requirement: Optimize resume for job posting
系统必须根据职位要求优化简历内容。

#### Scenario: Highlight relevant skills
- **WHEN** 用户选择针对特定职位优化
- **THEN** 系统突出显示职位要求的技能

#### Scenario: Adjust skill order
- **WHEN** 优化简历
- **THEN** 系统将最相关的技能排在前面

### Requirement: Provide AI-powered suggestions
系统必须提供AI驱动的简历优化建议。

#### Scenario: Suggest content improvements
- **WHEN** 用户请求AI建议
- **THEN** 系统分析简历并提供改进建议

#### Scenario: Recommend missing sections
- **WHEN** 简历缺少关键部分
- **THEN** 系统建议添加项目经验或教育背景

### Requirement: Version control for resumes
系统必须支持简历版本管理。

#### Scenario: Save resume versions
- **WHEN** 用户生成新版本简历
- **THEN** 系统保存历史版本并允许回滚

#### Scenario: Compare versions
- **WHEN** 用户查看版本历史
- **THEN** 系统显示不同版本之间的差异
