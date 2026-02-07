## Context

这是一个全新的技能树知识管理产品，旨在帮助技术人员系统化管理多技术栈知识体系并为面试做准备。产品需要支持 18 个核心能力，涵盖从技能可视化、学习管理到职业发展的完整流程。

**当前状态**：从零开始构建

**关键约束**：
- 需要支持离线使用（本地 SQLite 存储）
- 必须支持云端同步（多设备访问）
- 架构需要高度可扩展（支持动态添加技术栈）
- 用户体验要直观流畅（拖拽、可视化、实时更新）

**技术栈覆盖范围**：AI Agent 工程、编程语言、前端框架、数据库、消息队列、容器技术、Web服务器、英语学习等 8 大领域

## Goals / Non-Goals

**Goals:**
- 构建一个功能完整的技能树管理和职业发展平台
- 实现本地优先的数据存储策略（SQLite + 云同步）
- 提供智能化的学习辅助功能（AI 分析、智能复习、简历生成）
- 支持完整的职业发展周期（学习 → 实践 → 面试 → 求职）
- 确保架构可扩展，便于后续添加新功能和技术栈

**Non-Goals:**
- 不构建在线协作功能（V1 专注个人使用）
- 不实现社交网络功能（不做技能分享社区）
- 不做在线课程平台（只管理学习资源链接）
- 不实现实时视频面试功能（只做面试准备和模拟）

## Decisions

### 1. 架构模式：Web 优先 + 响应式 + 云同步

**决策**：采用 Web 优先架构，使用 IndexedDB（通过 sql.js/wa-sqlite）作为浏览器端存储，配合云端增量同步，响应式设计支持移动端

**理由**：
- **零安装**：用户无需下载安装，浏览器直接访问
- **跨平台**：天然支持所有设备（PC、平板、手机）
- **快速迭代**：Web 部署即时生效，无需用户更新
- **PWA 支持**：通过 Service Worker 实现离线使用
- **响应式**：一套代码适配桌面和移动端

**备选方案**：
- ❌ Electron 桌面应用（安装门槛高，后续再考虑）
- ❌ React Native 移动端（开发成本高，响应式 Web 已满足需求）

**实现要点**：
- 使用 sql.js（SQLite 编译为 WebAssembly）在浏览器中运行 SQLite
- 使用 IndexedDB 持久化 SQLite 数据库文件
- 实现基于时间戳的增量同步机制
- 冲突解决策略：最后写入优先（Last Write Wins）
- PWA + Service Worker 实现离线缓存

### 2. 前端技术栈：React + TypeScript

**决策**：使用 React 18 + TypeScript + Vite 作为前端技术栈

**理由**：
- **生态成熟**：React 拥有最丰富的组件库和工具链
- **类型安全**：TypeScript 提供完整的类型检查，减少运行时错误
- **性能优秀**：React 18 的并发特性适合复杂交互场景
- **团队熟悉度**：React 是最主流的前端框架

**备选方案**：
- ❌ Vue 3（生态相对较小，但也是可行选择）
- ❌ Svelte（编译时优化好，但生态不够成熟）

**技术选型细节**：
- 状态管理：Zustand（轻量级，比 Redux 简单）
- 路由：React Router v6
- UI 组件库：Ant Design 或 shadcn/ui
- 构建工具：Vite（快速的开发体验）
- CSS 方案：Tailwind CSS（响应式设计友好）
- 响应式断点：mobile (<768px)、tablet (768-1024px)、desktop (>1024px)

### 3. 可视化方案：Cytoscape.js

**决策**：使用 Cytoscape.js 作为技能树可视化引擎

**理由**：
- **专为图形设计**：专门用于图形和网络可视化
- **性能强大**：支持大规模节点渲染（1000+ 节点）
- **交互丰富**：内置拖拽、缩放、布局算法
- **可定制性强**：支持自定义节点样式和布局

**备选方案**：
- ❌ D3.js（功能强大但学习曲线陡峭，开发效率低）
- ❌ ECharts Graph（主要用于数据可视化，图形交互较弱）

**布局算法选择**：
- 默认使用 Cola 布局（力导向图，自动避免重叠）
- 支持切换到层次布局（Dagre）用于展示技能依赖关系

### 4. Markdown 编辑器：Monaco Editor

**决策**：使用 Monaco Editor 作为 Markdown 编辑器

**理由**：
- **VS Code 同款**：用户熟悉的编辑体验
- **功能完整**：语法高亮、自动补全、代码片段
- **性能优秀**：支持大文件编辑
- **可扩展**：支持自定义语言和主题

**备选方案**：
- ❌ CodeMirror 6（轻量但功能相对较少）
- ❌ 自研编辑器（开发成本高）

**集成方案**：
- 使用 @monaco-editor/react 封装
- 配置 Markdown 语法高亮和预览
- 集成 Prism.js 用于代码块高亮

### 5. 数据模型设计：关系型 + JSON 混合

**决策**：核心数据使用关系型表结构，灵活数据使用 JSON 字段

**理由**：
- **结构化数据**：技能节点、关系、进度等使用关系表，便于查询和关联
- **灵活数据**：Markdown 内容、元数据使用 JSON，支持动态扩展
- **查询效率**：SQLite 支持 JSON 函数，可以高效查询 JSON 字段

**核心表设计**：
```sql
-- 技能节点表
CREATE TABLE skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  content TEXT,  -- Markdown 内容
  mastery_level INTEGER DEFAULT 0,  -- 0-100
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  metadata TEXT  -- JSON: 标签、图标等
);

-- 技能关系表（依赖关系）
CREATE TABLE skill_relations (
  id TEXT PRIMARY KEY,
  from_skill_id TEXT NOT NULL,
  to_skill_id TEXT NOT NULL,
  relation_type TEXT NOT NULL,  -- 'prerequisite', 'related'
  FOREIGN KEY (from_skill_id) REFERENCES skills(id),
  FOREIGN KEY (to_skill_id) REFERENCES skills(id)
);

-- 学习记录表
CREATE TABLE learning_records (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL,
  study_time INTEGER NOT NULL,  -- 秒
  notes TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- 复习记录表（间隔重复算法）
CREATE TABLE review_records (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL,
  ease_factor REAL DEFAULT 2.5,  -- SM-2 算法参数
  interval INTEGER DEFAULT 1,     -- 复习间隔（天）
  repetitions INTEGER DEFAULT 0,  -- 重复次数
  next_review_date INTEGER NOT NULL,
  last_review_date INTEGER,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);

-- 工作经历表
CREATE TABLE work_experiences (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date INTEGER NOT NULL,
  end_date INTEGER,
  description TEXT,
  achievements TEXT,  -- JSON 数组
  tech_stack TEXT,    -- JSON 数组：使用的技术栈
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 简历表
CREATE TABLE resumes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  content TEXT NOT NULL,  -- JSON: 简历内容
  generated_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- 学习资源表
CREATE TABLE learning_resources (
  id TEXT PRIMARY KEY,
  skill_id TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'link', 'code', 'note', 'project'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  url TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (skill_id) REFERENCES skills(id)
);
```

### 6. 智能复习算法：SM-2 算法

**决策**：使用 SuperMemo 2 (SM-2) 算法实现间隔重复复习

**理由**：
- **经过验证**：Anki 等知名应用使用的算法
- **简单有效**：算法简单，易于实现和调试
- **适应性强**：根据用户反馈动态调整复习间隔

**算法核心**：
```typescript
function calculateNextReview(
  quality: number,  // 0-5，用户评分
  easeFactor: number,
  interval: number,
  repetitions: number
): { newEaseFactor: number; newInterval: number; newRepetitions: number } {
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  let newInterval: number;
  let newRepetitions: number;

  if (quality < 3) {
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions = repetitions + 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
  }

  return { newEaseFactor, newInterval, newRepetitions };
}
```

**备选方案**：
- ❌ Leitner 系统（过于简单，效果不如 SM-2）
- ❌ SM-17/18（过于复杂，实现成本高）

### 7. AI 集成方案：多模型支持

**决策**：支持多个 LLM 提供商，用户可自由选择

**理由**：
- **灵活性**：不绑定单一提供商
- **成本优化**：用户可选择性价比高的模型
- **功能互补**：不同模型擅长不同任务

**支持的模型**：
- Claude（Anthropic）：擅长长文本分析和结构化输出
- GPT-4（OpenAI）：通用能力强
- Gemini（Google）：多模态能力
- 本地模型（Ollama）：隐私保护，离线可用

**AI 功能实现**：
```typescript
interface AIProvider {
  analyzeJobRequirement(text: string): Promise<SkillRequirement[]>;
  generateLearningPath(skills: Skill[], target: JobRequirement): Promise<LearningPath>;
  optimizeResume(resume: Resume, job: JobRequirement): Promise<ResumeSuggestions>;
  extractTechStack(text: string): Promise<string[]>;
}

class ClaudeProvider implements AIProvider {
  // 实现具体的 AI 调用逻辑
}
```

### 8. 云同步方案：增量同步 + 冲突解决

**决策**：实现基于时间戳的增量同步机制

**理由**：
- **节省带宽**：只同步变更的数据
- **提升速度**：减少同步时间
- **降低成本**：减少云存储和流量费用

**同步策略**：
```typescript
interface SyncRecord {
  tableName: string;
  recordId: string;
  operation: 'insert' | 'update' | 'delete';
  timestamp: number;
  data: any;
}

// 同步流程
async function syncToCloud() {
  // 1. 获取本地最后同步时间戳
  const lastSyncTime = await getLastSyncTime();

  // 2. 查询本地变更记录
  const localChanges = await getLocalChanges(lastSyncTime);

  // 3. 上传到云端
  await uploadChanges(localChanges);

  // 4. 下载云端变更
  const remoteChanges = await downloadChanges(lastSyncTime);

  // 5. 应用远程变更（处理冲突）
  await applyRemoteChanges(remoteChanges);

  // 6. 更新同步时间戳
  await updateLastSyncTime(Date.now());
}

// 冲突解决：Last Write Wins
function resolveConflict(local: SyncRecord, remote: SyncRecord): SyncRecord {
  return local.timestamp > remote.timestamp ? local : remote;
}
```

**云存储选择**：
- 优先支持：AWS S3 / 阿里云 OSS
- 备选：Supabase Storage / Firebase Storage

### 9. 简历生成方案：模板引擎 + 实时渲染

**决策**：使用 Handlebars 模板引擎 + Puppeteer 生成 PDF

**理由**：
- **模板灵活**：Handlebars 语法简单，易于定制
- **实时预览**：HTML 渲染快速，用户可实时查看效果
- **高质量输出**：Puppeteer 生成的 PDF 质量高

**实现流程**：
```typescript
// 1. 定义简历数据结构
interface ResumeData {
  personalInfo: PersonalInfo;
  skills: Skill[];
  workExperiences: WorkExperience[];
  projects: Project[];
  education: Education[];
}

// 2. 渲染模板
function renderResume(template: string, data: ResumeData): string {
  const compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(data);
}

// 3. 生成 PDF
async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: 'A4' });
  await browser.close();
  return pdf;
}
```

**模板系统**：
- 提供 3-5 个预设模板（技术型、管理型、简约型等）
- 支持用户自定义模板（HTML + CSS）
- 模板变量自动从技能树和工作经历提取

### 10. 数据可视化方案：ECharts

**决策**：使用 ECharts 实现数据分析图表

**理由**：
- **功能丰富**：支持多种图表类型
- **性能优秀**：Canvas 渲染，支持大数据量
- **中文友好**：文档完善，社区活跃
- **主题定制**：支持自定义主题

**图表类型**：
- 学习时间统计：柱状图 / 折线图
- 技能掌握度：雷达图
- 技能热力图：日历热力图
- 技能分布：饼图 / 树图

## Risks / Trade-offs

### [风险] SQLite 并发写入限制
**影响**：多个进程同时写入可能导致锁等待

**缓解措施**：
- 使用 WAL 模式提升并发性能
- 实现写入队列，串行化写操作
- 设置合理的超时时间（5秒）

### [风险] 云同步冲突
**影响**：多设备同时编辑可能导致数据冲突

**缓解措施**：
- 采用 Last Write Wins 策略
- 记录冲突日志，允许用户手动解决
- 提供版本历史功能，可回滚到之前版本

### [风险] AI API 成本
**影响**：频繁调用 AI API 可能产生高额费用

**缓解措施**：
- 实现请求缓存，相同输入返回缓存结果
- 提供本地模型选项（Ollama）
- 限制 API 调用频率（每分钟最多 10 次）

### [风险] 大规模技能树性能
**影响**：技能节点超过 1000 个时可能出现渲染卡顿

**缓解措施**：
- 实现虚拟滚动和按需加载
- 使用 Web Worker 处理布局计算
- 提供筛选和折叠功能，减少可见节点数

### [权衡] 离线功能 vs 实时协作
**决策**：优先离线功能，暂不支持实时协作

**理由**：
- V1 专注个人使用场景
- 实时协作需要复杂的 CRDT 算法
- 可在后续版本中添加

### [权衡] 功能完整性 vs 开发周期
**决策**：采用 MVP 策略，分阶段实现功能

**优先级**：
- P0（MVP）：技能树可视化、知识管理、Markdown 支持、进度跟踪
- P1（V1.1）：智能复习、数据分析、AI 职位分析
- P2（V1.2）：工作经历、简历生成、英语学习
- P3（V2.0）：社交功能、协作功能

## Migration Plan

### 部署策略

**Web 应用（V1 优先）**：
- 部署到 Vercel / Netlify
- 使用 sql.js（SQLite WebAssembly）在浏览器中运行
- 使用 IndexedDB 持久化数据库文件
- PWA 支持，可离线使用
- 响应式设计，适配桌面和移动端
- 移动端通过"添加到主屏幕"获得类原生体验

**桌面应用（V2 可选）**：
- 使用 Electron 打包为桌面应用
- 使用原生 SQLite（better-sqlite3）
- 自动更新机制（electron-updater）

### 数据迁移

**初始化**：
- 首次访问时在浏览器中初始化 sql.js 数据库
- 将数据库文件持久化到 IndexedDB
- 导入预设的技术栈模板
- 引导用户完成基础设置

**版本升级**：
- 使用数据库版本号管理 schema 变更
- 提供自动迁移脚本
- 升级前自动备份数据

### 回滚策略

**数据备份**：
- 每次同步前自动备份本地数据库
- 保留最近 7 天的备份
- 支持手动导出完整数据

**版本回滚**：
- 保留旧版本安装包
- 提供版本切换功能
- 数据格式向后兼容

## Open Questions

1. **云存储提供商选择**：AWS S3 vs 阿里云 OSS vs Supabase？
   - 需要考虑成本、可靠性、国内访问速度

2. **AI 模型默认选择**：Claude vs GPT-4 vs Gemini？
   - 需要测试各模型在职位分析和简历优化上的表现

3. **多语言支持**：是否需要支持英文界面？
   - V1 先支持中文，V2 考虑国际化

4. **数据导入**：是否支持从其他平台导入数据（如 LinkedIn、GitHub）？
   - 可以作为增强功能，优先级较低
