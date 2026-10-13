import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WrongItem } from '@/types/progress';

interface WrongState {
  wrongs: Record<string, WrongItem>; // key: questionId (含 subjectId 前缀)
  addWrong: (subjectId: string, questionId: string) => void;
  recordCorrect: (subjectId: string, questionId: string) => void;
  resolveWrong: (questionId: string) => void;
  getWrongs: (subjectId: string) => WrongItem[];
  getWrongCount: (subjectId: string) => number;
  clearSubject: (subjectId: string) => void;
  clearAll: () => void;
}

const key = (subjectId: string, questionId: string) =>
  `${subjectId}:${questionId}`;

export const useWrongStore = create<WrongState>()(
  persist(
    (set, get) => ({
      wrongs: {},
      addWrong: (subjectId, questionId) =>
        set((state) => {
          const k = key(subjectId, questionId);
          const existing = state.wrongs[k];
          return {
            wrongs: {
              ...state.wrongs,
              [k]: existing
                ? {
                    ...existing,
                    wrongCount: existing.wrongCount + 1,
                    lastWrongAt: Date.now(),
                    resolved: false,
                    correctStreak: 0,
                  }
                : {
                    questionId,
                    subjectId,
                    wrongCount: 1,
                    lastWrongAt: Date.now(),
                    resolved: false,
                    correctStreak: 0,
                  },
            },
          };
        }),
      /** 答对累计：连续答对达 3 次自动标记为已解决（从错题本移除） */
      recordCorrect: (subjectId, questionId) =>
        set((state) => {
          const k = key(subjectId, questionId);
          const existing = state.wrongs[k];
          if (!existing || existing.resolved) return state;
          const nextStreak = (existing.correctStreak ?? 0) + 1;
          return {
            wrongs: {
              ...state.wrongs,
              [k]: {
                ...existing,
                correctStreak: nextStreak,
                resolved: nextStreak >= 3,
              },
            },
          };
        }),
      resolveWrong: (questionId) =>
        set((state) => {
          const k = Object.keys(state.wrongs).find(
            (wk) => state.wrongs[wk].questionId === questionId
          );
          if (!k) return state;
          return {
            wrongs: {
              ...state.wrongs,
              [k]: { ...state.wrongs[k], resolved: true },
            },
          };
        }),
      getWrongs: (subjectId) =>
        Object.values(get().wrongs).filter(
          (w) => w.subjectId === subjectId && !w.resolved
        ),
      getWrongCount: (subjectId) => get().getWrongs(subjectId).length,
      clearSubject: (subjectId) =>
        set((state) => {
          const next = { ...state.wrongs };
          for (const k of Object.keys(next)) {
            if (next[k].subjectId === subjectId) delete next[k];
          }
          return { wrongs: next };
        }),
      clearAll: () => set({ wrongs: {} }),
    }),
    {
      name: 'bebetter-wrong',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
