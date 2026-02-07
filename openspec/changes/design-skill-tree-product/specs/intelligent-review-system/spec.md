## ADDED Requirements

### Requirement: Calculate next review date using SM-2 algorithm
系统必须使用SuperMemo 2算法计算下次复习时间。

#### Scenario: First review after learning
- **WHEN** 用户首次学习新技能并评分为4分（良好）
- **THEN** 系统设置下次复习时间为1天后

#### Scenario: Adjust interval based on performance
- **WHEN** 用户复习评分低于3分
- **THEN** 系统重置复习间隔为1天

### Requirement: Generate daily review plan
系统必须每天生成个性化的复习计划。

#### Scenario: Show due reviews
- **WHEN** 用户打开复习页面
- **THEN** 系统显示所有到期需要复习的技能列表

#### Scenario: Prioritize weak skills
- **WHEN** 生成复习计划
- **THEN** 系统优先排列掌握度低的技能

### Requirement: Track review history
系统必须记录所有复习历史。

#### Scenario: Save review record
- **WHEN** 用户完成一次复习并评分
- **THEN** 系统保存复习时间、评分和下次复习日期

#### Scenario: Display review statistics
- **WHEN** 用户查看技能详情
- **THEN** 系统显示该技能的复习次数和历史评分

### Requirement: Identify weak skills
系统必须自动识别薄弱技能点。

#### Scenario: Detect low mastery skills
- **WHEN** 技能掌握度低于40%
- **THEN** 系统标记为"需要加强"

#### Scenario: Detect forgotten skills
- **WHEN** 技能超过30天未复习
- **THEN** 系统标记为"可能遗忘"

### Requirement: Send review reminders
系统必须发送复习提醒通知。

#### Scenario: Daily review notification
- **WHEN** 每天早上9点
- **THEN** 系统发送通知显示今日待复习技能数量

#### Scenario: Overdue review alert
- **WHEN** 技能复习逾期超过3天
- **THEN** 系统发送紧急提醒

### Requirement: Support review modes
系统必须支持多种复习模式。

#### Scenario: Flashcard review mode
- **WHEN** 用户选择闪卡模式
- **THEN** 系统显示技能名称，用户回忆后翻转查看详情

#### Scenario: Quiz review mode
- **WHEN** 用户选择测验模式
- **THEN** 系统显示相关问题让用户作答

### Requirement: Adjust review difficulty
系统必须根据用户表现调整复习难度。

#### Scenario: Increase ease factor
- **WHEN** 用户连续3次复习评分为5分（完美）
- **THEN** 系统增加ease factor，延长复习间隔

#### Scenario: Decrease ease factor
- **WHEN** 用户复习评分为2分（困难）
- **THEN** 系统降低ease factor，缩短复习间隔

### Requirement: Provide review analytics
系统必须提供复习数据分析。

#### Scenario: Show review completion rate
- **WHEN** 用户查看复习统计
- **THEN** 系统显示每日复习完成率趋势图

#### Scenario: Display retention rate
- **WHEN** 用户查看技能保持率
- **THEN** 系统计算并显示各技能的记忆保持率
