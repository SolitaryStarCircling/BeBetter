/** 字号阶梯 + 字重 */
export const fontSize = {
  caption: 11,
  xs: 12,
  sm: 13,
  base: 14,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  display: 34,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/** 字体栈 */
export const fontFamily = {
  sans: undefined, // RN 默认系统字体
  mono: 'SF Mono',
};
