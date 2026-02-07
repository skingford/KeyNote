## ADDED Requirements

### Requirement: Display learning time statistics
系统必须统计和显示学习时间数据。

#### Scenario: Show daily study time
- **WHEN** 用户查看统计页面
- **THEN** 系统显示过去30天的每日学习时长柱状图

#### Scenario: Compare time by category
- **WHEN** 用户查看分类统计
- **THEN** 系统显示各技术栈的学习时间占比饼图

### Requirement: Visualize mastery trends
系统必须可视化技能掌握度变化趋势。

#### Scenario: Show mastery progress
- **WHEN** 用户查看技能"Kubernetes"的趋势
- **THEN** 系统显示掌握度随时间变化的折线图

#### Scenario: Display overall progress
- **WHEN** 用户查看总体进度
- **THEN** 系统显示所有技能平均掌握度的趋势

### Requirement: Generate skill heatmap
系统必须生成技能学习热力图。

#### Scenario: Display activity heatmap
- **WHEN** 用户查看学习活跃度
- **THEN** 系统显示类似GitHub的日历热力图

#### Scenario: Show intensity by color
- **WHEN** 某天学习时间超过2小时
- **THEN** 系统用深色标记该日期

### Requirement: Create skill radar chart
系统必须生成技能雷达图。

#### Scenario: Display skill distribution
- **WHEN** 用户查看技能分布
- **THEN** 系统显示多维度技能雷达图

#### Scenario: Compare with job requirements
- **WHEN** 用户对比职位要求
- **THEN** 系统叠加显示目标技能雷达图

### Requirement: Provide learning insights
系统必须提供学习数据洞察。

#### Scenario: Identify most improved skills
- **WHEN** 用户查看月度报告
- **THEN** 系统显示进步最快的前5个技能

#### Scenario: Suggest focus areas
- **WHEN** 分析学习模式
- **THEN** 系统建议需要加强的技能领域
