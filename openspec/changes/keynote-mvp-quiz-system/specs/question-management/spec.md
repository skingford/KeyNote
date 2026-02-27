## ADDED Requirements

### Requirement: 创建题目
系统 SHALL 允许用户通过表单手动创建题目，支持 Markdown 内容编辑。

#### Scenario: 提交有效题目
- **WHEN** 用户填写题干、核心答案，选择 Topic 和类型，点击"保存"
- **THEN** 题目写入 `questions` 表，跳转至题目详情页，显示成功提示

#### Scenario: 题干为空时阻止提交
- **WHEN** 用户未填写题干，点击"保存"
- **THEN** 表单显示校验错误，不提交

#### Scenario: 答案为空时阻止提交
- **WHEN** 用户未填写核心答案，点击"保存"
- **THEN** 表单显示校验错误，不提交

---

### Requirement: 题目字段完整性
系统 SHALL 支持题目包含以下字段：题干（Markdown）、核心答案（Markdown）、详细解释（Markdown，可选）、题目类型、难度等级、所属 Topic、标签。

#### Scenario: 选择题类型
- **WHEN** 用户选择题目类型为"选择题"
- **THEN** 表单显示选项输入区，至少需要 2 个选项，并标记正确选项

#### Scenario: 简答题类型
- **WHEN** 用户选择题目类型为"简答题"
- **THEN** 表单只显示题干和答案输入区，无选项区

#### Scenario: 难度设置
- **WHEN** 用户设置难度为 1-5 中的任意值
- **THEN** 题目保存时 `difficulty` 字段记录对应值

---

### Requirement: 版本注记管理
系统 SHALL 允许在题目上附加一条或多条版本注记，说明不同技术版本下的行为差异。

#### Scenario: 添加版本注记
- **WHEN** 用户填写版本号（如"1.22"）、变更类型（fixed/added/breaking/deprecated）、说明文本，点击添加
- **THEN** 注记写入 `question_version_notes` 表，与该题目关联

#### Scenario: 删除版本注记
- **WHEN** 用户点击某条版本注记的删除按钮并确认
- **THEN** 对应记录从 `question_version_notes` 表删除

#### Scenario: Breaking 类型注记高亮
- **WHEN** 题目详情页渲染版本注记
- **THEN** `change_type = 'breaking'` 的注记以红色警示样式展示，其余类型用对应颜色区分

---

### Requirement: 编辑题目
系统 SHALL 允许用户编辑已有题目的所有字段。

#### Scenario: 进入编辑页
- **WHEN** 用户在题目详情页点击"编辑"按钮
- **THEN** 跳转至编辑表单，各字段预填充当前值

#### Scenario: 保存编辑
- **WHEN** 用户修改内容后点击"保存"
- **THEN** `questions` 表对应记录更新，跳转回详情页

---

### Requirement: 删除题目
系统 SHALL 允许用户删除题目，并级联清理关联数据。

#### Scenario: 确认删除
- **WHEN** 用户点击"删除"按钮并在确认弹窗中确认
- **THEN** `questions`、`question_version_notes`、`question_tags` 中该题目的所有记录删除，跳转至题库列表

#### Scenario: 取消删除
- **WHEN** 用户点击"删除"后在确认弹窗中取消
- **THEN** 题目保持不变，弹窗关闭

---

### Requirement: 题库列表与搜索
系统 SHALL 提供题库列表页，支持按 Topic、标签、难度筛选，以及全文关键词搜索。

#### Scenario: 列表展示
- **WHEN** 用户访问 `/questions`
- **THEN** 显示当前 Topic 下所有题目列表，每项显示题干摘要、难度、标签、创建时间

#### Scenario: 关键词搜索
- **WHEN** 用户在搜索框输入关键词
- **THEN** 列表实时过滤，仅显示题干或答案中包含该关键词的题目

#### Scenario: 按难度筛选
- **WHEN** 用户选择难度过滤条件
- **THEN** 列表只显示对应难度的题目

#### Scenario: Markdown 实时预览
- **WHEN** 用户在编辑器中输入 Markdown 内容
- **THEN** 右侧预览区实时渲染，包括代码块语法高亮
