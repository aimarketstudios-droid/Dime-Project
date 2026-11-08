import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface Props {
  visible: boolean;
  jobId: string | null;
  otpRequiredFor?: string;
  onSubmit: (otp: string) => Promise<void>;
  onClose: () => void;
}

export const TwoFactorModal: React.FC<Props> = ({
  visible,
  jobId,
  otpRequiredFor,
  onSubmit,
  onClose,
}) => {
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!code || code.length < 4) return;
    setSubmitting(true);
    try {
      await onSubmit(code);
      setCode('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <Text style={styles.icon}>🔐</Text>
          <Text style={styles.title}>2FA Code Required</Text>
          <Text style={styles.subtitle}>
            Dime's automated bot is currently inside your {otpRequiredFor || 'merchant account'}.
            Enter the one-time SMS verification code to finish the cancellation:
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. 123456"
            placeholderTextColor="#71717A"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
            maxLength={8}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.submitButton, (!code || submitting) && styles.submitDisabled]}
            disabled={!code || submitting}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.submitText}>Submit & Kill Subscription</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    backgroundColor: '#18181B',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#3F3F46',
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#09090B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    color: '#00FFA3',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    paddingVertical: 14,
    letterSpacing: 4,
    marginBottom: 20,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#00FFA3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    color: '#71717A',
    fontSize: 13,
  },
});

