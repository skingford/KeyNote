## ADDED Requirements

### Requirement: Sync data to cloud
系统必须支持将本地数据同步到云端。

#### Scenario: Upload local changes
- **WHEN** 用户点击"同步"按钮
- **THEN** 系统上传所有本地变更到云端存储

#### Scenario: Incremental sync
- **WHEN** 执行同步操作
- **THEN** 系统只上传自上次同步后的变更数据

### Requirement: Download cloud data
系统必须支持从云端下载数据。

#### Scenario: Fetch remote changes
- **WHEN** 用户在新设备登录
- **THEN** 系统下载所有云端数据到本地

#### Scenario: Merge remote updates
- **WHEN** 云端有新的变更
- **THEN** 系统下载并合并到本地数据库

### Requirement: Resolve sync conflicts
系统必须处理数据同步冲突。

#### Scenario: Apply last write wins
- **WHEN** 同一数据在多设备被修改
- **THEN** 系统保留最后修改的版本

#### Scenario: Notify user of conflicts
- **WHEN** 检测到冲突
- **THEN** 系统显示冲突通知并记录日志

### Requirement: Export data in multiple formats
系统必须支持多种格式的数据导出。

#### Scenario: Export as JSON
- **WHEN** 用户选择导出JSON
- **THEN** 系统生成包含所有数据的JSON文件

#### Scenario: Export as Markdown
- **WHEN** 用户选择导出Markdown
- **THEN** 系统将技能树和笔记导出为Markdown文件

#### Scenario: Export as PDF
- **WHEN** 用户选择导出PDF
- **THEN** 系统生成包含技能树可视化的PDF报告

### Requirement: Maintain version history
系统必须保存数据版本历史。

#### Scenario: Auto-save versions
- **WHEN** 用户进行重要修改
- **THEN** 系统自动创建版本快照

#### Scenario: Restore from history
- **WHEN** 用户选择恢复到历史版本
- **THEN** 系统回滚数据到指定时间点

### Requirement: Support offline mode
系统必须支持离线使用。

#### Scenario: Work without internet
- **WHEN** 设备离线
- **THEN** 系统继续正常工作并记录本地变更

#### Scenario: Auto-sync when online
- **WHEN** 设备重新联网
- **THEN** 系统自动同步离线期间的变更
