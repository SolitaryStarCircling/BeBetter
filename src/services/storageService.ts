import AsyncStorage from '@react-native-async-storage/async-storage';

/** 通用 AsyncStorage 封装 */
export async function loadJSON<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

export async function saveJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export const STORAGE_KEYS = {
  SETTINGS: 'bebetter-settings',
  PROGRESS: 'bebetter-progress',
  WRONG: 'bebetter-wrong',
} as const;
