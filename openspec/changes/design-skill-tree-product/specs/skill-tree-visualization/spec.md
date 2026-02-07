## ADDED Requirements

### Requirement: Display skill tree as interactive graph
系统必须将技能树以交互式图形方式展示，支持节点和边的可视化。

#### Scenario: View skill tree
- **WHEN** 用户打开技能树页面
- **THEN** 系统显示所有技能节点和它们之间的关系连线

#### Scenario: Zoom and pan
- **WHEN** 用户使用鼠标滚轮或触控板
- **THEN** 系统支持缩放和平移画布

### Requirement: Show skill node details
系统必须在节点上显示技能的关键信息。

#### Scenario: Display node information
- **WHEN** 用户查看技能节点
- **THEN** 系统在节点上显示技能名称、掌握度百分比和图标

#### Scenario: Hover to see more details
- **WHEN** 用户将鼠标悬停在节点上
- **THEN** 系统显示包含技能描述和学习时间的工具提示

### Requirement: Visualize skill relationships
系统必须清晰展示技能之间的依赖和关联关系。

#### Scenario: Show prerequisite relationships
- **WHEN** 技能A是技能B的前置要求
- **THEN** 系统用箭头从A指向B，并标注为"prerequisite"

#### Scenario: Show related skills
- **WHEN** 两个技能相关但无依赖关系
- **THEN** 系统用虚线连接两个节点，标注为"related"

### Requirement: Support hierarchical layout
系统必须支持按层次结构组织技能树。

#### Scenario: Display skills by level
- **WHEN** 用户选择层次布局
- **THEN** 系统按技能难度级别（初级/中级/高级/专家）分层显示

#### Scenario: Collapse and expand categories
- **WHEN** 用户点击技术栈分类节点
- **THEN** 系统折叠或展开该分类下的所有技能节点

### Requirement: Drag and rearrange nodes
系统必须允许用户拖拽节点调整位置。

#### Scenario: Move node position
- **WHEN** 用户拖拽技能节点
- **THEN** 系统更新节点位置并保存布局

#### Scenario: Auto-layout after drag
- **WHEN** 用户释放拖拽的节点
- **THEN** 系统自动调整相关节点位置避免重叠

### Requirement: Filter and search skills
系统必须支持筛选和搜索技能节点。

#### Scenario: Search by name
- **WHEN** 用户在搜索框输入"React"
- **THEN** 系统高亮显示所有包含"React"的技能节点

#### Scenario: Filter by category
- **WHEN** 用户选择"前端框架"分类
- **THEN** 系统只显示前端框架相关的技能节点

#### Scenario: Filter by mastery level
- **WHEN** 用户选择"掌握度 < 50%"
- **THEN** 系统只显示掌握度低于50%的技能节点

### Requirement: Highlight skill paths
系统必须能够高亮显示技能学习路径。

#### Scenario: Show learning path to target skill
- **WHEN** 用户选择目标技能"Kubernetes"
- **THEN** 系统高亮显示从当前技能到Kubernetes的推荐学习路径

#### Scenario: Display multiple paths
- **WHEN** 存在多条学习路径
- **THEN** 系统显示所有可能路径并标注推荐度

### Requirement: Color code by mastery level
系统必须使用颜色编码表示技能掌握程度。

#### Scenario: Display mastery colors
- **WHEN** 用户查看技能树
- **THEN** 系统使用渐变色表示掌握度（红色0% → 黄色50% → 绿色100%）

#### Scenario: Update colors in real-time
- **WHEN** 用户更新技能掌握度
- **THEN** 系统立即更新节点颜色
