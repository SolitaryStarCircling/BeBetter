# BeBetter

给自己备考广东专升本写的刷题 App，Expo + React Native 实现，纯本地运行。

它只做三件事：按章节刷练习题、按年份做整卷真题模考、错题自动进错题本——连续答对 3 次才放你走。

## 真题从哪来

库里的 29 套真题（高数 2014–2021、英语 2013–2022、政治 2015–2025）全部是纸质试卷逐题人工转录的：对照官方答案表、独立推导复核、印刷模糊处放大到 800dpi 确认。源卷自身的错印漏印不悄悄改，逐条记在 [NOTES.md](./NOTES.md)。

## 做题这件事

- 客观题（单选 / 多选 / 判断）即时判分、给解析、对错变色
- 主观题（简答 / 论述 / 材料 / 计算 / 综合）看参考答案自评「掌握了 / 没掌握」，不做自动批改
- 答错的题进错题本，点哪道题就从哪道题开始重做
- 中途退出不用管，首页「继续上次练习」直接回到上次那题
- 进度、错题、设置全存手机本地，App 不联网、没有账号

## 界面

深色毛玻璃风格，浅色可选，默认深色。Android 上高斯模糊性能不够时自动换成半透明 + 描边方案。底部导航是悬浮胶囊。

## 技术

- Expo SDK 57 + React Native 0.86 + TypeScript
- Expo Router 文件路由 / Zustand 状态管理 / AsyncStorage 持久化
- 题库是纯 JSON（`assets/questions/`），新增科目加个文件配条记录就行，不动核心代码
- 题库完整性校验：`node scripts/check-bank.mjs`

## 跑起来

```bash
npm install
npx expo start
```

Expo Go 扫码，或按 `a` 起 Android 模拟器。`--web` 只用于开发期看 UI，不是交付形态。

## 更多文档

- [NOTES.md](./NOTES.md) —— 技术决策、真题校对记录、踩坑
- [CHANGELOG.md](./CHANGELOG.md) —— 版本变更
- [TODO.md](./TODO.md) —— 路线图
- [docs/QUESTION_FORMAT.md](./docs/QUESTION_FORMAT.md) —— 题库 JSON 格式
