import React, { useState } from 'react';
import { Text, StyleSheet, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { PageContainer } from '@/components/common/PageContainer';
import { GlassCard } from '@/components/glass/GlassCard';
import { GlassModal } from '@/components/glass/GlassModal';
import { GlassButton } from '@/components/glass/GlassButton';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useProgressStore } from '@/store/useProgressStore';
import { useWrongStore } from '@/store/useWrongStore';

export default function SettingsPage() {
  const theme = useSettingsStore((s) => s.theme);
  const settings = useSettingsStore((s) => s.settings);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const router = useRouter();

  const clearProgress = useProgressStore((s) => s.clearAll);
  const clearWrong = useWrongStore((s) => s.clearAll);
  const [confirmTarget, setConfirmTarget] = useState<'progress' | 'wrong' | null>(null);

  const handleConfirm = () => {
    if (confirmTarget === 'progress') clearProgress();
    if (confirmTarget === 'wrong') clearWrong();
    setConfirmTarget(null);
  };

  return (
    <PageContainer bottomSpace={theme.safeBottom}>
      <Text style={[styles.title, { color: theme.colors.text }]}>设置</Text>

      <GlassCard style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text2 }]}>
          外观
        </Text>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            主题样式
          </Text>
          <View
            style={[
              styles.themeSwitch,
              { borderColor: theme.colors.outline },
            ]}
          >
            {(['light', 'dark'] as const).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setTheme(mode)}
                style={[
                  styles.themeBtn,
                  settings.theme === mode && {
                    backgroundColor: theme.colors.blue,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.themeLabel,
                    {
                      color:
                        settings.theme === mode
                          ? '#fff'
                          : theme.colors.text3,
                    },
                  ]}
                >
                  {mode === 'light' ? '浅色' : '深色'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </GlassCard>

      <GlassCard style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text2 }]}>
          关于
        </Text>
        <Pressable onPress={() => router.push('/about')}>
          <Text style={[styles.link, { color: theme.colors.blue }]}>
            关于 BeBetter
          </Text>
        </Pressable>
      </GlassCard>

      <GlassCard style={[styles.section, { borderColor: theme.colors.red + '40' }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.red }]}>
          数据管理
        </Text>
        <Pressable onPress={() => setConfirmTarget('progress')}>
          <Text style={[styles.link, { color: theme.colors.red }]}>
            清除全部练习进度
          </Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable onPress={() => setConfirmTarget('wrong')}>
          <Text style={[styles.link, { color: theme.colors.red }]}>
            清除全部错题
          </Text>
        </Pressable>
      </GlassCard>

      <GlassModal
        visible={confirmTarget !== null}
        onClose={() => setConfirmTarget(null)}
      >
        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
          {confirmTarget === 'progress' ? '清除全部练习进度？' : '清除全部错题？'}
        </Text>
        <Text style={[styles.modalBody, { color: theme.colors.text2 }]}>
          {confirmTarget === 'progress'
            ? '已做题数、正确率等学习记录将被清空，无法恢复。'
            : '错题本中的题目将被移除，无法恢复。'}
        </Text>
        <View style={styles.modalActions}>
          <GlassButton
            label="取消"
            variant="secondary"
            onPress={() => setConfirmTarget(null)}
            style={{ flex: 1 }}
          />
          <GlassButton
            label="确定清除"
            variant="danger"
            onPress={handleConfirm}
            style={{ flex: 1 }}
          />
        </View>
      </GlassModal>
    </PageContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
  },
  themeSwitch: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  themeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  themeLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  link: {
    fontSize: 15,
    fontWeight: '500',
    paddingVertical: 4,
  },
  divider: {
    height: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
