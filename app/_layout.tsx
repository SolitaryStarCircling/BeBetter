import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function RootLayout() {
  const theme = useSettingsStore((s) => s.theme);

  // 导航层主题：必须与业务主题一致，否则转场会「先浅后深」闪一下。
  // 根因：expo-router 的 NavigationContainer 默认 theme = DefaultTheme（浅色，
  // background=rgb(242,242,242) / card=rgb(255,255,255)），而导航内部所有背景都从
  // 这个 theme 取值，且都不受业务层样式控制：
  //   1) 原生 Stack 容器：NativeStackView.native.js 把 colors.background 传给
  //      ScreenStack 的 nativeContainerStyle（contentStyle 覆盖不到这一层）
  //   2) 每个 screen 底座：elements/Screen.js -> Background.js 直接用 colors.background
  // 而 Tabs 的 fade 动画（SceneStyleInterpolators.forFade）对 opacity 做 [0,1,0] 插值，
  // 过渡中新页面 opacity<1，下面这两层浅色就透出来，等 opacity=1 才被深色内容盖住。
  // 故此处把导航主题整体对齐到业务主题，而不只改 background，避免其余原生表面再漏浅色。
  const navTheme = useMemo(() => {
    const base = theme.mode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        background: theme.colors.bg,
        card: theme.colors.bg,
        border: theme.colors.sep,
        text: theme.colors.text,
        primary: theme.colors.blue,
      },
    };
  }, [theme]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navTheme}>
        <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
          <StatusBar hidden style={theme.mode === 'dark' ? 'light' : 'dark'} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.colors.bg },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="subject/[id]" />
            <Stack.Screen name="practice/[subjectId]" />
            <Stack.Screen name="paper/index" />
            <Stack.Screen name="result" />
            <Stack.Screen name="about" />
          </Stack>
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
