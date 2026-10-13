import React, { useMemo } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { PageContainer } from '@/components/common/PageContainer';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassButton } from '@/components/glass/GlassButton';
import { TypeTag } from '@/components/question';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useSessionStore } from '@/store/useSessionStore';
import { getSubject, getQuestions } from '@/services/questionService';
import type { Question } from '@/types/question';
import { calcCorrectRate } from '@/utils/stats';

export default function ResultPage() {
  const theme = useSettingsStore((s) => s.theme);
  const session = useSessionStore();
  const router = useRouter();

  const subject = session.subjectId ? getSubject(session.subjectId) : undefined;

  // 本次答错的题目详情（按答错顺序），用于「本次错题」清单
  const wrongQuestions = useMemo<Question[]>(() => {
    if (!session.subjectId) return [];
    const byId = new Map(getQuestions(session.subjectId).map((q) => [q.id, q]));
    return session.wrongIds
      .map((id) => byId.get(id))
      .filter((q): q is Question => !!q);
  }, [session.subjectId, session.wrongIds]);

  const modeLabel = session.year
    ? `${session.year}年真题`
    : session.chapter
      ? `${session.chapter} · 章节练习`
      : session.mode === 'random'
        ? '随机练习'
        : session.mode === 'wrong'
          ? '错题练习'
          : '顺序练习';

  // 直接访问 /result 或会话已失效（App 重启/未经过练习）
  if (!subject || session.total === 0) {
    return (
      <PageContainer>
        <GlassCard style={styles.emptyCard}>
          <Text style={[styles.emptyText, { color: theme.colors.text3 }]}>
            暂无本次练习数据
          </Text>
          <GlassButton
            label="返回首页"
            onPress={() => router.replace('/(tabs)')}
            style={styles.emptyBtn}
          />
        </GlassCard>
      </PageContainer>
    );
  }

  const rate = calcCorrectRate(session.total, session.correct);
  const wrongCount = session.wrongIds.length;

  return (
    <PageContainer>
      <GlassCard style={styles.overviewCard}>
        <Text style={[styles.title, { color: theme.colors.text }]}>练习完成</Text>
        <Text style={[styles.subject, { color: subject.color }]}>
          {subject.name} · {modeLabel}
        </Text>
        <View style={styles.bigRow}>
          <Text style={[styles.bigNum, { color: theme.colors.text }]}>
            {session.correct}
          </Text>
          <Text style={[styles.bigLabel, { color: theme.colors.text3 }]}>
            / {session.total}
          </Text>
        </View>
        <Text style={[styles.rate, { color: theme.colors.blue }]}>
          正确率 {rate}%
        </Text>
        <Text style={[styles.hint, { color: theme.colors.text3 }]}>
          {wrongCount > 0
            ? `答错 ${wrongCount} 题，已加入错题本（连续答对 3 次自动移除）`
            : '全部答对，继续保持'}
        </Text>
      </GlassCard>

      {/* 本次答错题清单：点单题直接从该题重做 */}
      {wrongQuestions.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: theme.colors.text2 }]}>
            本次答错 {wrongQuestions.length} 题
          </Text>
          <View style={styles.wrongList}>
            {wrongQuestions.map((q) => (
              <Pressable
                key={q.id}
                onPress={() =>
                  router.push({
                    pathname: '/practice/[subjectId]',
                    params: {
                      subjectId: subject.id,
                      mode: 'wrong',
                      ids: q.id,
                    },
                  })
                }
              >
                <GlassCard style={styles.wrongCard}>
                  <TypeTag type={q.type} />
                  <Text
                    style={[styles.wrongStem, { color: theme.colors.text }]}
                    numberOfLines={2}
                  >
                    {q.stem}
                  </Text>
                  <Text style={[styles.qHint, { color: theme.colors.text3 }]}>
                    点此重做 ›
                  </Text>
                </GlassCard>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {wrongCount > 0 && (
        <GlassButton
          label={`重做本次错题（${wrongCount}）`}
          onPress={() =>
            router.push({
              pathname: '/practice/[subjectId]',
              params: {
                subjectId: subject.id,
                mode: 'wrong',
                ids: session.wrongIds.join(','),
              },
            })
          }
        />
      )}
      <View style={styles.spacer} />
      <GlassButton
        label="返回首页"
        variant="secondary"
        onPress={() => router.replace('/(tabs)')}
      />
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  overviewCard: {
    padding: 28,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subject: {
    fontSize: 13,
    fontWeight: '500',
  },
  bigRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
  },
  bigNum: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -2,
  },
  bigLabel: {
    fontSize: 22,
    fontWeight: '600',
  },
  rate: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 4,
  },
  hint: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  spacer: {
    height: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 12,
  },
  wrongList: {
    gap: 12,
    marginBottom: 16,
  },
  wrongCard: {
    padding: 16,
    gap: 10,
  },
  wrongStem: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  qHint: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  emptyBtn: {
    alignSelf: 'center',
    marginTop: 16,
  },
});
