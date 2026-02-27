## ADDED Requirements

### Requirement: 配置刷题会话
系统 SHALL 允许用户在开始刷题前配置本次会话参数。

#### Scenario: 配置页展示
- **WHEN** 用户访问 `/quiz`
- **THEN** 显示配置界面，包含：题数（默认10）、答题模式（随机/顺序）、难度过滤、标签过滤、Topic 选择

#### Scenario: 无可用题目时提示
- **WHEN** 用户根据当前过滤条件，题库中符合条件的题目数量为 0
- **THEN** 显示提示"当前筛选条件下无可用题目"，"开始"按钮禁用

#### Scenario: 开始会话
- **WHEN** 用户点击"开始"按钮
- **THEN** 根据配置从 `questions` 表抽取题目，进入答题页 `/quiz/session`

---

### Requirement: 答题交互（翻牌模式）
系统 SHALL 以翻牌（Flashcard）方式进行答题：先显示题干，用户思考后手动翻开查看答案。

#### Scenario: 显示题干
- **WHEN** 答题页加载当前题目
- **THEN** 显示题干（Markdown 渲染），答案区折叠隐藏，显示"查看答案"按钮

#### Scenario: 翻开答案
- **WHEN** 用户点击"查看答案"
- **THEN** 核心答案（Markdown 渲染）展开显示，同时显示标记按钮（✓ 正确 / ✗ 错误 / → 跳过）

#### Scenario: 显示详细解释
- **WHEN** 答案展开后，题目存在详细解释内容
- **THEN** 详细解释（Markdown 渲染，含代码块语法高亮）展示在答案下方

#### Scenario: 显示版本注记
- **WHEN** 答案展开后，题目存在版本注记
- **THEN** 版本注记区显示在解释下方，每条注记以徽章标注变更类型（breaking=红色，fixed=绿色，added=蓝色，deprecated=灰色）

---

### Requirement: 答题结果标记
系统 SHALL 允许用户对每道题标记"正确"、"错误"或"跳过"，并记录至 `quiz_records`。

#### Scenario: 标记正确
- **WHEN** 用户点击"✓ 正确"
- **THEN** `quiz_records` 写入 `result = 'correct'`，自动进入下一题

#### Scenario: 标记错误
- **WHEN** 用户点击"✗ 错误"
- **THEN** `quiz_records` 写入 `result = 'incorrect'`，自动进入下一题

#### Scenario: 跳过题目
- **WHEN** 用户点击"→ 跳过"
- **THEN** `quiz_records` 写入 `result = 'skipped'`，自动进入下一题

---

### Requirement: 会话进度显示
系统 SHALL 在答题过程中展示当前进度。

#### Scenario: 进度指示器
- **WHEN** 用户处于答题页
- **THEN** 顶部显示进度（如"第 3 / 10 题"）及进度条

#### Scenario: 会话完成跳转
- **WHEN** 用户完成最后一题的标记
- **THEN** 自动跳转至结果页 `/quiz/session/result`

---

### Requirement: 答题模式支持
系统 SHALL 支持随机模式和顺序模式，间隔重复模式预留但不在 MVP 实现。

#### Scenario: 随机模式抽题
- **WHEN** 用户选择随机模式开始会话
- **THEN** 从符合条件的题目中随机抽取指定数量，顺序随机

#### Scenario: 顺序模式抽题
- **WHEN** 用户选择顺序模式开始会话
- **THEN** 按题目创建时间顺序抽取，从上次结束位置继续（或从头开始）

#### Scenario: 间隔重复模式占位
- **WHEN** 用户在配置页看到间隔重复选项
- **THEN** 该选项显示为禁用状态，提示"即将推出"
