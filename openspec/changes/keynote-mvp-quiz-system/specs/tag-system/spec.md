## ADDED Requirements

### Requirement: Topic 管理
系统 SHALL 支持多个技术 Topic（如 Golang、Frontend、Rust），作为题目和标签的一级分类。

#### Scenario: 查看 Topic 列表
- **WHEN** 用户访问首页或侧边导航
- **THEN** 显示所有 Topic，包含名称、图标、颜色、题目数量

#### Scenario: 切换当前 Topic
- **WHEN** 用户点击某个 Topic
- **THEN** 题库列表、标签列表、刷题范围均切换至该 Topic

---

### Requirement: 标签管理
系统 SHALL 支持在 Topic 下创建和管理标签，用于细粒度分类题目。

#### Scenario: 创建标签
- **WHEN** 用户在标签管理页填写标签名和颜色，点击创建
- **THEN** 标签写入 `tags` 表，与当前 Topic 关联

#### Scenario: 标签唯一性
- **WHEN** 用户尝试在同一 Topic 下创建同名标签
- **THEN** 系统提示标签已存在，不重复创建

#### Scenario: 删除标签
- **WHEN** 用户删除某个标签并确认
- **THEN** 标签从 `tags` 表删除，`question_tags` 中关联记录同步清理

---

### Requirement: 规则引擎候选标签推荐
系统 SHALL 在用户输入题目内容时，基于关键词字典自动推荐候选标签，用户手动确认后生效。

#### Scenario: 关键词匹配推荐
- **WHEN** 用户在题目表单中输入题干或答案内容
- **THEN** 系统检测内容中的关键词（如"goroutine"→[并发][goroutine]，"interface"→[接口]，"channel"→[并发][CSP]），在标签区显示推荐候选

#### Scenario: 确认候选标签
- **WHEN** 用户点击某个候选标签
- **THEN** 该标签添加到题目已选标签列表，候选区移除该项

#### Scenario: 忽略候选标签
- **WHEN** 用户不点击某个候选标签
- **THEN** 该标签不自动添加，只作为建议展示

#### Scenario: 无匹配时不显示推荐
- **WHEN** 题目内容不包含任何已知关键词
- **THEN** 候选标签区不显示或显示为空

---

### Requirement: 题目与标签关联
系统 SHALL 允许为题目添加或移除多个标签，并维护关联关系。

#### Scenario: 添加标签到题目
- **WHEN** 用户在题目表单中选择或输入标签
- **THEN** 保存时 `question_tags` 写入对应关联记录

#### Scenario: 从题目移除标签
- **WHEN** 用户在题目表单中点击标签的删除按钮
- **THEN** 保存时 `question_tags` 删除对应关联记录

#### Scenario: 按标签过滤题目
- **WHEN** 用户在题库列表点击某个标签
- **THEN** 列表过滤，只显示包含该标签的题目
