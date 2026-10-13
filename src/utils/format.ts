/** 格式化时间戳为简短日期 */
export function formatTime(ts: number | null): string {
  if (!ts) return '未练习';
  const d = new Date(ts);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  return `${month}/${day}`;
}

/** 格式化难度数字为中文标签 */
export function formatDifficulty(diff: number): string {
  const map: Record<number, string> = {
    1: '简单',
    2: '较易',
    3: '中等',
    4: '较难',
    5: '困难',
  };
  return map[diff] || '中等';
}
