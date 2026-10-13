import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/store/useSettingsStore';
import { GlassCard } from '@/components/glass/GlassCard';

export type SelfGrade = 'mastered' | 'not-mastered';

interface SubjectiveCardProps {
  explanation: string;
  disabled: boolean;
  onGrade: (grade: SelfGrade) => void;
}

/**
 * 主观题（简答/论述/材料/填空）自评交互
 * - 先展示「查看参考答案」
 * - 点开后展开参考答案（explanation）
 * - 再点「我掌握了 / 没掌握」完成自评（不做自动判分）
 */
export function SubjectiveCard({ explanation, disabled, onGrade }: SubjectiveCardProps) {
  const theme = useSettingsStore((s) => s.theme);
  const colors = theme.colors;
  const [showAnswer, setShowAnswer] = useState(false);

  if (!showAnswer) {
    return (
      <GlassCard style={styles.answerGate}>
        <Ionicons name="eye-outline" size={28} color={colors.text3} />
        <Text style={[styles.gateTitle, { color: colors.text }]}>主观题 · 自评作答</Text>
        <Text style={[styles.gateHint, { color: colors.text3 }]}>
          先在心里作答，再对照参考答案自评，不做自动判分
        </Text>
        <Pressable
          onPress={() => setShowAnswer(true)}
          disabled={disabled}
          style={({ pressed }) => [styles.primaryBtn, { backgroundColor: colors.blue, opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.primaryLabel}>查看参考答案</Text>
        </Pressable>
      </GlassCard>
    );
  }

  return (
    <View style={styles.resultWrap}>
      <View style={[styles.answerBox, { backgroundColor: colors.blue + '14', borderColor: colors.blue + '40' }]}>
        <Text style={[styles.answerTitle, { color: colors.blue }]}>参考答案</Text>
        <Text style={[styles.answerBody, { color: colors.text }]}>{explanation || '（本题暂无参考答案）'}</Text>
      </View>

      <View style={styles.gradeRow}>
        <Pressable
          onPress={() => onGrade('not-mastered')}
          disabled={disabled}
          style={({ pressed }) => [
            styles.gradeBtn,
            { backgroundColor: colors.red + '1F', borderColor: colors.red + '55', opacity: pressed && !disabled ? 0.8 : 1 },
          ]}
        >
          <Text style={[styles.gradeLabel, { color: colors.red }]}>没掌握</Text>
        </Pressable>
        <Pressable
          onPress={() => onGrade('mastered')}
          disabled={disabled}
          style={({ pressed }) => [
            styles.gradeBtn,
            { backgroundColor: colors.green + '1F', borderColor: colors.green + '55', opacity: pressed && !disabled ? 0.8 : 1 },
          ]}
        >
          <Text style={[styles.gradeLabel, { color: colors.green }]}>我掌握了</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  answerGate: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  gateTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  gateHint: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  primaryBtn: {
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  primaryLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  resultWrap: {
    gap: 16,
  },
  answerBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  answerTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  answerBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gradeBtn: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  gradeLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
});