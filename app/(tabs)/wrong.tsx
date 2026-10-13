import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PageContainer } from '@/components/common/PageContainer';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassButton } from '@/components/glass/GlassButton';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useWrongStore } from '@/store/useWrongStore';
import { getSubjects, getQuestions } from '@/services/questionService';
import { DifficultyTag, TypeTag } from '@/components/question';

export default function WrongPage() {
  const theme = useSettingsStore((s) => s.theme);
  const wrongs = useWrongStore((s) => s.wrongs);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const subjects = useMemo(() => getSubjects(), []);

  // 每个科目未解决错题数
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  const wrongCountBySubject = useMemo(() => {
    const map: Record<string, number> = {};
    for (const w of Object.values(wrongs)) {
      if (!w.resolved) map[w.subjectId] = (map[w.subjectId] || 0) + 1;
    }
    return map;
  }, [wrongs]);

  const totalWrong = subjects.reduce((acc, s) => acc + (wrongCountBySubject[s.id] || 0), 0);

  const activeId = activeSubject || (subjects.find((s) => (wrongCountBySubject[s.id] || 0) > 0)?.id ?? null);

  const wrongQuestions = useMemo(() => {
    if (!activeId) return [];
    const all = getQuestions(activeId);
    const wrongIds = new Set(
      Object.values(wrongs)
        .filter((w) => w.subjectId === activeId && !w.resolved)
        .map((w) => w.questionId)
    );
    return all.filter((q) => wrongIds.has(q.id));
  }, [activeId, wrongs]);

  if (totalWrong === 0) {
    return (
      <PageContainer scroll={false} bottomSpace={theme.safeBottom}>
        <Text style={[styles.title, { color: theme.colors.text }]}>错题本</Text>
        <GlassCard style={styles.emptyCard}>
          <Ionicons name="checkmark-done" size={48} color={theme.colors.green} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>暂无错题</Text>
          <Text style={[styles.emptyHint, { color: theme.colors.text3 }]}>
            答题答错或主观题选「没掌握」的题目会出现在这里
          </Text>
        </GlassCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer scroll={false} bottomSpace={theme.safeBottom}>
      <Text style={[styles.title, { color: theme.colors.text }]}>错题本</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text2 }]}>
        共 {totalWrong} 道错题
      </Text>

      {/* 科目切换 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.subjectTabs}
        contentContainerStyle={styles.subjectTabsContent}
      >
        {subjects.map((s) => {
          const count = wrongCountBySubject[s.id] || 0;
          const active = s.id === activeId;
          return (
            <Pressable
              key={s.id}
              onPress={() => setActiveSubject(count > 0 ? s.id : null)}
              style={[
                styles.subjectTab,
                {
                  backgroundColor: theme.colors.glass,
                  borderColor: theme.colors.outline,
                },
                active && {
                  backgroundColor: s.color,
                  borderColor: s.color,
                },
                count === 0 && { opacity: 0.4 },
              ]}
            >
              <Text style={[styles.subjectTabLabel, { color: active ? '#fff' : theme.colors.text }]}>
                {s.name} {count}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* 一键重做当前科目全部错题（沿用 practice 的 ids 参数，只做这些题） */}
      {activeId && wrongQuestions.length > 0 && (
        <View style={styles.redoWrap}>
          <GlassButton
            label={`重做本科全部错题（${wrongQuestions.length}）`}
            onPress={() =>
              router.push({
                pathname: '/practice/[subjectId]' as const,
                params: {
                  subjectId: activeId,
                  mode: 'wrong',
                  ids: wrongQuestions.map((q) => q.id).join(','),
                },
              })
            }
          />
        </View>
      )}

      <FlatList
        data={wrongQuestions}
        keyExtractor={(q) => q.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => activeId && router.push({ pathname: '/practice/[subjectId]' as const, params: { subjectId: activeId, mode: 'wrong', startId: item.id } })}>
            <GlassCard style={styles.qCard}>
              <View style={styles.qMeta}>
                <TypeTag type={item.type} />
                <DifficultyTag difficulty={item.difficulty} />
              </View>
              <Text style={[styles.qStem, { color: theme.colors.text }]} numberOfLines={2}>
                {item.stem}
              </Text>
              <Text style={[styles.qHint, { color: theme.colors.text3 }]}>
                点此重新练习 ›
              </Text>
            </GlassCard>
          </Pressable>
        )}
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  subjectTabs: {
    marginBottom: 16,
    // 横向 ScrollView 在原生端不会按内容自适应高度，会撑满父级剩余空间，
    // 导致内部胶囊被纵向拉伸成竖椭圆。必须显式限定高度。
    height: 36,
    flexGrow: 0,
  },
  subjectTabsContent: {
    // 横向滚动容器的交叉轴默认为 stretch，会让标签撑满高度；改为居中。
    alignItems: 'center',
  },
  subjectTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
  },
  subjectTabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  redoWrap: {
    marginBottom: 16,
  },
  list: {
    gap: 12,
    paddingBottom: 20,
  },
  qCard: {
    padding: 16,
    gap: 10,
  },
  qMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  qStem: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  qHint: {
    fontSize: 12,
    alignSelf: 'flex-end',
    paddingTop: 4,
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 13,
    textAlign: 'center',
  },
});