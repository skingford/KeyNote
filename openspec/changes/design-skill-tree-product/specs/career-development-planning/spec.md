## ADDED Requirements

### Requirement: Define career goals
系统必须支持设定职业发展目标。

#### Scenario: Set target position
- **WHEN** 用户设定目标职位"高级后端工程师"
- **THEN** 系统保存目标并分析所需技能

#### Scenario: Set timeline
- **WHEN** 用户设定达成目标的时间为"12个月"
- **THEN** 系统生成分阶段学习计划

### Requirement: Analyze skill gaps
系统必须分析当前技能与目标的差距。

#### Scenario: Compare with target role
- **WHEN** 用户查看技能差距
- **THEN** 系统显示缺失技能和需要提升的技能

#### Scenario: Prioritize learning
- **WHEN** 系统分析差距
- **THEN** 系统按重要性排序学习优先级

### Requirement: Provide salary insights
系统必须提供薪资趋势参考。

#### Scenario: Show market salary range
- **WHEN** 用户查看目标职位薪资
- **THEN** 系统显示市场薪资范围和影响因素

#### Scenario: Estimate earning potential
- **WHEN** 用户完成技能提升
- **THEN** 系统估算潜在薪资增长
