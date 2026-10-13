import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/store/useSettingsStore';

interface ScreenHeaderProps {
  /** 按钮文案；二级页统一「返回」，沉浸式页面可传「退出」 */
  label?: string;
  /** 自定义返回行为，缺省 router.back() */
  onPress?: () => void;
  /** 右侧附加内容（如练习页的进度） */
  right?: React.ReactNode;
  /** 与下方内容的间距 */
  marginBottom?: number;
}

/**
 * 二级页统一返回入口
 * 全站同规格：‹ 图标（22） + 文字（15/500），主色 theme.colors.blue
 */
export function ScreenHeader({
  label = '返回',
  onPress,
  right,
  marginBottom = 16,
}: ScreenHeaderProps) {
  const theme = useSettingsStore((s) => s.theme);
  const router = useRouter();

  return (
    <View style={[styles.bar, { marginBottom }]}>
      <Pressable
        onPress={onPress ?? (() => router.back())}
        style={styles.btn}
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={22} color={theme.colors.blue} />
        <Text style={[styles.label, { color: theme.colors.blue }]}>{label}</Text>
      </Pressable>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
});
