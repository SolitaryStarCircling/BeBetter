import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useSettingsStore } from '@/store/useSettingsStore';

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  intensity?: number;
}

/**
 * 毛玻璃弹窗
 * - 居中遮罩 + 模糊背景
 * - Android 降级半透明（不使用 BlurView）
 */
export function GlassModal({ visible, onClose, children, intensity = 40 }: GlassModalProps) {
  const theme = useSettingsStore((s) => s.theme);

  const contentStyle = [
    styles.content,
    Platform.OS === 'android' && {
      backgroundColor: theme.colors.glassStrong,
      borderColor: theme.colors.glassBorder,
    },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        {Platform.OS === 'android' ? (
          <View style={contentStyle}>{children}</View>
        ) : (
          <BlurView
            intensity={intensity}
            tint={theme.mode === 'dark' ? 'dark' : 'light'}
            style={contentStyle}
          >
            {children}
          </BlurView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  content: {
    width: '86%',
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    overflow: 'hidden',
    padding: 20,
  },
});
