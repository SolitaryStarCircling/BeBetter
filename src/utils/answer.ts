import type { Question } from '@/types/question';

/**
 * 判分逻辑
 * - 单选/判断：selected(单个字母) 与 answer 全等
 * - 多选：selected(字母数组) 排序后与 answer 的字母集合一致
 */
export function checkAnswer(
  question: Question,
  selected: string | string[]
): boolean {
  if (question.type === '多选') {
    const selSet = new Set(Array.isArray(selected) ? selected : [selected]);
    const ansSet = new Set(question.answer.split(''));
    if (selSet.size !== ansSet.size) return false;
    for (const s of selSet) if (!ansSet.has(s)) return false;
    return true;
  }
  // 单选 / 判断：answer 为单个值（字母或"对"/"错"）
  const sel = Array.isArray(selected) ? selected[0] : selected;
  return sel === question.answer;
}

/** 多选：选中项字母集合是否等于答案字母集合（用于提前高亮） */
export function isMultiSelected(options: string[], selected: string[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  options.forEach((_, i) => {
    map[String.fromCharCode(65 + i)] = selected.includes(String.fromCharCode(65 + i));
  });
  return map;
}

/** 返回选项对应字母 */
export function optionLetter(index: number): string {
  return String.fromCharCode(65 + index);
}