import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { darkTheme, lightTheme, type Theme } from '@/constants/theme';
import type { Settings as SettingsType, LastPosition } from '@/types/progress';

interface SettingsState {
  settings: SettingsType;
  theme: Theme;
  setTheme: (mode: SettingsType['theme']) => void;
  setLastPosition: (pos: LastPosition | null) => void;
  clearAll: () => void;
}

const defaultSettings: SettingsType = {
  theme: 'dark',
  lastPosition: null,
};

/** 根据设置模式解析主题（深色优先） */
function resolveTheme(mode: SettingsType['theme']): Theme {
  return mode === 'light' ? lightTheme : darkTheme;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      theme: resolveTheme(defaultSettings.theme),
      setTheme: (mode) =>
        set((state) => ({
          settings: { ...state.settings, theme: mode },
          theme: resolveTheme(mode),
        })),
      setLastPosition: (pos) =>
        set((state) => ({
          settings: { ...state.settings, lastPosition: pos },
        })),
      clearAll: () =>
        set({
          settings: defaultSettings,
          theme: resolveTheme(defaultSettings.theme),
        }),
    }),
    {
      name: 'bebetter-settings',
      storage: createJSONStorage(() => AsyncStorage),
      // 只持久化 settings。theme 是由 settings.theme 派生出的完整主题对象，
      // 若一并持久化，升级后旧快照会覆盖新的主题常量：新增令牌（如 blueSoft）缺失、
      // 已调整的间距（如 safeBottom）不生效。主题一律在 rehydrate 时重新派生。
      partialize: (state) => ({ settings: state.settings }),
      // 历史版本存过已废弃的 'auto'：回落到当时实际生效的主题，避免设置页两个按钮都不高亮
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const mode = state.settings.theme as string;
        const resolved: SettingsType['theme'] =
          mode === 'light' || mode === 'dark'
            ? mode
            : state.theme.mode === 'light'
              ? 'light'
              : 'dark';
        state.setTheme(resolved);
        // 历史版本存的是 lastSubjectId（无 lastPosition）：补为 null，避免读到 undefined
        if (state.settings.lastPosition === undefined) state.setLastPosition(null);
      },
    }
  )
);
