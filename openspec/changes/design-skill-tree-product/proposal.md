## Why

作为技术人员，需要系统化地管理和展示自己在多个技术栈（AI Agent 工程、后端语言、前端框架、数据库、消息队列、容器技术、Web服务器等）的知识体系，并为面试做好充分准备。当前缺乏一个能够可视化技能关系、跟踪学习进度、支持灵活扩展、并针对面试场景优化的工具。

## What Changes

构建一个技能树知识管理产品，包含以下核心功能：
- 可视化技能树图谱，展示技术栈之间的关系和依赖
- 多技术栈知识点管理系统，初期覆盖：
  - **AI Agent 工程**：
    - LLM 基础（Foundation Models、Transformer、Context Window）
    - Prompt Engineering（提示工程、Few-Shot Learning）
    - RAG（检索增强生成）
    - Vector Databases（Pinecone、Weaviate、Chroma）
    - Embedding Models（嵌入模型）
    - Agent Frameworks（LangChain、LangGraph、AutoGPT）
    - Function Calling / Tool Use
    - Agent Memory Systems
    - LLMOps（LLM 运维）
    - **AI 工具平台**：Claude、OpenAI Codex、Gemini、Cursor、Antigravity
  - 编程语言：Go、Rust、Python
  - 前端框架：Vue、React、Next.js、Svelte
  - 数据库：PostgreSQL、MongoDB、MySQL、Redis、SQLite
  - 消息队列：Kafka、EMQX
  - 容器技术：Docker、Kubernetes (k8s)
  - Web服务器：Nginx
  - **英语学习**：技术英语词汇、文档阅读、面试英语
- **可扩展架构**：支持后续随时添加新的技术栈和知识点
- **Markdown 内容支持**：知识点内容支持 Markdown 格式，包括代码块、列表、表格、链接等，方便编写技术文档和笔记
- **学习资源管理**：为每个技能点添加学习资源链接、代码片段、项目关联和学习笔记
- **智能复习系统**：基于间隔重复算法的智能复习提醒，自动识别薄弱点并生成每日复习计划
- **数据分析可视化**：学习时间统计、掌握度趋势图、技能热力图、技能雷达图等多维度数据展示
- **AI职位分析**：从招聘网站（如Boss直聘）复制职位信息，AI自动解析技能要求，生成对应的技能树和学习路径
- **职业发展规划**：职业路径规划、技能差距分析、薪资趋势参考、公司技术栈匹配
- **工作经历时间线**：按时间线记录工作经历、项目经验、使用的技术栈，与技能树自动关联
- **智能简历生成**：基于技能树和工作经历实时生成简历，支持多种模板，自动更新，导出为 PDF/Word
- 学习进度跟踪和掌握度评估
- 面试准备模式，包含常见面试题和知识点复习
- 技能标签和分类系统
- 知识点搜索和过滤功能
- **数据同步和导出**：云端数据同步、多设备支持、数据导出（JSON/Markdown/PDF）、版本历史

## Capabilities

### New Capabilities
- `skill-tree-visualization`: 技能树的可视化展示，支持节点关系、依赖路径、技能分层等图形化呈现
- `knowledge-management`: 知识点的增删改查，支持多技术栈分类、标签系统、内容编辑
- `markdown-content-support`: Markdown 内容编辑和渲染，支持代码高亮、语法检查、实时预览、导入导出等功能
- `learning-resource-management`: 学习资源管理，支持资源链接收藏、代码片段库、项目关联、学习笔记系统
- `intelligent-review-system`: 智能复习系统，基于间隔重复算法（艾宾浩斯遗忘曲线）的复习提醒、薄弱点识别、每日复习计划生成
- `data-analytics-visualization`: 数据分析和可视化，包括学习时间统计、掌握度趋势图、技能热力图、技能雷达图等多维度展示
- **extensible-tech-stack**: 可扩展的技术栈架构，支持动态添加新的技术领域、框架和工具，无需修改核心代码
- `ai-tools-integration`: AI 工具平台集成和学习，包括 Claude、OpenAI Codex、Gemini、Cursor、Antigravity 等主流 AI 工具的使用技巧和最佳实践
- `job-requirement-analysis`: AI驱动的职位需求分析，从招聘信息中提取技能要求，映射到技能树，生成技能差距报告和学习路径
- `career-development-planning`: 职业发展规划，包括职业路径规划、技能差距分析、薪资趋势参考、公司技术栈匹配
- `work-experience-timeline`: 工作经历时间线管理，记录工作经历、项目经验、技术栈使用情况，自动与技能树关联
- `intelligent-resume-generator`: 智能简历生成器，基于技能树和工作经历实时生成简历，支持多种模板、自动更新、导出为 PDF/Word/Markdown
- `english-learning`: 英语学习模块，包括技术英语词汇库、技术文档阅读练习、面试英语准备、英语水平跟踪
- `progress-tracking`: 学习进度跟踪，记录每个知识点的掌握程度、学习时间、复习次数
- `interview-prep-mode`: 面试准备功能，包含面试题库、知识点快速复习、模拟面试场景
- `tech-stack-categorization`: 技术栈分类管理，支持按语言、框架、工具、领域等维度组织知识点
- `search-and-filter`: 搜索和过滤功能，快速定位特定技术栈或知识点
- `data-sync-export`: 数据同步和导出，支持云端同步、多设备访问、数据导出（JSON/Markdown/PDF）、版本历史记录

### Modified Capabilities
<!-- 无现有能力需要修改 -->

## Impact

- **新产品**: 从零开始构建全新的技能树管理系统
- **技术选型**: 需要选择前端框架（React/Vue/Svelte）、可视化库（D3.js/Cytoscape.js）、Markdown 编辑器（Monaco Editor/CodeMirror）、图表库（ECharts/Chart.js）、简历模板引擎、PDF生成库（jsPDF/Puppeteer）、后端技术栈
- **数据持久化**: 使用 SQLite 作为本地数据库，支持离线使用和快速查询，同时支持云端同步
- **AI集成**: 需要集成AI能力（如LLM API）用于职位信息解析、技能提取、学习路径推荐、简历优化建议
- **Markdown 处理**: 需要集成 Markdown 解析器、代码高亮库（Prism.js/Highlight.js）、渲染引擎
- **数据模型**: 设计技能节点、关系、进度、标签、资源链接、复习记录、工作经历、项目经验、简历数据等数据结构，需要支持灵活的扩展机制和 Markdown 内容存储
- **算法实现**: 实现间隔重复算法（SM-2/Anki算法）、技能推荐算法、数据分析算法、简历内容智能匹配算法
- **云服务**: 需要云存储服务用于数据同步、备份和多设备访问，支持 SQLite 数据库的增量同步
- **用户体验**: 需要设计直观的交互界面，支持拖拽、缩放、搜索、文本粘贴、Markdown 编辑、数据可视化、时间线展示、简历预览等操作
- **可扩展性**: 架构设计需要考虑后续添加新技术栈的便利性，避免硬编码技术分类
