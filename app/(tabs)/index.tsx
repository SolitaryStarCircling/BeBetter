import React from 'react';
import { Text, StyleSheet, FlatList, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/common/PageContainer';
import { ProgressBar } from '@/components/common/ProgressBar';
import { GlassCard } from '@/components/glass/GlassCard';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useProgressStore } from '@/store/useProgressStore';
import {
  getSubjects,
  getNormalSubjects,
  getPaperSubjects,
  getPaperYears,
  getScopedQuestions,
} from '@/services/questionService';
import { calcSubjectStats, calcCorrectRate } from '@/utils/stats';

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  book: 'book',
  language: 'language',
  calculator: 'calculator',
  code: 'code-slash',
};

export default function HomePage() {
  const theme = useSettingsStore((s) => s.theme);
  const settings = useSettingsStore((s) => s.settings);
  const progress = useProgressStore((s) => s.progress);
  const normalSubjects = getNormalSubjects();
  const paperSubjects = getPaperSubjects();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const lastPosition = settings.lastPosition;
  const lastSubject = lastPosition
    ? getSubjects().find((s) => s.id === lastPosition.subjectId)
    : undefined;
  // 上次练到第几题（用于续练卡文案）
  const lastIndex =
    lastPosition && lastSubject
      ? getScopedQuestions(lastSubject.id, {
          chapter: lastPosition.chapter,
          year: lastPosition.year,
        }).findIndex((q) => q.id === lastPosition.questionId)
      : -1;
  const lastModeLabel = lastPosition?.year
    ? '真题模考'
    : lastPosition?.chapter
      ? '章节练习'
      : lastPosition?.mode === 'random'
        ? '随机练习'
        : lastPosition?.mode === 'wrong'
          ? '错题练习'
          : '顺序练习';

  return (
    <PageContainer scroll={false} bottomSpace={theme.safeBottom}>
      <Text style={[styles.title, { color: theme.colors.text }]}>BeBetter</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text2 }]}>
        知识练习
      </Text>

      <FlatList
        data={normalSubjects}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            {/* 真题模考：按科目独立成卡，后续新增政治/英语真题只需加配置 */}
            {paperSubjects.length > 0 && (
              <>
                <Text
                  style={[styles.sectionTitle, { color: theme.colors.text2 }]}
                >
                  真题模考
                </Text>
                {paperSubjects.map((subject) => {
                  const yearCount = getPaperYears(subject.id).length;
                  return (
                    <Pressable
                      key={subject.id}
                      onPress={() => router.push('/paper')}
                    >
                      <GlassCard style={styles.paperCard}>
                        <View style={styles.lastRow}>
                          <View
                            style={[
                              styles.lastIcon,
                              { backgroundColor: subject.color + '22' },
                            ]}
                          >
                            <Ionicons
                              name="document-text"
                              size={18}
                              color={subject.color}
                            />
                          </View>
                          <View style={styles.lastInfo}>
                            <Text
                              style={[
                                styles.lastLabel,
                                { color: theme.colors.text2 },
                              ]}
                            >
                              {subject.name}
                            </Text>
                            <Text
                              style={[
                                styles.lastName,
                                { color: theme.colors.text },
                              ]}
                            >
                              {yearCount > 0
                                ? `已收录 ${yearCount} 套整卷`
                                : '暂未收录'}
                            </Text>
                          </View>
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={theme.colors.text3}
                          />
                        </View>
                      </GlassCard>
                    </Pressable>
                  );
                })}
              </>
            )}

            {lastSubject && lastPosition ? (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/practice/[subjectId]' as const,
                    params: {
                      subjectId: lastSubject.id,
                      mode: lastPosition.mode,
                      startId: lastPosition.questionId,
                      ...(lastPosition.chapter
                        ? { chapter: lastPosition.chapter }
                        : {}),
                      ...(lastPosition.year ? { year: lastPosition.year } : {}),
                    },
                  })
                }
              >
                <GlassCard style={styles.lastCard}>
                  <View style={styles.lastRow}>
                    <View
                      style={[
                        styles.lastIcon,
                        { backgroundColor: lastSubject.color + '22' },
                      ]}
                    >
                      <Ionicons
                        name="refresh"
                        size={18}
                        color={lastSubject.color}
                      />
                    </View>
                    <View style={styles.lastInfo}>
                      <Text
                        style={[
                          styles.lastLabel,
                          { color: theme.colors.text2 },
                        ]}
                      >
                        继续上次练习 · {lastModeLabel}
                      </Text>
                      <Text
                        style={[
                          styles.lastName,
                          { color: theme.colors.text },
                        ]}
                        numberOfLines={1}
                      >
                        {lastSubject.name}
                        {lastIndex >= 0 ? ` · 第 ${lastIndex + 1} 题` : ''}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={theme.colors.text3}
                    />
                  </View>
                </GlassCard>
              </Pressable>
            ) : null}

            <Text
              style={[
                styles.sectionTitle,
                styles.sectionTitleSpaced,
                { color: theme.colors.text2 },
              ]}
            >
              科目练习
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const stats = calcSubjectStats(item.id, progress, item.total);
          const rate = calcCorrectRate(stats.done, stats.correct);
          return (
            <Pressable
              key={item.id}
              onPress={() =>
                router.push({
                  pathname: '/subject/[id]' as const,
                  params: { id: item.id },
                })
              }
            >
              <GlassCard style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.header}>
                    <View
                      style={[
                        styles.iconWrap,
                        { backgroundColor: item.color + '22' },
                      ]}
                    >
                      <Ionicons
                        name={ICON_MAP[item.icon] || 'book'}
                        size={24}
                        color={item.color}
                      />
                    </View>
                    <View style={styles.info}>
                      <Text style={[styles.name, { color: theme.colors.text }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.meta, { color: theme.colors.text3 }]}>
                        共 {item.total} 题 · 已做 {stats.done}
                      </Text>
                    </View>
                    <Text style={[styles.rate, { color: item.color }]}>
                      {rate}%
                    </Text>
                  </View>
                  <ProgressBar
                    percent={(stats.done / item.total) * 100}
                    color={item.color}
                  />
                  <Text style={[styles.hint, { color: theme.colors.text2 }]}>
                    继续练习 ›
                  </Text>
                </View>
              </GlassCard>
            </Pressable>
          );
        }}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + theme.safeBottom },
        ]}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  sectionTitleSpaced: {
    marginTop: 8,
  },
  list: {
    gap: 14,
  },
  card: {
    padding: 16,
  },
  lastCard: {
    padding: 14,
    marginBottom: 12,
  },
  paperCard: {
    padding: 14,
    marginBottom: 12,
  },
  lastRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lastIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastInfo: {
    flex: 1,
  },
  lastLabel: {
    fontSize: 12,
  },
  lastName: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  cardContent: {
    gap: 12,
  },
  header: {
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
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  meta: {
    fontSize: 13,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  rate: {
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    alignSelf: 'flex-end',
  },
});
