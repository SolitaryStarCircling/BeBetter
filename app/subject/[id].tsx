import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/common/PageContainer';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { GlassCard } from '@/components/glass/GlassCard';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useWrongStore } from '@/store/useWrongStore';
import { getSubject, getChapters, getScopedQuestions } from '@/services/questionService';
import { calcSubjectStats, calcCorrectRate } from '@/utils/stats';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  book: 'book',
  language: 'language',
  calculator: 'calculator',
  code: 'code-slash',
};

export default function SubjectDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useSettingsStore((s) => s.theme);
  const progress = useProgressStore((s) => s.progress);
  const wrongCount = useWrongStore((s) => s.getWrongCount(id));
  const subject = getSubject(id);
  const router = useRouter();

  if (!subject) {
    return (
      <PageContainer>
        <Text style={{ color: theme.colors.text }}>未找到科目</Text>
      </PageContainer>
    );
  }

  const stats = calcSubjectStats(subject.id, progress, subject.total);
  const rate = calcCorrectRate(stats.done, stats.correct);
  const chapters = getChapters(subject.id);

  // 章节进度：progress 以 `${subjectId}:${questionId}` 为键
  const chapterRows = chapters.map((chapter) => {
    const questions = getScopedQuestions(subject.id, { chapter });
    const done = questions.filter(
      (q) => progress[`${subject.id}:${q.id}`]
    ).length;
    return { chapter, total: questions.length, done };
  });

  const practiceModes = [
    { label: '顺序练习', icon: 'arrow-forward' as const, mode: 'order' },
    { label: '随机练习', icon: 'shuffle' as const, mode: 'random' },
    { label: `错题练习 (${wrongCount})`, icon: 'close-circle' as const, mode: 'wrong' },
  ];

  return (
    <PageContainer>
      <ScreenHeader />

      {/* 科目概览 */}
      <GlassCard style={styles.overviewCard}>
        <View style={styles.overviewHeader}>
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: subject.color + '22' },
            ]}
          >
            <Ionicons
              name={ICON_MAP[subject.icon] || 'book'}
              size={28}
              color={subject.color}
            />
          </View>
          <View style={styles.overviewInfo}>
            <Text style={[styles.subjectName, { color: theme.colors.text }]}>
              {subject.name}
            </Text>
            <Text style={[styles.subjectMeta, { color: theme.colors.text3 }]}>
              共 {subject.total} 题 · {chapters.length} 章
            </Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: theme.colors.text }]}>
              {stats.done}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text3 }]}>
              已做
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: theme.colors.green }]}>
              {stats.correct}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text3 }]}>
              答对
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: subject.color }]}>
              {rate}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text3 }]}>
              正确率
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNum, { color: theme.colors.red }]}>
              {wrongCount}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.text3 }]}>
              错题
            </Text>
          </View>
        </View>
      </GlassCard>

      {/* 练习模式 */}
      <View style={styles.modesContainer}>
        {practiceModes.map((mode, index) => (
          <Pressable
            key={mode.mode}
            onPress={() =>
              router.push({
                pathname: '/practice/[subjectId]' as const,
                params: { subjectId: subject.id, mode: mode.mode },
              })
            }
          >
            <GlassCard style={styles.modeCard}>
              <View style={styles.modeRow}>
                <Ionicons name={mode.icon} size={22} color={subject.color} />
                <Text style={[styles.modeLabel, { color: theme.colors.text }]}>
                  {mode.label}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={theme.colors.text3}
                />
              </View>
            </GlassCard>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text2 }]}>
        章节目录
      </Text>

      {/* 章节列表：可点击按章刷题，跟随整页滚动，不再内嵌 ScrollView（避免嵌套滚动） */}
      <View style={styles.chaptersList}>
        {chapterRows.map(({ chapter, total, done }) => (
          <Pressable
            key={chapter}
            onPress={() =>
              router.push({
                pathname: '/practice/[subjectId]' as const,
                params: { subjectId: subject.id, mode: 'order', chapter },
              })
            }
          >
            <View style={styles.chapterRow}>
              <View
                style={[styles.chapterDot, { backgroundColor: theme.colors.text3 }]}
              />
              <Text
                style={[styles.chapterText, { color: theme.colors.text2 }]}
                numberOfLines={2}
              >
                {chapter}
              </Text>
              <Text
                style={[styles.chapterMeta, { color: theme.colors.text3 }]}
              >
                {done}/{total}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={theme.colors.text3}
              />
            </View>
          </Pressable>
        ))}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  overviewCard: {
    padding: 20,
    marginBottom: 24,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overviewInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subjectMeta: {
    fontSize: 13,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 22,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  modesContainer: {
    gap: 10,
    marginBottom: 24,
  },
  modeCard: {
    padding: 16,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  chaptersList: {
    paddingBottom: 8,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  chapterDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
  },
  chapterText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  chapterMeta: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
});
