import { create } from 'zustand';

interface SessionState {
  /** 本次练习会话（非持久化，仅内存；小结页数据源） */
  subjectId: string | null;
  mode: string | null;
  /** 真题整卷的年份；普通练习为 null */
  year: string | null;
  /** 章节练习的章节名；非章节练习为 null */
  chapter: string | null;
  total: number;
  correct: number;
  wrongIds: string[];
  setSession: (s: {
    subjectId: string;
    mode: string;
    total: number;
    year?: string | null;
    chapter?: string | null;
  }) => void;
  addResult: (correct: boolean, questionId: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  subjectId: null,
  mode: null,
  year: null,
  chapter: null,
  total: 0,
  correct: 0,
  wrongIds: [],
  setSession: ({ subjectId, mode, total, year = null, chapter = null }) =>
    set({ subjectId, mode, year, chapter, total, correct: 0, wrongIds: [] }),
  addResult: (correct, questionId) =>
    set((state) => ({
      correct: correct ? state.correct + 1 : state.correct,
      wrongIds: correct ? state.wrongIds : [...state.wrongIds, questionId],
    })),
  clearSession: () =>
    set({
      subjectId: null,
      mode: null,
      year: null,
      chapter: null,
      total: 0,
      correct: 0,
      wrongIds: [],
    }),
}));
