import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { ThemeColors } from '@/constants/colors';
import { ProgressBar } from '@/components/common/ProgressBar';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassButton } from '@/components/glass/GlassButton';
import { useProgressStore } from '@/store/useProgressStore';
import { useWrongStore } from '@/store/useWrongStore';
import { useSessionStore } from '@/store/useSessionStore';
import { getQuestions, getShuffledQuestions, getScopedQuestions, getQuestionsByIds } from '@/services/questionService';
import { isAutoGrade, type Question } from '@/types/question';
import { checkAnswer, optionLetter } from '@/utils/answer';
import {
  QuestionCard,
  OptionItem,
  Explanation,
  SubjectiveCard,
  type OptionState,
  type SelfGrade,
} from '@/components/question';

type PracticeMode = 'order' | 'random' | 'wrong';

export default function PracticePage() {
  const { subjectId, mode, startId, year, chapter, ids } = useLocalSearchParams<{
    subjectId: string;
    mode?: string;
    startId?: string;
    year?: string;
    chapter?: string;
    ids?: string;
  }>();
  const practiceMode: PracticeMode = mode === 'random' ? 'random' : mode === 'wrong' ? 'wrong' : 'order';

  const theme = useSettingsStore((s) => s.theme);
  const setLastPosition = useSettingsStore((s) => s.setLastPosition);
  const recordAnswer = useProgressStore((s) => s.recordAnswer);
  const wrongs = useWrongStore((s) => s.wrongs);
  const addWrong = useWrongStore((s) => s.addWrong);
  const recordCorrect = useWrongStore((s) => s.recordCorrect);
  const setSession = useSessionStore((s) => s.setSession);
  const addResult = useSessionStore((s) => s.addResult);
  const router = useRouter();

  // 题集：进入页面时固定一次（惰性初始化），避免后续 store 更新触发重新洗牌/重建。
  // 整卷模考（year）/ 章节练习（chapter）按范围取题；随机取题库打乱；
  // 错题模式：带 ids 时取本次指定错题（结果页「重做错题」），否则取该科全部未解决错题。
  const [questions] = useState<Question[]>(() => {
    if (practiceMode === 'wrong') {
      if (ids) return getQuestionsByIds(subjectId, ids.split(','));
      const all = getQuestions(subjectId);
      const wrongQuestionIds = new Set(
        Object.values(wrongs)
          .filter((w) => w.subjectId === subjectId && !w.resolved)
          .map((w) => w.questionId)
      );
      return all.filter((q) => wrongQuestionIds.has(q.id));
    }
    if (practiceMode === 'random') return getShuffledQuestions(subjectId);
    return getScopedQuestions(subjectId, { chapter, year });
  });

  // 进入练习即登记本次会话（小结页数据源）
  useEffect(() => {
    setSession({
      subjectId,
      mode: practiceMode,
      total: questions.length,
      year: year ?? null,
      chapter: chapter ?? null,
    });
  }, [setSession, subjectId, practiceMode, questions.length, year, chapter]);

  // 定位到指定起始题（错题本/续练传 startId），否则从 0 开始
  const [index, setIndex] = useState(() => {
    if (!startId) return 0;
    const idx = questions.findIndex((q) => q.id === startId);
    return idx >= 0 ? idx : 0;
  });
  const [exitConfirm, setExitConfirm] = useState(false);

  // 记录当前位置，供首页「继续上次练习」直接回到该题
  useEffect(() => {
    const q = questions[index];
    if (!q) return;
    setLastPosition({
      subjectId,
      mode: practiceMode,
      questionId: q.id,
      chapter: chapter ?? null,
      year: year ?? null,
    });
  }, [setLastPosition, questions, index, subjectId, practiceMode, chapter, year]);

  const goNext = () => {
    if (index < questions.length - 1) setIndex(index + 1);
    else router.replace('/result');
  };

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (questions.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.bg }, styles.center]}>
        <Text style={{ color: theme.colors.text3 }}>
          {practiceMode === 'wrong' ? '暂无错题' : '没有可用的题目'}
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={[styles.exitLabel, { color: theme.colors.blue }]}>
            返回
          </Text>
        </Pressable>
      </View>
    );
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
      <View style={styles.topBar}>
        <Pressable onPress={goPrev} disabled={index === 0} style={styles.topBtn}>
          <Ionicons name="chevron-back" size={22} color={index === 0 ? theme.colors.text3 : theme.colors.blue} />
        </Pressable>
        <Text
          style={[styles.modeLabel, { color: theme.colors.text2 }]}
          numberOfLines={1}
        >
          {year
            ? `${year}年真题模考`
            : chapter
              ? chapter
              : practiceMode === 'random'
                ? '随机练习'
                : practiceMode === 'wrong'
                  ? '错题练习'
                  : '顺序练习'}
        </Text>
        <Pressable onPress={() => setExitConfirm(true)} style={styles.topBtn}>
          <Text style={[styles.exitLabel, { color: theme.colors.blue }]}>
            退出
          </Text>
        </Pressable>
      </View>

      {/* 练习进度：位置可视化（题号文字由 QuestionCard 承担，此处不重复） */}
      <View style={styles.progressWrap}>
        <ProgressBar
          percent={((index + 1) / questions.length) * 100}
          color={theme.colors.blue}
        />
      </View>

      {/* 用 key 强制切换题目时重挂载，重置题目级状态 */}
      <PracticeQuestion
        key={`${subjectId}-${question.id}`}
        question={question}
        index={index}
        total={questions.length}
        accentColor={theme.colors.blue}
        colors={theme.colors}
        last={isLast}
        onRecord={(selected, correct) => {
          recordAnswer({
            subjectId: question.subjectId,
            questionId: question.id,
            status: correct ? 'mastered' : 'review',
            selected,
            correct,
          });
          addResult(correct, question.id);
          if (correct) recordCorrect(question.subjectId, question.id);
          else addWrong(question.subjectId, question.id);
        }}
        onNext={goNext}
      />

      <GlassModal visible={exitConfirm} onClose={() => setExitConfirm(false)}>
        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
          退出本次练习？
        </Text>
        <Text style={[styles.modalBody, { color: theme.colors.text2 }]}>
          进度已自动保存，下次可从首页「继续上次练习」接着做。
        </Text>
        <View style={styles.modalActions}>
          <GlassButton
            label="继续练习"
            variant="secondary"
            onPress={() => setExitConfirm(false)}
            style={styles.modalBtn}
          />
          <GlassButton
            label="退出"
            onPress={() => {
              setExitConfirm(false);
              router.back();
            }}
            style={styles.modalBtn}
          />
        </View>
      </GlassModal>
    </View>
  );
}

interface PracticeQuestionProps {
  question: Question;
  index: number;
  total: number;
  accentColor: string;
  colors: ThemeColors;
  last: boolean;
  onRecord: (selected: string | string[] | SelfGrade, correct: boolean) => void;
  onNext: () => void;
}

function PracticeQuestion({
  question,
  index,
  total,
  accentColor,
  colors,
  last,
  onRecord,
  onNext,
}: PracticeQuestionProps) {
  const autoGrade = isAutoGrade(question.type);
  const isMulti = question.type === '多选';

  const [selected, setSelected] = useState<string | string[] | null>(null);
  const [selfGrade, setSelfGrade] = useState<SelfGrade | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const toggleMulti = (letter: string) => {
    setSelected((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      return arr.includes(letter) ? arr.filter((l) => l !== letter) : [...arr, letter];
    });
  };

  const handleSubmit = () => {
    if (selected === null) return;
    const correct = checkAnswer(question, selected as string | string[]);
    onRecord(selected as string | string[], correct);
    setSubmitted(true);
  };

  const handleSelfGrade = (grade: SelfGrade) => {
    const isCorrect = grade === 'mastered';
    onRecord(grade, isCorrect);
    setSelfGrade(grade);
  };

  const optionStates = useMemo<OptionState[]>(() => {
    if (!autoGrade) return [];
    return question.options.map((_, i) => {
      const letter = optionLetter(i);
      const isSelected = isMulti
        ? Array.isArray(selected) && selected.includes(letter)
        : selected === letter;
      if (!submitted) return isSelected ? 'selected' : 'idle';
      if (question.answer.includes(letter)) return 'correct';
      if (isSelected) return 'wrong';
      return 'idle';
    });
  }, [autoGrade, submitted, selected, question, isMulti]);

  const canNext = autoGrade ? submitted : selfGrade !== null;
  const canSubmit = autoGrade && selected !== null;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <QuestionCard question={question} index={index} total={total}>
        {autoGrade ? (
          <>
            {question.options.map((opt, i) => (
              <OptionItem
                key={i}
                index={i}
                text={opt}
                state={optionStates[i]}
                disabled={submitted}
                accentColor={accentColor}
                onPress={() => (isMulti ? toggleMulti(optionLetter(i)) : setSelected(optionLetter(i)))}
              />
            ))}

            {autoGrade && !isMulti && (
              <Pressable onPress={() => setSelected(null)} style={styles.clearBtn} disabled={!canSubmit}>
                <Text style={{ color: colors.text3, fontSize: 13 }}>清空</Text>
              </Pressable>
            )}

            {submitted && (
              <Explanation
                explanation={question.explanation}
                correct={optionStates.every((s) => s !== 'wrong')}
              />
            )}
          </>
        ) : (
          <SubjectiveCard
            explanation={question.explanation}
            disabled={selfGrade !== null}
            onGrade={handleSelfGrade}
          />
        )}
      </QuestionCard>

      <View style={[styles.bottomBar, { borderTopColor: colors.sep }]}>
        {autoGrade && !submitted ? (
          <Pressable onPress={handleSubmit} disabled={!canSubmit} style={[styles.nextBtn, { backgroundColor: canSubmit ? accentColor : colors.glass }]}>
            <Text style={[styles.nextLabel, { color: canSubmit ? '#fff' : colors.text3 }]}>
              提交
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={onNext} disabled={!canNext} style={[styles.nextBtn, { backgroundColor: canNext ? accentColor : colors.glass }]}>
            <Text style={[styles.nextLabel, { color: canNext ? '#fff' : colors.text3 }]}>
              {last ? '完成' : '下一题'}
            </Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 12,
    height: 52,
  },
  topBtn: {
    minWidth: 56,
    alignItems: 'center',
  },
  modeLabel: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  // 与 ScreenHeader 同规格，保证「退出」与其他页返回入口视觉一致
  exitLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  progressWrap: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  clearBtn: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  bottomBar: {
    marginTop: 16,
    borderTopWidth: 0.5,
    paddingTop: 14,
  },
  nextBtn: {
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});