/** 单题进度 */
export interface ProgressItem {
  subjectId: string;
  questionId: string;
  status: 'new' | 'learning' | 'review' | 'mastered';
  selected: string | string[];
  correct: boolean;
  updatedAt: number;
}

/** 错题本条目 */
export interface WrongItem {
  questionId: string;
  subjectId: string;
  wrongCount: number;
  /** 连续答对次数，答错清零；累计达 3 次自动标记 resolved */
  correctStreak: number;
  lastWrongAt: number;
  resolved: boolean;
}

/** 科目统计 */
export interface SubjectStats {
  subjectId: string;
  done: number;
  correct: number;
  total: number;
  streak: number;
  lastPracticeAt: number | null;
}

/** 全局统计 */
export interface GlobalStats {
  totalDone: number;
  totalCorrect: number;
  subjectStats: Record<string, SubjectStats>;
}

/** 上次练习位置（首页「继续上次练习」直接回到该题） */
export interface LastPosition {
  subjectId: string;
  mode: 'order' | 'random' | 'wrong';
  questionId: string;
  /** 章节练习时的章节名；非章节练习为 null */
  chapter: string | null;
  /** 真题整卷的年份；普通练习为 null */
  year: string | null;
}

/** 用户设置 */
export interface Settings {
  theme: 'light' | 'dark';
  lastPosition: LastPosition | null;
}
