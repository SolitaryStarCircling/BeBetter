import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/common/PageContainer';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { ProgressBar } from '@/components/common/ProgressBar';
import { GlassCard } from '@/components/glass/GlassCard';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useProgressStore } from '@/store/useProgressStore';
import {
  getPaperSubjects,
  getPaperYears,
  getQuestionsByYear,
} from '@/services/questionService';

/**
 * 真题模考 · 年份选择页
 * 按真题科目分组（高数真题 / 政治真题 / 英语真题 …），
 * 每组列出已录入的整卷年份与进度，点击进入该年份整套试卷（原卷题序）。
 */
export default function PaperIndexPage() {
  const theme = useSettingsStore((s) => s.theme);
  const progress = useProgressStore((s) => s.progress);
  const router = useRouter();

  const paperSubjects = getPaperSubjects();

  return (
    <PageContainer>
      <ScreenHeader marginBottom={8} />

      <Text style={[styles.title, { color: theme.colors.text }]}>真题模考</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text2 }]}>
        选择年份开始整套模拟
      </Text>

      {paperSubjects.length === 0 ? (
        <GlassCard style={styles.emptyCard}>
          <Text style={{ color: theme.colors.text3 }}>暂无已录入的真题整卷</Text>
        </GlassCard>
      ) : (
        paperSubjects.map((subject) => {
          const years = getPaperYears(subject.id);
          return (
            <View key={subject.id} style={styles.group}>
              <View style={styles.groupHeader}>
                <View
                  style={[styles.groupDot, { backgroundColor: subject.color }]}
                />
                <Text style={[styles.groupTitle, { color: theme.colors.text }]}>
                  {subject.name}
                </Text>
                <Text style={[styles.groupMeta, { color: theme.colors.text3 }]}>
                  {years.length} 套
                </Text>
              </View>

              {years.length === 0 ? (
                <GlassCard style={styles.emptyCard}>
                  <Text style={{ color: theme.colors.text3 }}>
                    该科目暂未收录整卷
                  </Text>
                </GlassCard>
              ) : (
                years.map(({ year, total }) => {
                  // 该年份已做题数：进度记录以 `${subjectId}:${questionId}` 为键
                  const idSet = new Set(
                    getQuestionsByYear(subject.id, year).map((q) => q.id)
                  );
                  const done = Object.values(progress).filter(
                    (p) => p.subjectId === subject.id && idSet.has(p.questionId)
                  ).length;

                  return (
                    <Pressable
                      key={year}
                      onPress={() =>
                        router.push({
                          pathname: '/practice/[subjectId]',
                          params: {
                            subjectId: subject.id,
                            mode: 'order',
                            year,
                          },
                        })
                      }
                    >
                      <GlassCard style={styles.card}>
                        <View style={styles.row}>
                          <View
                            style={[
                              styles.iconWrap,
                              { backgroundColor: subject.color + '22' },
                            ]}
                          >
                            <Ionicons
                              name="document-text"
                              size={22}
                              color={subject.color}
                            />
                          </View>
                          <View style={styles.info}>
                            <Text
                              style={[styles.year, { color: theme.colors.text }]}
                            >
                              {year} 年真题
                            </Text>
                            <Text
                              style={[styles.meta, { color: theme.colors.text3 }]}
                            >
                              共 {total} 题 · 已做 {done}/{total}
                            </Text>
                          </View>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={theme.colors.text3}
                          />
                        </View>
                        <ProgressBar
                          percent={(done / total) * 100}
                          color={subject.color}
                          style={styles.progress}
                        />
                        <Text
                          style={[styles.hint, { color: theme.colors.text2 }]}
                        >
                          开始模考 ›
                        </Text>
                      </GlassCard>
                    </Pressable>
                  );
                })
              )}
            </View>
          );
        })
      )}
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 20,
  },
  group: {
    marginBottom: 8,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  groupDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  groupMeta: {
    fontSize: 12,
    fontVariant: ['tabular-nums'],
  },
  card: {
    padding: 16,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  year: {
    fontSize: 17,
    fontWeight: '700',
  },
  meta: {
    fontSize: 13,
  },
  progress: {
    marginTop: 14,
  },
  hint: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 10,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
  },
});
