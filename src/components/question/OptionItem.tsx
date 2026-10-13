import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/store/useSettingsStore';
import { optionLetter } from '@/utils/answer';

export type OptionState = 'idle' | 'selected' | 'correct' | 'wrong';

interface OptionItemProps {
  index: number;
  text: string;
  state: OptionState;
  disabled: boolean;
  accentColor: string;
  onPress: () => void;
}

/** 选项按钮：单选/多选共用，状态决定配色 */
export function OptionItem({
  index,
  text,
  state,
  disabled,
  accentColor,
  onPress,
}: OptionItemProps) {
  const theme = useSettingsStore((s) => s.theme);
  const colors = theme.colors;

  const isSelected = state === 'selected';
  const isCorrect = state === 'correct';
  const isWrong = state === 'wrong';

  const borderColor = isCorrect
    ? colors.green
    : isWrong
    ? colors.red
    : isSelected
    ? colors.blue
    : colors.sep;

  const bg = isCorrect
    ? colors.green + '29'
    : isWrong
    ? colors.red + '29'
    : isSelected
    ? colors.blue + '1A'
    : 'transparent';

  const letterColor = isCorrect
    ? colors.green
    : isWrong
    ? colors.red
    : isSelected
    ? colors.blue
    : colors.text3;

  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.item, { backgroundColor: bg, borderColor: pressed && !disabled ? accentColor : borderColor, transform: [{ scale: pressed && !disabled ? 0.99 : 1 }] }]}>
      <View style={[styles.letter, { borderColor: letterColor }]}>
        <Text style={{ color: letterColor, fontWeight: '700' }}>
          {optionLetter(index)}
        </Text>
      </View>
      <Text style={[styles.text, { color: colors.text }]}>{text}</Text>
      {isCorrect && <Ionicons name="checkmark" size={20} color={colors.green} />}
      {isWrong && <Ionicons name="close" size={20} color={colors.red} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  letter: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});