## ADDED Requirements

### Requirement: Parse job description text
系统必须能够解析招聘信息文本并提取技能要求。

#### Scenario: Extract technical skills
- **WHEN** 用户粘贴包含"熟悉Go、Kubernetes、PostgreSQL"的职位描述
- **THEN** 系统识别并提取技能列表["Go", "Kubernetes", "PostgreSQL"]

#### Scenario: Identify experience requirements
- **WHEN** 职位描述包含"3年以上后端开发经验"
- **THEN** 系统提取经验要求"3年后端开发"

### Requirement: Map skills to skill tree
系统必须将提取的技能映射到用户的技能树。

#### Scenario: Match existing skills
- **WHEN** 提取的技能"React"在用户技能树中存在
- **THEN** 系统关联到现有技能节点并显示当前掌握度

#### Scenario: Suggest missing skills
- **WHEN** 提取的技能"Kafka"不在用户技能树中
- **THEN** 系统建议添加该技能到技能树

### Requirement: Generate skill gap report
系统必须生成技能差距分析报告。

#### Scenario: Show matched skills
- **WHEN** 分析完成
- **THEN** 系统显示已掌握的技能列表及掌握度

#### Scenario: Highlight missing skills
- **WHEN** 职位要求包含用户未掌握的技能
- **THEN** 系统高亮显示缺失技能并标注优先级

### Requirement: Generate learning path
系统必须根据技能差距生成学习路径。

#### Scenario: Create step-by-step plan
- **WHEN** 用户需要学习"Kubernetes"但缺少前置技能
- **THEN** 系统生成路径"Docker → 容器网络 → Kubernetes基础 → Kubernetes进阶"

#### Scenario: Estimate learning time
- **WHEN** 生成学习路径
- **THEN** 系统估算每个技能的学习时间和总时长

### Requirement: Calculate job match score
系统必须计算用户与职位的匹配度。

#### Scenario: Compute match percentage
- **WHEN** 职位要求10个技能，用户掌握7个
- **THEN** 系统显示匹配度70%

#### Scenario: Weight by skill importance
- **WHEN** 职位强调"必须精通Go"
- **THEN** 系统给Go技能更高权重计算匹配度

### Requirement: Support multiple AI providers
系统必须支持使用不同的AI模型进行分析。

#### Scenario: Use Claude for analysis
- **WHEN** 用户选择Claude作为AI提供商
- **THEN** 系统调用Claude API进行职位分析

#### Scenario: Fallback to alternative model
- **WHEN** 主要AI服务不可用
- **THEN** 系统自动切换到备用AI模型

### Requirement: Save analysis history
系统必须保存职位分析历史记录。

#### Scenario: Store analysis results
- **WHEN** 完成职位分析
- **THEN** 系统保存职位信息、技能要求和分析结果

#### Scenario: Compare multiple positions
- **WHEN** 用户查看分析历史
- **THEN** 系统支持对比多个职位的技能要求

### Requirement: Provide actionable recommendations
系统必须提供可执行的学习建议。

#### Scenario: Recommend learning resources
- **WHEN** 识别出技能差距
- **THEN** 系统推荐相关的学习资源链接

#### Scenario: Suggest practice projects
- **WHEN** 用户需要提升某项技能
- **THEN** 系统建议相关的实践项目
