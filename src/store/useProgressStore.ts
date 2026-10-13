import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProgressItem } from '@/types/progress';

interface ProgressState {
  progress: Record<string, ProgressItem>; // key: `${subjectId}:${questionId}`
  recordAnswer: (item: Omit<ProgressItem, 'updatedAt'>) => void;
  getProgress: (subjectId: string) => ProgressItem[];
  getDoneCount: (subjectId: string) => number;
  getCorrectCount: (subjectId: string) => number;
  isDone: (subjectId: string, questionId: string) => boolean;
  clearSubject: (subjectId: string) => void;
  clearAll: () => void;
}

const key = (subjectId: string, questionId: string) =>
  `${subjectId}:${questionId}`;

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      recordAnswer: (item) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [key(item.subjectId, item.questionId)]: {
              ...item,
              updatedAt: Date.now(),
            },
          },
        })),
      getProgress: (subjectId) =>
        Object.values(get().progress).filter((p) => p.subjectId === subjectId),
      getDoneCount: (subjectId) => get().getProgress(subjectId).length,
      getCorrectCount: (subjectId) =>
        get().getProgress(subjectId).filter((p) => p.correct).length,
      isDone: (subjectId, questionId) =>
        !!get().progress[key(subjectId, questionId)],
      clearSubject: (subjectId) =>
        set((state) => {
          const next = { ...state.progress };
          for (const k of Object.keys(next)) {
            if (next[k].subjectId === subjectId) delete next[k];
          }
          return { progress: next };
        }),
      clearAll: () => set({ progress: {} }),
    }),
    {
      name: 'bebetter-progress',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
