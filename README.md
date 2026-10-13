# BeBetter · 专升本刷题 App

> 把广东专升本历年真题搬进手机的离线刷题 App。客观题自动判分、主观题自评，错题自动入本、连续答对 3 次自动移出，进度只存在你自己的设备上。

![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo&logoColor=fff)
![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=fff)
![Platform](https://img.shields.io/badge/Platform-Android-3DDC84?logo=android&logoColor=fff)
![Offline](https://img.shields.io/badge/Offline--First-100%25-2E7D32)

---

BeBetter 是一款**离线优先（offline-first）**的知识练习工具，为广东专升本备考而生。它把「数据主权」当作首要约束：刷题进度、错题本、设置全部写入设备本地 AsyncStorage，没有账号体系、没有云同步、不发任何网络请求，断网与联网状态功能完全等价。

题库是它的核心资产：29 套广东专升本历年真题（高数 8 套 / 英语 10 套 / 政治 11 套）逐题人工转录，客观题答案与官方答案表逐条对照、独立推导复核，整卷模考保持原卷题序；另有 1000+ 道分层练习题按章节组织，真题中的高价值题目择优拆入日常练习并标注年份。

判分策略刻意做减法：单选 / 多选 / 判断自动判分，简答 / 论述 / 材料 / 计算 / 综合只看参考答案 + 自评「掌握了 / 没掌握」，不做花哨的自动批改。没有签到提醒、没有排行榜、没有社交信息流，只有题目、错题本和一张能看清掌握进度的统计页。

---

## 功能

**分层练习**

- 政治 / 英语 / 高数三科题库，按章节练习，支持顺序 / 随机 / 错题三种模式
- 单选 / 多选 / 判断自动判分，即时对错反馈 + 答案解析
- 简答 / 论述 / 材料 / 填空 / 计算 / 综合走「参考答案 + 自评」，不自动判分

**真题模考**

- 高数 2014–2021 共 8 套、英语 2013–2022 共 10 套、政治 2015–2025 共 11 套
- 整卷按原卷题序作答，年份选择页显示各卷题量与已做进度

**错题本**

- 答错或自评「没掌握」自动入本；点击任意错题从该题开始重做
- 连续答对 3 次自动移出，中途答错清零重新累计

**进度与统计**

- 断点续练：练习中随时退出，首页一键回到上次那题
- 练习小结页：本次正确率 + 错题清单，单题点击即可重做
- 统计页：总做题数、答对数、总正确率、各科进度

**界面**

- 毛玻璃深色 UI，浅色 / 深色主题二选一，默认深色
- Android 模糊性能不足时自动降级为半透明 + 边框高光
- 悬浮胶囊底部导航，返回入口 / 进度条 / 标题层级全站统一

---

## 技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 跨端框架 | Expo SDK 57 + React Native 0.86 | 交付形态为原生 Android；`react-native-web` 仅用于开发期浏览器预览 |
| 语言 | TypeScript | 全量类型，`tsc --noEmit` 零错误 |
| 路由 | Expo Router | 文件式路由，`(tabs)` + 二级页 |
| 状态 | Zustand | 设置 / 进度 / 错题 / 会话四个 store |
| 持久化 | AsyncStorage | 进度、错题、设置本地落盘 |
| 视觉 | expo-blur + Reanimated | 毛玻璃组件库，Android 半透明降级 |

## 运行

```bash
npm install
npx expo start
```

- 用 Expo Go 扫码，或按 `a` 启动 Android 模拟器 / 真机预览。
- 浏览器预览仅用于开发期查看 UI：`npx expo start --web`。

> 开发期提示：`npx expo start` 在 CI 模式下关闭热更新，改完代码需重启，或启动时加 `--clear` 清缓存，避免读到旧 bundle。

## 题库

归一化后的 JSON 格式与各科录入约定见 [docs/QUESTION_FORMAT.md](./docs/QUESTION_FORMAT.md)。

- 分层练习：政治 355 题、英语 330 题、高数 336 题，位于 `assets/questions/{subjectId}.json`。
- 整卷真题：高数真题 160 题、英语真题 660 题、政治真题 407 题，位于 `assets/questions/*-real.json`。
- 新增科目只需两步：加入题库 JSON + 在 `assets/subjects.json` 追加一条配置，核心代码无需改动。
- 题库校验：`node scripts/check-bank.mjs`。

## 其他文档

- 技术决策、真题校对与踩坑记录：[NOTES.md](./NOTES.md)
- 版本变更：[CHANGELOG.md](./CHANGELOG.md)
- 路线图与进度：[TODO.md](./TODO.md)
