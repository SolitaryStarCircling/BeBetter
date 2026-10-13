import React from 'react';
import { Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { PageContainer } from '@/components/common/PageContainer';
import { ScreenHeader } from '@/components/common/ScreenHeader';
import { GlassCard } from '@/components/glass/GlassCard';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function AboutPage() {
  const theme = useSettingsStore((s) => s.theme);
  // 未跑 expo prebuild，android 端无内嵌 app.config 资源，expoConfig 为空时回退
  // 回退值需与 app.json / android/app/build.gradle 的版本号保持一致
  const version = Constants.expoConfig?.version ?? '0.5.0';

  return (
    <PageContainer>
      <ScreenHeader />
      <GlassCard style={styles.card}>
        <Text style={[styles.name, { color: theme.colors.text }]}>
          BeBetter
        </Text>
        <Text style={[styles.version, { color: theme.colors.text3 }]}>
          v{version}
        </Text>
        <Text style={[styles.desc, { color: theme.colors.text2 }]}>
          本地知识练习 App，支持多科目刷题、错题复习、进度统计。
        </Text>
      </GlassCard>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 24,
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  version: {
    fontSize: 13,
    marginTop: 4,
    marginBottom: 16,
  },
  desc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
});
