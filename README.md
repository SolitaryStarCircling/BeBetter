# BeBetter

本地知识练习 App，多科目刷题、错题复习、进度统计。纯移动端（Expo + React Native），不做网页交付形态。

## 技术栈

- Expo SDK 57 + React Native 0.86 + TypeScript
- Expo Router（文件式路由）
- Zustand（状态管理）
- AsyncStorage（本地持久化：进度 / 错题 / 设置）
- expo-blur（毛玻璃效果，Android 端走半透明降级）
- React Native Reanimated + Gesture Handler

## 运行

```bash
npm install
npx expo start
```

- 用 Expo Go 扫码，或按 `a` 启动 Android 模拟器 / 真机预览。
- 浏览器预览仅用于开发期查看 UI：

  ```bash
  npx expo start --web
  ```

  `react-native-web` 只服务本地调试，App 主体编译为原生 Android / iOS。

> 开发期提示：`npx expo start` 在 CI 模式下关闭热更新，改完代码需重启，或启动时加 `--clear` 清缓存，避免读到旧 bundle。

## 题库格式

归一化后的 JSON 格式见 [docs/QUESTION_FORMAT.md](./docs/QUESTION_FORMAT.md)。

- 分层练习：政治 355 题、英语 330 题、高数 336 题，位于 `assets/questions/{subjectId}.json`。
- 整卷真题：高数真题 8 套 160 题、英语真题 10 套 660 题、政治真题 11 套 407 题，位于 `assets/questions/*-real.json`，用于真题模考。

新增科目只需两步：加入 `assets/questions/{subjectId}.json`，并在 `assets/subjects.json` 追加一条配置，核心代码无需改动。

## 题型与交互

- 单选 / 多选 / 判断：自动判分，附答案解析与对错配色。
- 简答 / 论述 / 材料 / 填空 / 计算 / 综合：主观题，展示参考答案并提供「我掌握了 / 没掌握」自评，不做自动判分。

## 设计规范

毛玻璃深色 UI：深色为主、浅色可选，主题在设置页二选一（不跟随系统）；组件规格与颜色令牌见本地 `docs/DESIGN.md` / `DESIGN-TOKENS.md`（开发参考，不随仓库分发）。

## 开发笔记

技术决策、数据校对与踩坑记录见 [NOTES.md](./NOTES.md)。

## 下一步

见 [TODO.md](./TODO.md)