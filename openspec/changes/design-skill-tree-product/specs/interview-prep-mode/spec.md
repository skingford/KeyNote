## ADDED Requirements

### Requirement: Manage interview question bank
系统必须提供面试题库管理功能。

#### Scenario: Add interview question
- **WHEN** 用户添加面试题"解释Go的goroutine"
- **THEN** 系统保存题目并关联到"Go"技能

#### Scenario: Categorize questions
- **WHEN** 用户为题目添加标签"并发"、"高频"
- **THEN** 系统支持按标签筛选题目

### Requirement: Practice with flashcards
系统必须提供闪卡式复习功能。

#### Scenario: Show question flashcard
- **WHEN** 用户进入复习模式
- **THEN** 系统显示问题，用户思考后翻转查看答案

#### Scenario: Mark difficulty
- **WHEN** 用户回答问题后评分
- **THEN** 系统调整该题目的复习频率

### Requirement: Simulate mock interviews
系统必须支持模拟面试场景。

#### Scenario: Start timed interview
- **WHEN** 用户开始模拟面试并设置45分钟
- **THEN** 系统随机抽取题目并开始计时

#### Scenario: Record answers
- **WHEN** 用户回答问题
- **THEN** 系统保存答案和用时

### Requirement: Track weak areas
系统必须识别面试薄弱环节。

#### Scenario: Identify low-score topics
- **WHEN** 用户在某类题目上得分低
- **THEN** 系统标记为薄弱点并推荐加强

#### Scenario: Generate focus plan
- **WHEN** 用户查看复习建议
- **THEN** 系统生成针对薄弱点的复习计划

### Requirement: Provide interview tips
系统必须提供面试技巧和建议。

#### Scenario: Show common mistakes
- **WHEN** 用户查看题目详情
- **THEN** 系统显示常见错误和注意事项

#### Scenario: Suggest answer structure
- **WHEN** 用户准备回答
- **THEN** 系统提供答题框架建议
