/** 题型枚举（后两者为真题专用：计算题 / 综合题，均走主观自评） */
export type QuestionType =
  | '单选'
  | '多选'
  | '判断'
  | '填空'
  | '简答'
  | '论述'
  | '材料'
  | '计算'
  | '综合';

/** 题目 */
export interface Question {
  id: string;
  subjectId: string;
  chapter: string;
  type: QuestionType;
  stem: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: number; // 1-5
  tags: string[];
}

/** MVP 支持自动判分的题型 */
export const AUTO_GRADE_TYPES: QuestionType[] = ['单选', '多选', '判断'];

/** 判断题是否为自动判分题型 */
export function isAutoGrade(type: QuestionType): boolean {
  return AUTO_GRADE_TYPES.includes(type);
}
