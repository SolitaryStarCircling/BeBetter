import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Ionicons } from '@expo/vector-icons';
import type { Theme } from '@/constants/theme';

interface TabConfig {
  href: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap; // 未选中
  iconActive: keyof typeof Ionicons.glyphMap; // 选中
}

const TABS: TabConfig[] = [
  { href: '/', label: '首页', icon: 'home-outline', iconActive: 'home' },
  { href: '/wrong', label: '错题', icon: 'reader-outline', iconActive: 'reader' },
  { href: '/stats', label: '统计', icon: 'bar-chart-outline', iconActive: 'bar-chart' },
  { href: '/settings', label: '设置', icon: 'settings-outline', iconActive: 'settings' },
];

/**
 * 悬浮胶囊底部 TabBar（参考 Ledger 的 nav-capsule）
 * - 胶囊高 56、全圆角、水平居中原生浮于内容之上
 * - 选中项：淡蓝胶囊底 + 主色图标文字
 * - 外层 pointerEvents="box-none"，胶囊两侧空白不拦截内容点击
 */
export function GlassTabBar({ state, navigation }: any) {
  const theme = useSettingsStore((s) => s.theme);
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { bottom: insets.bottom + 10 }]}
    >
      <View
        style={[
          styles.capsule,
          {
            backgroundColor: theme.colors.navGlass,
            borderColor: theme.colors.outline,
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tab = TABS[index] || TABS[0];
          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              tab={tab}
              theme={theme}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabItem({
  isFocused,
  tab,
  theme,
  onPress,
}: {
  isFocused: boolean;
  tab: TabConfig;
  theme: Theme;
  onPress: () => void;
}) {
  const color = isFocused ? theme.colors.blue : theme.colors.text3;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tab,
        isFocused && { backgroundColor: theme.colors.blueSoft },
        pressed && styles.tabPressed,
      ]}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={tab.label}
    >
      <Ionicons name={isFocused ? tab.iconActive : tab.icon} size={22} color={color} />
      <Text style={[styles.label, { color }]}>{tab.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center', // 胶囊水平居中
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 56,
    paddingHorizontal: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    // 投影：RN 不支持多层，取 Ledger sh-3 的观感压成单层
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10, // Android
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabPressed: {
    transform: [{ scale: 0.94 }],
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 1,
    letterSpacing: 0.1,
  },
});
