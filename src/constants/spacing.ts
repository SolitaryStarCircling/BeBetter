/** 8pt 网格间距系统 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

export const blur = {
  low: 20,
  medium: 30,
  high: 40,
} as const;

export const appMaxWidth = 420;
// 悬浮胶囊 56 + 底部偏移 10 + 呼吸 20；页面实际取 insets.bottom + 该值
export const safeBottom = 86;
// 状态栏恒隐藏，顶部需留出屏内明明（刘海/挖孔）空间的呼吸间距
export const topPadding = 28;
