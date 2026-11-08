import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Subscription } from '../services/api';

interface Props {
  visible: boolean;
  subscription: Subscription | null;
  onConfirmKill: () => void;
  onClose: () => void;
}

export const KillConfirmModal: React.FC<Props> = ({
  visible,
  subscription,
  onConfirmKill,
  onClose,
}) => {
  if (!subscription) return null;

  const annualSavings = (subscription.billingAmount * 12).toFixed(2);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.dragBar} />

          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>100% FREE COMMUNITY BETA</Text>
          </View>

          <Text style={styles.title}>Kill {subscription.merchantName}?</Text>
          <Text style={styles.subtitle}>
            You will save <Text style={styles.savingsHighlight}>${annualSavings} every year</Text> by cancelling this dead weight.
          </Text>

          <View style={styles.featureBox}>
            <Text style={styles.featureItem}>⚡ Dime handles the entire cancellation process</Text>
            <Text style={styles.featureItem}>🔒 No credit card or payment required ($0 cost)</Text>
            <Text style={styles.featureItem}>📄 Formal legal notice or portal automation dispatched</Text>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={onConfirmKill}>
            <Text style={styles.confirmText}>Confirm & Kill for Free ($0)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Keep Subscription</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#121214',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  dragBar: {
    width: 40,
    height: 4,
    backgroundColor: '#3F3F46',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  freeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 255, 163, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.3)',
  },
  freeBadgeText: {
    color: '#00FFA3',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#A1A1AA',
    marginBottom: 20,
    lineHeight: 20,
  },
  savingsHighlight: {
    color: '#00FFA3',
    fontWeight: '800',
  },
  featureBox: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  featureItem: {
    color: '#D4D4D8',
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: '#00FFA3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelText: {
    color: '#71717A',
    fontSize: 13,
    fontWeight: '600',
  },
});

