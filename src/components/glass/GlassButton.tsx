import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  type PressableProps,
  type TextStyle,
} from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';

interface GlassButtonProps extends Omit<PressableProps, 'children'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  textStyle?: TextStyle;
}

/**
 * 毛玻璃按钮
 * - primary: 强调色底
 * - secondary: 半透明底
 * - danger: 红色底
 */
export function GlassButton({
  label,
  variant = 'primary',
  style,
  textStyle,
  onPress,
  ...props
}: GlassButtonProps) {
  const theme = useSettingsStore((s) => s.theme);
  const { colors } = theme;

  const bg = (() => {
    switch (variant) {
      case 'primary':
        return colors.blue;
      case 'secondary':
        return colors.glass;
      case 'danger':
        return colors.red;
    }
  })();

  const fg = variant === 'secondary' ? colors.text : '#FFFFFF';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        ...styles.btn,
        backgroundColor: bg,
        borderColor: colors.glassBorder,
        ...(pressed ? styles.pressed : {}),
        ...(style as object),
      })}
      {...props}
    >
      <Text style={[styles.label, { color: fg }, textStyle]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
});
