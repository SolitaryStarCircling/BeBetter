# 变更日志

## [0.5.0]

### 修复
- **打包版本号不生效**：`android/app/build.gradle` 里的 `versionCode` / `versionName` 是 `expo prebuild` 时写死的，只改 `app.json` 不会同步到原生产物，因此此前打出的 APK 系统信息仍显示 0.3.0。现统一为 **0.5.0 / versionCode 6**，四处对齐：`android/app/build.gradle`、`app.json`、`package.json`、`app/about.tsx` 的兜底版本号（Android 端 `Constants.expoConfig` 为空，About 页显示的是该兜底值）

### 新增
- **练习页顶部进度条**：顶栏下方新增全宽进度条，当前题位置可视化（题号文字仍由 `QuestionCard` 承担，不重复）
- **练习页「退出」二次确认**：点退出弹 `GlassModal` 确认，避免误触丢失当前进度；文案提示进度已自动保存、可从首页续练
- **错题本「重做本科全部错题」**：错题本新增一键重做按钮，复用 `practice` 的 `ids` 参数，仅按当前科目错题列表顺序重做

## [0.4.0]

### 刷题闭环补强
- **章节练习**：科目详情页「章节目录」由只读列表改为可点击入口——每行显示该章「已做/总数」，点击进入按章刷题（`/practice/[subjectId]?mode=order&chapter=...`），顶栏标题显示章节名（过长截断）
- **数据服务统一取题**：新增 `getScopedQuestions(subjectId, { chapter, year })`（year 优先 → chapter 过滤 → 全量）与 `getQuestionsByIds(subjectId, ids)`（按 id 顺序取题），练习页与首页续练共用，消除各处重复筛选逻辑
- **断点续练**：`Settings.lastSubjectId` 重构为 `lastPosition: { subjectId, mode, questionId, chapter, year }`；练习中每次切题记录当前位置，首页「继续上次练习」由「跳科目详情」改为**直接进入练习并定位上次那题**，副标题显示「科目 · 第 N 题」
- 兼容历史缓存：旧快照只有 `lastSubjectId`、无 `lastPosition`，rehydrate 时补 `null`，升级后不崩、无需清缓存（首次练习即恢复续练卡）
- **结果页「重做错题」口径修正**：此前按钮写「重做错题(N)」但实际打开的是**全科所有未解决错题**；现改为只重做**本次练习答错**的题目（`practice` 新增 `ids` 参数，按答错顺序取题）。科目详情页的「错题练习」仍保持「全科错题」语义，不受影响
- **结果页新增「本次答错 N 题」清单**：列出本次答错题的题干与题型标签，点单题直接从该题重做；结果页标题在章节模式下显示「{章节} · 章节练习」
- `useSessionStore` 新增 `chapter` 字段，供结果页标题使用

- **政治真题按最新教材修正 4 处源卷问题**（`assets/questions/politics-real.json`）：
  - `politics-real-2018-10` 单选「社会主义的根本任务是」：原卷答案表为 B（解放生产力），与现行教材「解放和发展生产力」不符 → **答案改为 D**，解析重写
  - `politics-real-2023-29` 多选选项 D：原卷印作「中华文化和中国精神的时代精神」→ **按十九大报告 / 十九届六中全会决议 / 二十大报告修正为「时代精华」**
  - `politics-real-2022-33` 简答「坚持党的群众路线」：原卷答案页误印为第 34 题答案 → **参考答案按现行教材通行表述补全**，错印说明移入 `explanation`
  - `politics-real-2023-12` 单选：原卷扫描件缺失 B/C/D 选项 → **按现行教材补齐选项**（答案 C 与教材一致）
  - 分值标注不一致、题干/序号印刷瑕疵等**非教材内容问题**保留原样，仅在 `explanation` 注明（详见 NOTES.md）

- 新增真题科目「政治真题」（`assets/questions/politics-real.json`，`kind: "real"`）：整卷录入广东专插本政治 **2015–2025 共 11 套**，各卷 37 题（单选 20 + 多选 10 + 辨析 2 + 问答 3 + 论述 1 + 材料 1），合计 **407 题**，保持原卷题序、`chapter` = `{年份}年真题`，id 形如 `politics-real-2025-01`
- 源 PDF《【Mayi政治】广东专插本政治（10年真题）》为**纯扫描件（123 页，无文字层）**，采用渲染成图后**逐页视觉转录**；客观题答案取自原卷答案表 / 题后标注，主观题录入参考答案全文与分值说明
- 从 11 套真题中择优提取 **55 道高价值客观题**（每年 5 题，优先高频核心与易混易错）编入 `politics.json`（`politics-301`~`politics-355`），`chapter` 归入对应教材章节，`tags` 追加 `{年份}年真题`；`subjects.json` 中 `politics.total` 300 → **355**
- `questionService` 注册 `politics-real` 题库；`subjects.json` 新增 `politics-real`（`色 #F2A65A`，`kind: "real"`），真题模考页自动新增「政治真题」分组
- 政治真题**辨析题**（原卷新题型）映射为 `简答`：`stem` 前缀「（辨析题）」、`tags` 首项 `辨析题`，沿用现有「看参考答案 + 自评」逻辑，**未新增判分代码**
- 源卷瑕疵逐条处理：**教材内容类 4 项已按最新教材修正**（2023 年单选 12 缺失选项补齐、2022 年问答 33 参考答案补全、2018 年单选 10 答案 B → D、2023 年多选 29 选项 D「时代精神」→「时代精华」，见本条首项）；**印刷/分值类 4 项保留原样并注明**（2018/2022 年材料题两处分值标注不一致、2019/2020/2021/2022 年答案页将辨析题分值误印为「每小题 8 分，共 16 分」而试题页为 7 分/14 分、2015 年问答 33 题干「得到关系」应为「之间的关系」、2025 年问答题小题序号印作「34」两次）

- 新增真题科目「英语真题」（`assets/questions/english-real.json`，`kind: "real"`）：整卷录入广东专升本英语 **2013–2019 及 2020–2022 共 10 套**（2013/2014 各 76 题、2015–2021 各 66 题、2022 新题型 46 题），合计 **660 题**，各卷保持原卷题序、`chapter` = `{年份}年真题`
- 补录 **2020 年、2021 年**整卷各 66 题：原资料（2008-2022 真题集 PDF）这两套**仅有扫描图、无文字层**，采用渲染成图后逐页视觉转录，并以官方【精析】（`2019-2021答案精析.doc` 内嵌图片）与 2021 答案表**双向逐题对照校对**（答案 0 处不符）；`english-real` 合计 528 → **660 题**
- 对英语题库做一轮**抽查校对**：自动化校验（答案与解析“故选 X”自洽性、选项数与答案合法性、同篇短文一致性、题干文本与源卷逐年比对）+ 逐题复核，结果 —— 答案 0 处不符、无篡改/错年、解析无空缺；修正 **18 类源 PDF 文字层 OCR 讹字**（如 hive→give、boor→door、cdan→can、visti→visit、pubic→public、Roberty→Robert、tong→long、ling→long、ride way→rude way、then went→them went、bad failed→had failed、ALDS→AIDS、refes→refers、tine→time、tho→who、watt→wait、you' re→you're、I' 11→I'll）并统一多余空白
- **阅读理解 / 完形填空的共用短文并入每道关联题题干**（`【Passage N 原文】…【题目】…` / `【完形填空原文】…___N___…【第N空】`），保证乱序练习、错题重做时题目仍自包含；2022 五选五映射为单选（A–E 五选项）、语法填空映射为填空（自评）、写作为简答（附参考范文）
- 英语真题答案严格取自原卷【精析】/答案表，并用脚本逐题比对，**0 处不符**；2019 年原卷仅给出答案表、无逐题解析，由转录时补写简洁解析
- 从 2013–2019 真题择优提取 **30 道高价值语法单选**编入 `english.json`（`english-301`~`english-330`，`chapter` = `语法`，`tags` 含 `{年份}年真题`），`subjects.json` 中 `english.total` 300 → 330
- `questionService` 注册 `english-real` 题库；`subjects.json` 新增 `english-real`（`kind: "real"`），真题模考页自动新增「英语真题」分组

- 剩余年份真题改为**拆分编入高数练习库**（不再进真题模考）：在 `math.json` 追加 **2013 年择优 18 题**（剔除单选 1 等价无穷小、填空 6 单步连续性极限等纯送分题），`chapter` 统一为 `2013年真题`、`tags` 首项为 `2013年真题`，练习界面每题顶部即显示该年份标签；`subjects.json` 中 `math.total` 同步 300 → 318
- 继续追加 **2012 年择优 18 题**（`math.json` 中 `math-319`~`math-336`，`chapter` = `2012年真题`；剔除单选 3 基础重要极限、填空 9 基础广义积分等与章节基础题重复的单步题）；`math.total` 318 → 336
- 底部导航改为**悬浮胶囊**（参考 Ledger 的 `nav-capsule`）：弃用「通铺满宽的扁平白带」，改为高 56、全圆角、水平居中、浮在内容之上的胶囊；背景 `navGlass`、发丝描边 `outline`、单层投影；选中项为 `blueSoft` 淡底 + `blue` 主色，未选中 `text3`；图标统一为「未选中描边 / 选中实心」成对（错题图标由语义错误的 `close-circle-outline` 改为 `reader`）；外层 `pointerEvents="box-none"`，胶囊两侧空白不拦截内容点击
- **修复悬浮胶囊变成「嵌在背景板上的假悬浮」**：`PageContainer` 在 `scroll={false}`（首页 / 错题本等自带 `FlatList`）时把底部内边距加在了**外层容器**上，把列表可视区压低了 86px，导致内容永远滚不到胶囊下方，胶囊下方永远是一条页面底色带。现改为 `scroll={false}` 时容器不预留，由页面自身列表的 `contentContainerStyle` 预留，内容可以正常滚到胶囊下方、也能出现在胶囊与屏幕底边之间
- 新增 `navGlass` 令牌（dark `rgba(255,255,255,0.10)` / light `rgba(255,255,255,0.58)`）作为胶囊背景：此前的 `glassStrong` 浅色是 92% 白，近乎不透明，玻璃胶囊透不出下方内容
- 新增 `blueSoft` 令牌（dark `#262A3C` / light `#EDEEF6`，取自 Ledger `--blue-soft`）
- `PageContainer` 新增 `bottomSpace` 参数，底部内边距改为 `安全区 + bottomSpace`（默认 24），Tab 页传 `theme.safeBottom`；`safeBottom` 130 → 86（胶囊 56 + 偏移 10 + 呼吸 20）
- **修复 iOS 上底部 TabBar 完全无背景**：原实现只在 `Platform.OS === 'android'` 时补背景色，注释声称的 BlurView 从未实现
- 修掉底部过度留白：原 `PageContainer` 对全部页面硬编码 140，二级页（关于/小结/真题/科目详情）无谓留 140，现降为安全区 + 24
- **修复持久化把主题对象一并存盘导致的升级后样式不生效**：`useSettingsStore` 原先 `persist` 整个 store（含由 `settings.theme` 派生的完整 `theme` 对象），升级后旧快照会覆盖新主题常量——新增的 `blueSoft` 读取为 `undefined`（TabBar 选中项淡色底消失）、调整过的 `safeBottom` 仍按旧值 130 生效。现加 `partialize` 仅持久化 `settings`，`theme` 一律在 rehydrate 时按当前常量重新派生

## [0.3.0] - 2026-10-10

- 新增「真题模考」：把广东省专升本（原专插本）高等数学历年真题**整卷录入**为新科目「高数真题」（`assets/questions/math-real.json`），各年份试卷保持原样、原题序，不作改写
- 新增年份选择页 `app/paper/index.tsx`：列出已收录年份与题量、已做进度，点击进入该年份整卷模拟
- 练习页新增可选参数 `year`：带 `year` 时取该年份整卷（`getQuestionsByYear`）并按原卷顺序作答，标题显示「{year}年真题模考」；问答流程、错题入本、小结页与练习**完全一致**
- 新增题型 `计算` / `综合`（`QuestionType`）：与主观题一致，**只看参考答案 + 我掌握了/没掌握自评，不新增任何自动判分**
- 数据服务 `questionService` 新增 `getPaperYears(subjectId)` / `getQuestionsByYear(subjectId, year)`，并注册 `math-real` 题库
- 首页新增「真题模考」入口（`ListHeaderComponent`）
- 新增题库校验脚本 `scripts/check-bank.mjs`（字段/题型/单选答案/id 唯一/chapter 规则校验，输出各年题数）
- 整卷数据：**2021 + 2020 + 2019 + 2018 + 2017 + 2016 + 2015 + 2014 年各 20 题**（各年均为单选5+填空5+计算8+综合2）；其余年份待逐年人工转录补录
- 科目题量同步更新为 160
- 版本号 0.2.1 → 0.3.0，`versionCode` → 4
- 应用图标重做（`book` 方案）：弃用 0.2.1 的「深色底 + 蓝紫渐变 B」——渐变与光斑在小尺寸下发糊、观感廉价。改为**扁平纯色**：`#4D9DE0` 圆角方块 + 纯白书本，无渐变/无光斑/无发光；同步重绘 5 档 mipmap、自适应前景与 splash logo，`drawable/ic_launcher_bg.xml` 与 `app.json` 的 `adaptiveIcon.backgroundColor` 均改为纯色 `#4D9DE0`
- 设置页「深色模式」改为「主题样式」：移除跟随系统的「自动」档，只保留「浅色 / 深色」，默认深色。一并清理 `applySystemScheme`、`useColorScheme` 同步副作用、`ThemeMode` 与 `Settings.theme` 中的 `'auto'`；并对历史持久化的 `'auto'` 值做一次性回落，避免升级后两个按钮都不高亮
- **修复浅色模式底衬/描边消失**：全站 7 处「白色当底衬或描边」的写法改为随主题取值，涉及进度条底槽（首页 / 真题页 / 统计页）、章节圆点、错题本筛选胶囊、设置页分段控件边框、`GlassCard` 的 iOS 路径边框。新增两个**随模式反转**的令牌：`track`（底槽，dark `rgba(255,255,255,0.10)` / light `rgba(28,26,23,0.09)`）与 `outline`（卡片内描边，dark `0.16` / light `rgba(28,26,23,0.12)`）；统计页进度条改走共享 `ProgressBar`。注意 `glass` / `glassBorder` 在浅色模式下本身就是白色，**不可**当底衬或卡片内描边使用
- **真题与科目解耦**：`subjects.json` 新增 `kind`（`normal` / `real`）显式声明科目类型，不再依赖 id 命名约定；`Subject` 类型同步、`check-bank.mjs` 强制校验 `kind` 存在且合法。后续新增政治真题 / 英语真题只需加题库 JSON + 一条 `kind: "real"` 配置，核心代码零改动
- 首页拆为两块：「真题模考」按真题科目逐科成卡（读取科目色，不再硬编码），「科目练习」只列普通科目；真题不再混入普通科目网格
- 真题模考页改为**按科目分组**列出年份（高数真题 / 政治真题 …），服务层移除写死的 `PAPER_SUBJECT_ID`
- **全站行为统一**：新增共享件 `ScreenHeader`（返回入口统一 `‹ + 15/500 主色`）与 `ProgressBar`（统一高 6、全圆角、底槽随主题）；标题收敛为 display 34 / page 24 / section 22 / card 17 四档（真题页 28→22、科目详情 20→22、本次小结 20→22、关于 28→22）；规范写入 `docs/DESIGN.md`
- 科目详情页移除嵌套滚动：章节列表不再用 `maxHeight` + 内层 `ScrollView`，改为跟随整页滚动
- 本次小结页显示真题年份：`useSessionStore` 新增 `year`，真题模考结束后显示「高数真题 · 2021年真题」而非「顺序练习」

## [0.2.1] - 2026-10-10

- 应用图标：新增深色底 + 蓝紫渐变「B」图标，替换 Expo 默认图标。覆盖 5 档密度传统图标（含圆形），并新增 **自适应图标**（`mipmap-anydpi-v26/` + 渐变背景 drawable），Android 8+ 可正确遮罩不再套白底
- 图标生成脚本 `scripts/generate-icon.py`（Pillow 程序化绘制，4× 超采样），母版存 `assets/icon.png` / `assets/adaptive-icon.png`，`app.json` 已配 `icon` 与 `android.adaptiveIcon`，未来 prebuild 不丢
- 修复冷启动白闪：`app.json` 的 splash 配色此前从未生效（`expo-splash-screen` 未装为插件），原生 splash 实为 Expo 默认白底 + 灰 logo。现改为深色 layer-list（`drawable/splashscreen.xml` + `splashscreen_background=#0B0F14`）+ 重绘的透明底 logo 位图
- 版本号 0.2.0 → 0.2.1，`versionCode` → 3

## [0.2.0] - 2026-10-09

- 修复页面切换闪浅色：`RootLayout` 注入 `ThemeProvider`（`expo-router` 的 Dark/Default 主题 + 业务色覆写），不再沿用导航容器默认的 `DefaultTheme`（背景 `rgb(242,242,242)`、卡片纯白），消除转场时「先浅色后深色」的闪屏
- 错题本新增「答对 3 次可移除」机制：任意模式答对都累计连续答对次数，答错清零；累计达 3 次自动标记已解决并从错题本消失（旧数据无该字段按 0 兜底）
- 版本号统一为 0.2.0：package.json / app.json 同步，关于页改为从 expo-constants 动态读取，不再写死；Android versionCode → 2（覆盖安装需要递增）
- 新增练习完成小结页：激活原占位路由 `/result`，展示答对 X/Y、正确率、错题数，并提供「重做错题」「返回首页」入口
- 移除死设置项 `fontSize`（无 UI 无消费方）；`lastSubjectId` 接线为首页「继续上次练习」快捷入口

## [0.1.6] - 2026-10-09

- 修复页面仍无法滚动：`PageContainer` 内容容器改用 `minHeight:'100%'` 而非 `flexGrow:1`（后者在部分 Android 机型抑制 ScrollView 滚动判定）；首页/错题页 `FlatList` 补 `style={{flex:1}}` 获得有界高度
- 转场动画：Stack 改为 `slide_from_right`（页面推入自然流畅），Tabs 切换增加 `fade` 渐变，消除生硬硬切

## [0.1.5] - 2026-10-09

- 修复切深色模式后 Android 全页面失灵：玻璃组件按平台分级，Android 一律走半透明降级（`GlassCard`/`GlassModal`/`GlassTabBar`），iOS 才用 `BlurView`
- 修复顶部过于贴顶：`topPadding` 16→28
- 修复页面无法滚动：`PageContainer` 默认可滚动，首页/错题页（自带 FlatList）传 `scroll={false}` 避免嵌套滚动警告

## [0.1.4] - 2026-10-09

- 状态栏改为**恒定隐藏**（沉浸式），不再提供开关：移除设置页「状态栏」开关及 `hideStatusBar` 设置项与相关 store 动作；`topPadding` 由 40 调整为 16

## [0.1.3] - 2026-10-09

- 新增「隐藏状态栏」功能（已于 0.1.4 调整为恒定隐藏，此开关已移除）

## [0.1.2] - 2026-10-09

- 修复错题本科目切换标签在真机上被纵向拉伸成"竖椭圆"、无法点击的问题：横向 `ScrollView` 在原生端不会按内容自适应高度，会撑满父级剩余空间且内容交叉轴默认 stretch。为其显式限定高度并让内容垂直居中
- 打包环境：锁定 Gradle 使用 JDK 17（Android Studio 自带 JBR 为 JDK 25，与 RN 0.86 的 CMake 工具链不兼容），构建架构收敛为 arm64-v8a

## [0.1.1] - 2026-10-09

- 移除设置页「毛玻璃」开关按钮及其 `blurEnabled`/`toggleBlur` 状态与类型字段；毛玻璃效果保留（深色 BlurView，浅色半透明降级），不再由用户手动开关
- 错题本：每张错题卡恢复底部「点此重新练习 ›」提示；点击任意错题从**所点这道题**开始练习（练习页新增 `startId` 参数定位，不再固定从第一题开始）

## [0.1.0] - 2026-10-09

### 基础
- App 命名定为 BeBetter（源于项目文件夹名）
- 初始化 Expo + React Native + TypeScript（SDK 57）项目骨架
- 配置 Expo Router、Zustand、AsyncStorage、expo-blur
- 说明：`react-native-web` 仅用于本地浏览器预览调试，非交付形态

### 数据层
- 编写 `scripts/normalize.mjs` 题库归一化脚本，兼容「纯数组 / {meta,questions}」两种顶层结构
- 高数 / 英语 / 政治三题库各 300 题归一化输出到 `assets/questions/{subjectId}.json`
- 编写 `assets/subjects.json` 科目配置（政治/英语/高数，预留 C 语言）

### 状态与持久化
- useSettingsStore / useProgressStore / useWrongStore（AsyncStorage 持久化）
- 错题记录、进度统计、深浅主题

### 毛玻璃组件
- GlassCard / GlassButton / GlassModal / GlassTabBar
- Android blur 降级（半透明 + 边框高光）

### 刷题主流程
- 首页科目卡片 + 科目详情（顺序/随机/错题三模式）
- 单选 / 多选 / 判断自动判分；答案解析 + 对错变色
- 简答 / 论述 / 材料主观题：查看参考答案 + 「我掌握了/没掌握」自评（不自动判分）
- 答错 / 自评没掌握自动入错题本

### 错题 / 统计 / 设置
- 错题本（按科目切换、重做）
- 统计页（总做题数、答对数、正确率、各科进度）
- 设置页（深浅主题含 auto 跟随系统、毛玻璃开关、清除进度/错题带二次确认、关于）

## [0.0.1] - 2026-10-09
- 项目初始化、文档骨架