import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettingsStore } from '@/store/useSettingsStore';
import { DifficultyTag, TypeTag } from './Tags';
import type { Question } from '@/types/question';

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  children: React.ReactNode;
}

/** 题干卡片：序号/类型/难度标签 + 题干主文，下方承接选项/主观题区 */
export function QuestionCard({ question, index, total, children }: QuestionCardProps) {
  const theme = useSettingsStore((s) => s.theme);
  const colors = theme.colors;

  return (
    <View style={styles.container}>
      <View style={styles.metaRow}>
        <View style={styles.tagsRow}>
          <TypeTag type={question.type} />
          <DifficultyTag difficulty={question.difficulty} />
        </View>
        <View style={styles.progress}>
          <Text style={{ color: colors.text3, fontSize: 13 }}>
            {index + 1}/{total}
          </Text>
        </View>
      </View>

      <Text style={[styles.stem, { color: colors.text }]}>{question.stem}</Text>
      {!!question.chapter && (
        <Text style={[styles.chapter, { color: colors.text3 }]}>{question.chapter}</Text>
      )}

      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progress: {},
  stem: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '600',
  },
  chapter: {
    fontSize: 13,
    marginTop: 4,
  },
  body: {
    marginTop: 6,
    gap: 10,
  },
});