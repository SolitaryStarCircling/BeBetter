import React from 'react';
import { View, ScrollView, StyleSheet, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '@/store/useSettingsStore';

interface PageContainerProps extends ViewProps {
  /** 是否为可滚动容器。页面内容自带 FlatList/ScrollView 时应关闭，避免嵌套滚动警告 */
  scroll?: boolean;
  /**
   * 底部额外预留（不含底部安全区）。Tab 页传 theme.safeBottom 避开悬浮胶囊；不传默认 24。
   * 仅 `scroll` 为 true 时生效——此时内边距加在滚动内容上，内容能滚到悬浮胶囊下方。
   * `scroll` 为 false 时容器不预留，必须由页面自身滚动容器的 contentContainerStyle 预留，
   * 否则列表可视区被压低，胶囊下方会空出一条平台色带，看起来像「嵌在背景板上」。
   */
  bottomSpace?: number;
}

/**
 * 页面容器
 * - 默认可上下滚动，避免内容在屏幕受限时被切断
 * - 首页等自带虚拟列表的页面传 scroll={false}
 * - scroll=true 时底部内边距 = 安全区 + bottomSpace
 */
export function PageContainer({
  style,
  children,
  scroll = true,
  bottomSpace = 24,
  ...props
}: PageContainerProps) {
  const theme = useSettingsStore((s) => s.theme);
  const insets = useSafeAreaInsets();

  const innerStyle = [
    styles.inner,
    {
      backgroundColor: theme.colors.bg,
      paddingTop: theme.topPadding,
      // scroll=false 时容器不预留底部空间：否则列表可视区被压低，
      // 内容永远进不到悬浮胶囊下方，胶囊下方会露出平台色带
      paddingBottom: scroll ? insets.bottom + bottomSpace : 0,
    },
    style,
  ];

  if (scroll) {
    return (
      <ScrollView
        style={styles.page}
        contentContainerStyle={innerStyle}
        showsVerticalScrollIndicator={false}
        {...(props as any)}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.page, innerStyle]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  inner: {
    // 用 minHeight 而非 flexGrow:1 撑满背景：flexGrow 会强制内容填满视口，
    // 在部分 Android 机型上抑制 ScrollView 的滚动判定。
    minHeight: '100%',
    paddingHorizontal: 16,
  },
});