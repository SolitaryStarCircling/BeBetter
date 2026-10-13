import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PageContainer } from '@/components/common/PageContainer';
import { ProgressBar } from '@/components/common/ProgressBar';
import { GlassCard } from '@/components/glass/GlassCard';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useProgressStore } from '@/store/useProgressStore';
import { getSubjects } from '@/services/questionService';
import { calcSubjectStats, calcCorrectRate } from '@/utils/stats';

export default function StatsPage() {
  const theme = useSettingsStore((s) => s.theme);
  const progress = useProgressStore((s) => s.progress);
  const subjects = getSubjects();

  const stats = useMemo(() => {
    const perSubject = subjects.map((s) => {
      const st = calcSubjectStats(s.id, progress, s.total);
      return { subject: s, ...st };
    });
    const totalDone = perSubject.reduce((acc, s) => acc + s.done, 0);
    const totalCorrect = perSubject.reduce((acc, s) => acc + s.correct, 0);
    const rate = calcCorrectRate(totalDone, totalCorrect);
    return { totalDone, totalCorrect, rate, perSubject };
  }, [progress, subjects]);

  return (
    <PageContainer bottomSpace={theme.safeBottom}>
      <Text style={[styles.title, { color: theme.colors.text }]}>统计</Text>
      {/* 总览卡 */}
      <GlassCard style={styles.overviewCard}>
        <View style={styles.bigRow}>
          <Text style={[styles.bigNum, { color: theme.colors.text }]}>
            {stats.totalDone}
          </Text>
          <Text style={[styles.bigLabel, { color: theme.colors.text3 }]}>已做</Text>
          <Text style={[styles.bigNum, { color: theme.colors.green }]}>
            {stats.totalCorrect}
          </Text>
          <Text style={[styles.bigLabel, { color: theme.colors.text3 }]}>答对</Text>
        </View>
        <View style={styles.rateRow}>
          <Text style={[styles.rateNum, { color: theme.colors.blue }]}>
            {stats.rate}%
          </Text>
          <Text style={[styles.rateLabel, { color: theme.colors.text3 }]}>总正确率</Text>
        </View>
      </GlassCard>

      {/* 各科进度 */}
      <Text style={[styles.sectionTitle, { color: theme.colors.text2 }]}>
        各科进度
      </Text>
      <View style={styles.subjectList}>
        {stats.perSubject.map((s) => {
          const pct = s.total > 0 ? (s.done / s.total) * 100 : 0;
          const subRate = calcCorrectRate(s.done, s.correct);
          return (
            <GlassCard key={s.subject.id} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <Text style={[styles.subjectName, { color: theme.colors.text }]}>
                  {s.subject.name}
                </Text>
                <Text style={[styles.subjectNum, { color: s.subject.color }]}>
                  {s.done}/{s.total} · {subRate}%
                </Text>
              </View>
              <ProgressBar percent={pct} color={s.subject.color} />
            </GlassCard>
          );
        })}
      </View>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  overviewCard: {
    padding: 24,
    marginBottom: 24,
    gap: 20,
  },
  bigRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
  },
  bigNum: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -1.5,
  },
  bigLabel: {
    fontSize: 13,
    marginHorizontal: 4,
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 8,
  },
  rateNum: {
    fontSize: 28,
    fontWeight: '700',
  },
  rateLabel: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  subjectList: {
    gap: 12,
  },
  subjectCard: {
    padding: 16,
    gap: 12,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
  },
  subjectNum: {
    fontSize: 14,
    fontWeight: '600',
  },
});