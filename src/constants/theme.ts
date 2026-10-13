import { darkColors, lightColors, type ThemeColors } from './colors';
import { spacing, radius, blur, appMaxWidth, safeBottom, topPadding } from './spacing';
import { fontSize, fontWeight, fontFamily } from './typography';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  blur: typeof blur;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  fontFamily: typeof fontFamily;
  appMaxWidth: number;
  safeBottom: number;
  topPadding: number;
}

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  spacing,
  radius,
  blur,
  fontSize,
  fontWeight,
  fontFamily,
  appMaxWidth,
  safeBottom,
  topPadding,
};

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  spacing,
  radius,
  blur,
  fontSize,
  fontWeight,
  fontFamily,
  appMaxWidth,
  safeBottom,
  topPadding,
};
