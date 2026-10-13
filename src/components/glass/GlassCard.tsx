import React from 'react';
import { View, Platform, StyleSheet, type ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSettingsStore } from '@/store/useSettingsStore';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  fallback?: boolean;
}

/**
 * 毛玻璃卡片组件
 * - iOS: BlurView 实时模糊（深色/浅色 tint）
 * - Android: 恒用半透明 + 边框高光降级，避免 BlurView 在原生端/深色模式下的渲染问题（设计规范要求）
 */
export function GlassCard({ style, intensity = 30, children, ...props }: GlassCardProps) {
  const theme = useSettingsStore((s) => s.theme);

  const isAndroid = Platform.OS === 'android';

  // Android：不使用 BlurView，统一半透明降级
  if (isAndroid) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.glass,
            borderColor: theme.colors.glassBorder,
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }

  return (
    <BlurView
      intensity={intensity}
      tint={theme.mode === 'dark' ? 'dark' : 'light'}
      style={[styles.card, { borderColor: theme.colors.glassBorder }, style]}
      {...(props as any)}
    >
      <View style={styles.inner}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
  },
});