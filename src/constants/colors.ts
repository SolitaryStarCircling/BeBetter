/**
 * BeBetter 颜色系统
 * 深色优先，低饱和渐变 + 抽象光斑
 */

export const darkColors = {
  // 背景
  bg: '#0B0F14',
  bgGradient: '#111720',
  glow1: 'rgba(90, 110, 190, 0.08)',
  glow2: 'rgba(155, 126, 222, 0.06)',
  glow3: 'rgba(61, 220, 151, 0.04)',

  // 玻璃材质
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.16)',
  glassStrong: 'rgba(255, 255, 255, 0.12)',
  // 悬浮底部导航胶囊：必须比其他玻璃更透，让下方滚动的内容能透出来
  navGlass: 'rgba(255, 255, 255, 0.10)',

  // 文字
  text: '#F5F7FA',
  text2: 'rgba(255, 255, 255, 0.6)',
  text3: 'rgba(255, 255, 255, 0.38)',
  sep: 'rgba(255, 255, 255, 0.06)',

  // 进度条底槽等「底衬」元素，需随主题反转
  track: 'rgba(255, 255, 255, 0.10)',
  // 描边（分段控件、胶囊、弹窗边框）。注意：glassBorder 在浅色下是白色，
  // 画在白卡片上等于没有，需要区分「卡片自身的玻璃高光」与「内容描边」两种用途。
  outline: 'rgba(255, 255, 255, 0.16)',

  // 语义色
  blue: '#4D9DE0',
  // 选中态胶囊底（悬浮 TabBar），取自 Ledger --blue-soft
  blueSoft: '#262A3C',
  green: '#3DDC97',
  red: '#E85D75',
  yellow: '#F0B429',
  purple: '#9B7EDE',

  // 科目色
  politics: '#E85D75',
  english: '#4D9DE0',
  math: '#9B7EDE',
  c: '#3DDC97',

  // 难度
  diffEasy: '#3DDC97',
  diffMid: '#F0B429',
  diffHard: '#E85D75',

  // 状态
  stNew: '#4D9DE0',
  stLearning: '#F0B429',
  stReview: '#9B7EDE',
  stMastered: '#3DDC97',
} as const;

export const lightColors = {
  bg: '#F4F3F1',
  bgGradient: '#ECEAE6',
  glow1: 'rgba(90, 110, 190, 0.10)',
  glow2: 'rgba(155, 126, 222, 0.08)',
  glow3: 'rgba(61, 220, 151, 0.06)',

  glass: 'rgba(255, 255, 255, 0.78)',
  glassBorder: 'rgba(255, 255, 255, 0.80)',
  glassStrong: 'rgba(255, 255, 255, 0.92)',
  // 悬浮底部导航胶囊：必须比其他玻璃更透，让下方滚动的内容能透出来
  navGlass: 'rgba(255, 255, 255, 0.58)',

  text: '#1B1A18',
  text2: 'rgba(85, 81, 75, 0.72)',
  text3: 'rgba(140, 134, 127, 0.82)',
  sep: 'rgba(28, 26, 23, 0.065)',

  // 浅色模式必须用深色底槽，否则进度条底衬在近白卡片上不可见
  track: 'rgba(28, 26, 23, 0.09)',
  // 浅色下必须用深色描边，glassBorder 是白色，画在白卡片上不可见
  outline: 'rgba(28, 26, 23, 0.12)',

  blue: '#58619D',
  // 选中态胶囊底（悬浮 TabBar），取自 Ledger --blue-soft
  blueSoft: '#EDEEF6',
  green: '#5E7A63',
  red: '#A2605C',
  yellow: '#B58A2A',
  purple: '#8A678A',

  politics: '#E85D75',
  english: '#4D9DE0',
  math: '#9B7EDE',
  c: '#3DDC97',

  diffEasy: '#6E9A6F',
  diffMid: '#BFA46B',
  diffHard: '#B07A6F',

  stNew: '#58619D',
  stLearning: '#B58A2A',
  stReview: '#9A6BA8',
  stMastered: '#5E7A63',
} as const;

export type ThemeColors = { [K in keyof typeof darkColors]: string };
