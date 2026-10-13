import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { formatDifficulty } from '@/utils/format';
import type { QuestionType } from '@/types/question';

/** 难度标签（低饱和三档，对应 token: diffEasy/Mid/Hard） */
export function DifficultyTag({ difficulty }: { difficulty: number }) {
  const theme = useSettingsStore((s) => s.theme);
  const color =
    difficulty <= 2
      ? theme.colors.diffEasy
      : difficulty <= 4
      ? theme.colors.diffMid
      : theme.colors.diffHard;

  return (
    <View style={[styles.tag, { backgroundColor: color + '1F' }]}>
      <Text style={[styles.text, { color }]}>{formatDifficulty(difficulty)}</Text>
    </View>
  );
}

/** 题型标签 */
export function TypeTag({ type }: { type: QuestionType }) {
  const theme = useSettingsStore((s) => s.theme);
  return (
    <View style={[styles.tag, { backgroundColor: theme.colors.blue + '1F' }]}>
      <Text style={[styles.text, { color: theme.colors.blue }]}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});