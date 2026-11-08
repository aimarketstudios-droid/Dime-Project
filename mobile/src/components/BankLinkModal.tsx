import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';

interface Props {
  visible: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const BankLinkModal: React.FC<Props> = ({ visible, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);

  const handleConnect = async (bankName: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>🔒 Connect Your Bank</Text>
          <Text style={styles.subtitle}>
            Dime uses end-to-end 256-bit bank encryption. We never view or store your banking login credentials.
          </Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00FFA3" />
              <Text style={styles.loadingText}>Syncing transactions & analyzing cadence...</Text>
            </View>
          ) : (
            <View style={styles.bankList}>
              {['Chase', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One'].map((bank) => (
                <TouchableOpacity
                  key={bank}
                  style={styles.bankItem}
                  onPress={() => handleConnect(bank)}
                >
                  <Text style={styles.bankName}>{bank}</Text>
                  <Text style={styles.bankArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
            <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: '#18181B',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    lineHeight: 18,
    marginBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    color: '#00FFA3',
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  bankList: {
    marginBottom: 16,
  },
  bankItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#27272A',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  bankName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  bankArrow: {
    color: '#71717A',
    fontSize: 18,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelText: {
    color: '#71717A',
    fontSize: 14,
  },
});

