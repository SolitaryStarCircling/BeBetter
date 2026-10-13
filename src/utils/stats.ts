import type { ProgressItem, SubjectStats } from '@/types/progress';

export function calcSubjectStats(
  subjectId: string,
  progress: Record<string, ProgressItem>,
  total: number
): SubjectStats {
  const items = Object.values(progress).filter((p) => p.subjectId === subjectId);
  const done = items.length;
  const correct = items.filter((p) => p.correct).length;
  return {
    subjectId,
    done,
    correct,
    total,
    streak: 0,
    lastPracticeAt: items.length > 0
      ? Math.max(...items.map((i) => i.updatedAt))
      : null,
  };
}

export function calcCorrectRate(done: number, correct: number): number {
  if (done === 0) return 0;
  return Math.round((correct / done) * 100);
}

export function formatRate(rate: number): string {
  return `${rate}%`;
}

export function formatProgress(done: number, total: number): string {
  return `${done}/${total}`;
}
