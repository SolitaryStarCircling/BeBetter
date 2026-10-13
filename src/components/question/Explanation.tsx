import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';

/** 答案解析卡（提交后展示） */
export function Explanation({ explanation, correct }: { explanation: string; correct?: boolean }) {
  const theme = useSettingsStore((s) => s.theme);
  const colors = theme.colors;

  if (!explanation) return null;

  return (
    <View style={[styles.card, { backgroundColor: correct ? colors.green + '14' : colors.blue + '14', borderColor: correct ? colors.green + '40' : colors.blue + '40' }]}>
      <Text style={[styles.title, { color: correct ? colors.green : colors.blue }]}>
        解析
      </Text>
      <Text style={[styles.body, { color: colors.text2 }]}>{explanation}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    marginTop: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
  },
});