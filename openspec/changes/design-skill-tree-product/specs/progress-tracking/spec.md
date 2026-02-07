## ADDED Requirements

### Requirement: Track learning time
系统必须记录每个技能的学习时间。

#### Scenario: Start learning session
- **WHEN** 用户开始学习某技能
- **THEN** 系统开始计时

#### Scenario: Save session duration
- **WHEN** 用户结束学习
- **THEN** 系统保存学习时长到数据库

### Requirement: Update mastery level
系统必须支持更新技能掌握度。

#### Scenario: Manual update
- **WHEN** 用户手动调整掌握度为75%
- **THEN** 系统保存新值并更新可视化

#### Scenario: Auto-suggest based on activity
- **WHEN** 用户学习某技能累计超过20小时
- **THEN** 系统建议提升掌握度

### Requirement: Record review count
系统必须记录技能复习次数。

#### Scenario: Increment review counter
- **WHEN** 用户完成一次复习
- **THEN** 系统增加该技能的复习计数

#### Scenario: Display review history
- **WHEN** 用户查看技能详情
- **THEN** 系统显示复习次数和最近复习时间

### Requirement: Calculate progress metrics
系统必须计算学习进度指标。

#### Scenario: Compute overall progress
- **WHEN** 用户查看总体进度
- **THEN** 系统计算所有技能的平均掌握度

#### Scenario: Track category progress
- **WHEN** 用户查看分类进度
- **THEN** 系统显示各技术栈的完成百分比

### Requirement: Provide progress visualization
系统必须可视化展示学习进度。

#### Scenario: Show progress bar
- **WHEN** 用户查看技能列表
- **THEN** 系统为每个技能显示进度条

#### Scenario: Display milestone achievements
- **WHEN** 用户达成学习里程碑
- **THEN** 系统显示成就徽章
