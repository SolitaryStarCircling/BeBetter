import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';

interface ProgressBarProps {
  /** 进度百分比 0–100，超出会被裁剪 */
  percent: number;
  /** 填充色（通常传科目色） */
  color: string;
  style?: ViewStyle;
}

/**
 * 统一进度条
 * - 规格全站一致：高 6、全圆角
 * - 底槽取 theme.colors.track，随主题反转，浅色模式下同样可见
 */
export function ProgressBar({ percent, color, style }: ProgressBarProps) {
  const theme = useSettingsStore((s) => s.theme);
  const pct = Math.max(0, Math.min(percent, 100));

  return (
    <View style={[styles.track, { backgroundColor: theme.colors.track }, style]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
