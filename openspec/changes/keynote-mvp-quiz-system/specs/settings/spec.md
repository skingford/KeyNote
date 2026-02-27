## ADDED Requirements

### Requirement: 全局答题配置
系统 SHALL 提供设置页面，允许用户配置全局答题偏好，并持久化至 `settings` 表。

#### Scenario: 查看设置页
- **WHEN** 用户访问 `/settings`
- **THEN** 显示当前配置值，包含：默认答题模式、每次默认题数、默认 Topic

#### Scenario: 修改答题模式
- **WHEN** 用户将答题模式从"随机"改为"顺序"并保存
- **THEN** `settings` 表中 `quiz_mode` 更新，下次进入 `/quiz` 配置页时预选"顺序"

#### Scenario: 修改默认题数
- **WHEN** 用户将默认题数设置为 20 并保存
- **THEN** `settings` 表中 `questions_per_session` 更新为 20，下次进入配置页时默认显示 20

#### Scenario: 修改默认 Topic
- **WHEN** 用户将默认 Topic 设置为"Golang"并保存
- **THEN** `settings` 表中 `default_topic_id` 更新，下次进入配置页时预选 Golang

---

### Requirement: 设置持久化
系统 SHALL 将用户配置写入 SQLite `settings` 表，以 key-value 形式存储，应用重启后保持。

#### Scenario: 重启后配置保持
- **WHEN** 用户保存设置后重启应用
- **THEN** 上次保存的配置值正确读取，页面呈现与保存时一致

#### Scenario: 默认值兜底
- **WHEN** `settings` 表中某个 key 不存在（如首次启动）
- **THEN** 使用系统默认值：quiz_mode=random，questions_per_session=10，default_topic_id=golang topic 的 id
