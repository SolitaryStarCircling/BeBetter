# BeBetter 任务清单

项目路线图与进度记录，`[x]` 表示已完成、`[ ]` 表示待办。

## 阶段 0：项目初始化与基础设施 ✅
- [x] 用 Expo + TypeScript（SDK 57）初始化项目骨架
- [x] 配置 Expo Router（文件式路由，src 根 + (tabs) 布局）
- [x] 安装并配置 Zustand、AsyncStorage、expo-blur、expo-router
- [x] 配置 tsconfig（含 `@/*`、`@assets/*` 别名）、metro、babel
- [x] 创建文档骨架（README/TODO/CHANGELOG/NOTES/QUESTION_FORMAT/DESIGN）

## 阶段 1：题库归一化与数据层 ✅
- [x] 编写 `scripts/normalize.mjs`，将三份源题库统一转换（兼容纯数组 / `{meta,questions}`）
- [x] 高数 / 英语 / 政治三份题库 → 各归一化为 300 题输出到 `assets/questions/{subjectId}.json`
- [x] 编写 `assets/subjects.json` 科目配置（政治/英语/高数，含备用 C 语言）
- [x] 定义题目 / 科目 / 进度 TypeScript 类型

## 阶段 2：状态管理与持久化 ✅
- [x] Zustand store：useSettingsStore / useProgressStore / useWrongStore
- [x] AsyncStorage 持久化：刷题进度、错题本、设置
- [x] 错题记录（addWrong / resolveWrong / getWrongs）
- [x] 进度统计（正确率、已完成数）

## 阶段 3：毛玻璃组件库与主题 ✅
- [x] 毛玻璃基础组件：GlassCard / GlassButton / GlassModal / GlassTabBar
- [x] 深色主题颜色系统与科目强调色（src/constants/）
- [x] Android 降级方案（半透明 + 边框高光，GlassCard 内建分支）
- [x] 动效：卡片按压反馈、页面切换

## 阶段 4：刷题主流程 ✅
- [x] 首页：科目卡片、进度概览、继续练习 → 科目详情
- [x] 科目详情：顺序 / 随机 / 错题 三种模式、进度统计
- [x] 刷题页：单选 / 多选 / 判断（自动判分 + 解析 + 对错变色）
- [x] 刷题页：简答 / 论述 / 材料（「查看参考答案」+「我掌握了/没掌握」自评，不自动判分）
- [x] 答题反馈与解析展示（Explanation）
- [x] 答错 / 自评「没掌握」自动入错题本

## 阶段 5：错题复习与统计 ✅
- [x] 错题本列表（按科目切换、显示题型/难度/题干、点此重做）
- [x] 统计页（总做题数、答对数、总正确率、各科进度条）
- [x] 设置页：深浅主题 / 清除进度 / 清除错题（二次确认弹窗）/ 关于

## 阶段 6：v0.2.0 打磨 ✅
- [x] 错题本「答对 3 次可移除」（任意模式答对累计，答错清零，累计 3 次自动移除）
- [x] 练习完成小结页（答对 X/Y、正确率、重做错题 / 返回首页）
- [x] 版本号统一 0.2.0（package.json / app.json / 关于页动态读取，Android versionCode=2）
- [x] 首页「继续上次练习」快捷入口（接线 lastSubjectId）
- [x] 移除死设置项 fontSize

## 阶段 7：真题模考 ✅（v0.3.0）
- [x] 真题独立科目「高数真题」（`assets/questions/math-real.json`，`chapter` = `{年份}年真题`）
- [x] 题型扩展 `计算` / `综合`（走主观自评，不自动判分）
- [x] 数据服务 `getPaperYears()` / `getQuestionsByYear(year)`
- [x] 年份选择页 `app/paper/index.tsx`（年份 + 题量 + 已做进度）
- [x] 练习页支持 `year` 参数（整卷·原卷顺序），标题「{year}年真题模考」
- [x] 首页「真题模考」入口卡片；`app/_layout.tsx` 注册 `paper/index`
- [x] 校验脚本 `scripts/check-bank.mjs`
- [x] 整卷数据：2021 / 2020 / 2019 / 2018 / 2017 / 2016 / 2015 / 2014 年整卷各 20 题

## 阶段 8：政治真题模考 ✅（2026-10-10）
- [x] 政治真题独立科目「政治真题」（`assets/questions/politics-real.json`，`chapter` = `{年份}年真题`）
- [x] 整卷录入 **2015–2025 共 11 套**，各卷 37 题（单选20+多选10+辨析2+问答3+论述1+材料1），合计 **407 题**，保持原卷题序
- [x] 源卷为扫描件（无文字层），逐页视觉转录；客观题答案取自原卷答案表，主观题录入参考答案全文
- [x] 辨析题映射为 `简答`（`tags` 首项 `辨析题`），沿用现有自评逻辑，未新增判分代码
- [x] 从各年真题择优提取 **55 题**编入 `politics.json`（`politics-301`~`politics-355`，`tags` 含 `{年份}年真题`），`politics.total` 300 → 355
- [x] `subjects.json` 新增 `politics-real`、`questionService` 注册题库
- [x] `docs/QUESTION_FORMAT.md` 新增「政治真题整卷约定」章节

## 真题补录进度
### 整卷进真题模考（`math-real.json`）
- [x] 2020 年真题整卷
- [x] 2019 年真题整卷
- [x] 2018 年真题整卷
- [x] 2017 年真题整卷
- [x] 2016 年真题整卷
- [x] 2015 年真题整卷
- [x] 2014 年真题整卷

### 择优拆分进高数练习库（`math.json`，`chapter` = `{年份}年真题`，`tags` 含年份）
> 策略：仅挑选有价值的题（剔除纯背诵、单步送分题），逐年推进
- [x] 2013 年（挑 18 题，剔除单选 1 等价无穷小、填空 6 单步连续性极限）
- [x] 2012 年（挑 18 题，剔除单选 3 基础重要极限、填空 9 基础广义积分）
- [ ] 2011 年及更早（按需）

### 整卷进真题模考（`english-real.json`，`chapter` = `{年份}年真题`）
- [x] 2022 年整卷（46 题，新题型）
- [x] 2021 年整卷（66 题，扫描图视觉转录）
- [x] 2020 年整卷（66 题，扫描图视觉转录）
- [x] 2019 年整卷（66 题，答案取自原卷答案表、解析为转录时补写）
- [x] 2018 年整卷（66 题）
- [x] 2017 年整卷（66 题）
- [x] 2016 年整卷（66 题）
- [x] 2015 年整卷（66 题）
- [x] 2014 年整卷（76 题）
- [x] 2013 年整卷（76 题）
- [ ] 2005–2012 年（暂缺，按需补录）

### 择优拆分进英语练习库（`english.json`，`chapter` = `语法`，`tags` 含年份）
- [x] 2013–2019 年共挑 30 题语法单选（`english-301`~`english-330`）

## 阶段 9：刷题闭环补强 ✅（v0.4.0）
- [x] **章节练习**：科目详情「章节目录」由只读改为可点击，右侧显示「已做/总数」，点击按章刷题（`practice` 新增 `chapter` 参数，标题显示章节名）
- [x] 数据服务新增 `getScopedQuestions(subjectId, { chapter, year })` / `getQuestionsByIds(subjectId, ids)`，练习页与首页续练共用同一取题逻辑
- [x] **断点续练**：`Settings.lastSubjectId` 重构为 `lastPosition`（含 `subjectId/mode/questionId/chapter/year`），练习中每次切题写入；首页「继续上次练习」改为直接进入练习并定位上次那题，文案显示「上次练到 第 N 题」
- [x] 历史缓存迁移：旧快照无 `lastPosition` 时 rehydrate 补 `null`，不崩、无需清缓存
- [x] **结果页「重做错题」口径修正**：由「全科未解决错题」改为只重做本次练习的错题（`practice` 新增 `ids` 参数）；科目详情的「错题练习」仍为全科错题
- [x] **结果页本次错题清单**：列出本次答错的题目（题干 + 题型标签），点单题直接从该题重做；标题按章节模式显示「章节练习」

## 阶段 10：体验补强与版本号修复 ✅（v0.5.0）
- [x] **修复打包版本号不生效**：`android/app/build.gradle` 的 `versionCode`/`versionName` 为 prebuild 写死值，改 `app.json` 不同步；统一为 0.5.0 / versionCode 6（build.gradle、app.json、package.json、about.tsx 兜底值四处对齐）
- [x] 练习页顶部进度条（位置可视化，题号文字不重复）
- [x] 练习页「退出」二次确认弹窗（防误触丢失进度）
- [x] 错题本「重做本科全部错题」一键重做按钮

## 未来可选（暂不做）
- [ ] 新增 C 语言科目题库（只需加 c.json + subjects.json 一条）
- [ ] 填空 / 编程题交互
- [ ] 收藏夹、笔记
- [ ] 每日一练、复习计划
- [ ] 薄弱章节分析（统计页按 chapter 维度正确率）
- [ ] 真题模考计时器
- [ ] 练习页进度条 / 题号跳转
- [ ] AI 解析、AI 出题
- [ ] 真题按知识点分类练习（跨年份，用 `tags` 维度）