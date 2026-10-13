import subjectsData from '@assets/subjects.json';
import mathQuestions from '@assets/questions/math.json';
import englishQuestions from '@assets/questions/english.json';
import politicsQuestions from '@assets/questions/politics.json';
import mathRealQuestions from '@assets/questions/math-real.json';
import politicsRealQuestions from '@assets/questions/politics-real.json';
import englishRealQuestions from '@assets/questions/english-real.json';
import type { Subject, Question, QuestionType } from '@/types';

const QUESTION_BANKS: Record<string, Question[]> = {
  math: mathQuestions as Question[],
  english: englishQuestions as Question[],
  politics: politicsQuestions as Question[],
  'math-real': mathRealQuestions as Question[],
  'politics-real': politicsRealQuestions as Question[],
  'english-real': englishRealQuestions as Question[],
};

export function getSubjects(): Subject[] {
  return (subjectsData as Subject[])
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);
}

/** 普通练习科目（排除真题整卷科目） */
export function getNormalSubjects(): Subject[] {
  return getSubjects().filter((s) => s.kind !== 'real');
}

/** 真题整卷科目（高数真题 / 政治真题 / 英语真题 …） */
export function getPaperSubjects(): Subject[] {
  return getSubjects().filter((s) => s.kind === 'real');
}

export function getSubject(id: string): Subject | undefined {
  return getSubjects().find((s) => s.id === id);
}

export function getQuestions(subjectId: string): Question[] {
  return QUESTION_BANKS[subjectId] || [];
}

export function getQuestionsByType(subjectId: string, type: QuestionType): Question[] {
  return getQuestions(subjectId).filter((q) => q.type === type);
}

export function getChapters(subjectId: string): string[] {
  const chapters = new Set<string>();
  for (const q of getQuestions(subjectId)) {
    if (q.chapter) chapters.add(q.chapter);
  }
  return Array.from(chapters).sort();
}

/** 随机打乱题目顺序 */
export function getShuffledQuestions(subjectId: string): Question[] {
  const questions = [...getQuestions(subjectId)];
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  return questions;
}

/** 真题章节命名规则：{年份}年真题 */
export const PAPER_CHAPTER_RE = /^(\d{4})年真题$/;

/** 列出指定真题科目已有整卷的年份与题量（按年份由近及远排序） */
export function getPaperYears(subjectId: string): { year: string; total: number }[] {
  const counts = new Map<string, number>();
  for (const q of getQuestions(subjectId)) {
    const matched = PAPER_CHAPTER_RE.exec(q.chapter);
    if (matched) counts.set(matched[1], (counts.get(matched[1]) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([year, total]) => ({ year, total }))
    .sort((a, b) => b.year.localeCompare(a.year));
}

/** 取指定真题科目某一年整卷（保持原卷题序） */
export function getQuestionsByYear(subjectId: string, year: string): Question[] {
  const chapter = `${year}年真题`;
  return getQuestions(subjectId).filter((q) => q.chapter === chapter);
}

/**
 * 按范围取题（练习页 / 首页续练共用，避免各处重复筛选逻辑）
 * - year 优先：整卷原序
 * - chapter：按章节筛选
 * - 都不传：全量
 */
export function getScopedQuestions(
  subjectId: string,
  scope: { chapter?: string | null; year?: string | null } = {}
): Question[] {
  if (scope.year) return getQuestionsByYear(subjectId, scope.year);
  if (scope.chapter) {
    return getQuestions(subjectId).filter((q) => q.chapter === scope.chapter);
  }
  return getQuestions(subjectId);
}

/** 按 id 取题（保持传入的 id 顺序，找不到的忽略） */
export function getQuestionsByIds(subjectId: string, ids: string[]): Question[] {
  const byId = new Map(getQuestions(subjectId).map((q) => [q.id, q]));
  return ids
    .map((id) => byId.get(id))
    .filter((q): q is Question => !!q);
}
