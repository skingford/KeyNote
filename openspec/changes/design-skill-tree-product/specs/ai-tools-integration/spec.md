## ADDED Requirements

### Requirement: Document AI tool usage
系统必须支持记录AI工具的使用经验。

#### Scenario: Add tool experience
- **WHEN** 用户添加"Claude"使用经验
- **THEN** 系统保存工具名称、使用场景和技巧

#### Scenario: Link to skill tree
- **WHEN** 用户记录AI工具经验
- **THEN** 系统自动关联到"AI Agent工程"技能分类

### Requirement: Track tool proficiency
系统必须跟踪各AI工具的熟练度。

#### Scenario: Rate tool proficiency
- **WHEN** 用户评估Claude使用熟练度为80%
- **THEN** 系统保存评分并显示在技能树中

#### Scenario: Compare tool capabilities
- **WHEN** 用户查看AI工具对比
- **THEN** 系统显示各工具的特点和适用场景
