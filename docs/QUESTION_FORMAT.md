# 题库 JSON 格式说明

本文档描述 BeBetter 归一化后的题库 JSON 格式。

## 文件路径

- 题库文件：`assets/questions/{subjectId}.json`
  - 例：`assets/questions/politics.json`、`assets/questions/english.json`、`assets/questions/math.json`、`assets/questions/math-real.json`（高数真题整卷）、`assets/questions/english-real.json`（英语真题整卷）、`assets/questions/politics-real.json`（政治真题整卷）、`assets/questions/c.json`
- 科目配置：`assets/subjects.json`

## 题目字段说明

每个题库文件为一个数组，数组元素为题目对象，字段如下：

| 字段          | 类型     | 必填 | 说明                                                  |
| ------------- | -------- | ---- | ----------------------------------------------------- |
| `id`          | string   | 是   | 题目唯一 ID，建议 `{subjectId}-{序号}`                |
| `subjectId`  | string   | 是   | 所属科目 ID，与文件名一致                              |
| `chapter`     | string   | 否   | 章节名/编号，用于章节维度统计                          |
| `type`        | string   | 是   | 题型：`单选` / `多选` / `判断` / `填空` / `简答` / `论述` / `材料` / `计算` / `综合`（后两者为真题专用） |
| `stem`        | string   | 是   | 题干文本                                               |
| `options`     | string[] | 否   | 选项数组（单选/多选/判断必填；其他题型为空数组 `[]`）  |
| `answer`      | string   | 是 | 正确答案。单选为选项下标字母（如 `"A"`）；多选为字母串（如 `"ABC"`）；判断为 `"对"` / `"错"`；其他题型为参考答案文本 |
| `explanation` | string   | 否 | 解析说明 / 解题过程                                    |
| `difficulty`  | number   | 否 | 难度 1-5，1 最易 5 最难                                |
| `tags`        | string[] | 否 | 标签数组（归一化脚本由 `knowledge_point` 字段转换而来；真题用于填充**知识点分类**） |

> 判分策略：`单选` / `多选` / `判断` 自动判分；`填空` / `简答` / `论述` / `材料` / `计算` / `综合` 渲染为「看参考答案 + 我掌握了/没掌握自评」。

## 真题整卷约定（`math-real.json`）

- 真题作为**独立科目** `math-real`（显示名「高数真题」），各年份试卷**忠实录入、不改动、不重排题号**。
- `chapter` 固定为 `{年份}年真题`（如 `2021年真题`），是**按年份取整卷**的唯一依据；服务端用 `getQuestionsByYear(year)` 取卷、`getPaperYears()` 列出年份。
- 客观题（真题单选）正常填 `options` 与 `answer` 字母；**填空 / 计算 / 综合**均为 `options: []`，`answer` 存参考答案文本、`explanation` 存解题过程，作答后走主观自评。
- 公式统一用**纯文本写法**，避免乱码：`lim(x→0) tan6x/(2x)`、`x²`、`∫₀¹`、`√(x-1)`、`e^(yz)`、`Σ(n=1→∞) u_n`。
- 校验：`node scripts/check-bank.mjs`（字段齐全、题型合法、单选答案合法、id 唯一、chapter 规则，并输出各年题数）。

## 英语真题整卷约定（`english-real.json`）

- 真题作为独立科目 `english-real`（显示名「英语真题」），各年份试卷**忠实录入、保持原卷题序**，`chapter` 固定为 `{年份}年真题`。
- 题型映射：词汇与结构 / 阅读理解 / 完形填空 / 五选五 → `单选`；语法填空 → `填空`（自评）；写作 → `简答`（`answer` 存参考范文）。
- **共用短文并入题干**：同一篇阅读 / 完形被多题共用时，每题 `stem` 各自包含完整原文，保证乱序练习与错题重做时题目自包含。格式：
  - 阅读：`【Passage N 原文】\n<逐字原文>\n\n【题目】<问题>`
  - 完形 / 五选五：`【完形填空原文】\n<全文，空位写作 ___N___>\n\n【第N空】请选择最合适的选项。`
- 客观题 `answer` 一律取自原卷【精析】或答案表；2019 年原卷仅有答案表，无逐题解析。

## 政治真题整卷约定（`politics-real.json`）

- 真题作为独立科目 `politics-real`（显示名「政治真题」），各年份试卷**忠实录入、保持原卷题序**，`chapter` 固定为 `{年份}年真题`。
- `id` 形如 `politics-real-{年份}-{两位序号}`（如 `politics-real-2025-01`）。
- 题型映射（原卷分节 → 本库 `type`）：
  - 一、单项选择题（20 题×1 分）→ `单选`
  - 二、多项选择题（10 题×2 分）→ `多选`
  - 三、辨析题（2 题×7 分）→ `简答`（`stem` 前缀「（辨析题）」，`answer` 存「判断正误 + 理由」全文；`tags` 首项为 `辨析题`）
  - 四、问答题 / 简答题（3 题×7 分）→ `简答`（`stem` 前缀「简答：」）
  - 五、论述题（10 分）→ `论述`（`stem` 前缀「论述：」）
  - 六、材料分析题（15 分）→ `材料`（`stem` = 材料原文 + 出处 + 全部设问；`answer` = 分点参考答案）
- 客观题 `answer` 取原卷「试题答案及评分标准」页的答案表 / 题后标注字母；主观题 `answer` 存参考答案全文、`explanation` 存分值分配说明。
- 源卷为**纯扫描件、无文字层**，全部内容经逐页视觉转录。源卷问题分两类处理：**教材内容类**（选项缺漏、答案与现行教材通行表述不符、答案页错印他题答案）**按现行教材修正**，并在 `explanation` 中注明原卷表述；**印刷/分值类**（分值两处标注不一致、题干错字、小题序号误印）**保留原样**并在 `explanation` 中注明。

## 示例题目 JSON

### 单选

```json
{
  "id": "politics-001",
  "subjectId": "politics",
  "chapter": "马克思主义基本原理",
  "type": "单选",
  "stem": "马克思主义哲学的直接理论来源是？",
  "options": [
    "德国古典哲学",
    "英国古典政治经济学",
    "法国空想社会主义",
    "古希腊罗马哲学"
  ],
  "answer": "德国古典哲学",
  "explanation": "马克思批判吸收了以黑格尔、费尔巴哈为代表的德国古典哲学。",
  "difficulty": 2,
  "tags": ["哲学", "来源"]
}
```

### 多选

```json
{
  "id": "math-010",
  "subjectId": "math",
  "chapter": "函数极限",
  "type": "多选",
  "stem": "下列极限计算结果为 0 的有？",
  "options": [
    "lim(x→0) sin x / x",
    "lim(x→∞) (1+1/x)^x",
    "lim(x→0) (e^x - 1) / x",
    "lim(x→∞) ln x / x"
  ],
  "answer": "D",
  "explanation": "ln x 增长慢于 x，故 lim(x→∞) ln x / x = 0。其余均为 1 或 e。",
  "difficulty": 4,
  "tags": ["极限", "重要极限"]
}
```

### 判断

```json
{
  "id": "english-005",
  "subjectId": "english",
  "chapter": "语法",
  "type": "判断",
  "stem": "“I have been studying for three hours.”使用的是现在完成进行时。",
  "options": ["正确", "错误"],
  "answer": "正确",
  "explanation": "have been + doing 即现在完成进行时，强调持续到现在的动作。",
  "difficulty": 1,
  "tags": ["时态"]
}
```

### 简答（自评）

```json
{
  "id": "politics-250",
  "subjectId": "politics",
  "chapter": "毛泽东思想",
  "type": "简答",
  "stem": "简述新民主主义革命的三大法宝及其相互关系。",
  "answer": "统一战线、武装斗争、党的建设。三者相互联系：统一战线与武装斗争是战胜敌人的两个基本武器；党的建设则是掌握这两个武器以实行对敌冲锋陷阵的英勇战士。",
  "explanation": "参见《<共产党人>发刊词》。",
  "difficulty": 3,
  "tags": ["新民主主义", "党的建设"]
}
```

### 计算 / 综合（真题·自评）

```json
{
  "id": "math-real-2021-11",
  "subjectId": "math-real",
  "chapter": "2021年真题",
  "type": "计算",
  "stem": "求极限 lim(x→+∞) x(√(x²+3) - x) 的值。",
  "options": [],
  "answer": "3/2",
  "explanation": "有理化后分子分母同除以 x 得 3/(√(1+3/x²)+1) → 3/2。",
  "difficulty": 3,
  "tags": ["函数与极限", "极限计算", "有理化"]
}
```

## 科目配置 subjects.json

`assets/subjects.json` 描述可用科目，结构为数组：

| 字段      | 类型    | 说明                                  |
| --------- | ------- | ------------------------------------- |
| `id`      | string  | 科目 ID，与题库文件名对应             |
| `name`    | string  | 科目显示名称                          |
| `icon`    | string  | 图标名（对应 @expo/vector-icons）     |
| `color`   | string  | 科目强调色（hex），用于 UI 标识       |
| `total`   | number  | 该科题量（用于占比/进度计算）         |
| `enabled` | boolean | 是否启用（false 表示数据未就绪，不展示） |
| `order`   | number  | 首页排序权重，越小越靠前              |

### 示例

```json
[
  {
    "id": "politics",
    "name": "政治",
    "icon": "book",
    "color": "#E85D75",
    "total": 300,
    "enabled": true,
    "order": 1
  },
  {
    "id": "english",
    "name": "英语",
    "icon": "language",
    "color": "#4D9DE0",
    "total": 300,
    "enabled": true,
    "order": 2
  },
  {
    "id": "math",
    "name": "高数",
    "icon": "calculator",
    "color": "#9B7EDE",
    "total": 300,
    "enabled": true,
    "order": 3
  },
  {
    "id": "c",
    "name": "C语言",
    "icon": "code-slash",
    "color": "#3DDC97",
    "total": 300,
    "enabled": false,
    "order": 4
  },
  {
    "id": "math-real",
    "name": "高数真题",
    "icon": "calculator",
    "color": "#5FB8A8",
    "total": 20,
    "enabled": true,
    "order": 5
  }
]
```
