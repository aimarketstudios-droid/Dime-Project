import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { DimeApi } from '../services/api';

interface Props {
  visible: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export const AddSubscriptionModal: React.FC<Props> = ({ visible, onSuccess, onClose }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<'Streaming' | 'Fitness' | 'Software' | 'Utilities' | 'Lifestyle'>('Streaming');
  const [daysInactive, setDaysInactive] = useState('45');
  const [saving, setSaving] = useState(false);

  const categories: Array<'Streaming' | 'Fitness' | 'Software' | 'Utilities' | 'Lifestyle'> = [
    'Streaming',
    'Fitness',
    'Software',
    'Utilities',
    'Lifestyle',
  ];

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a subscription or merchant name.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Required', 'Please enter a valid monthly amount.');
      return;
    }

    setSaving(true);
    try {
      await DimeApi.addSubscription({
        merchantName: name.trim(),
        category,
        billingAmount: parsedAmount,
        billingCycle: 'monthly',
        daysInactive: parseInt(daysInactive, 10) || 0,
      });

      setName('');
      setAmount('');
      setDaysInactive('45');
      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to add subscription');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.dragBar} />

          <Text style={styles.title}>+ Add Subscription</Text>
          <Text style={styles.subtitle}>
            Enter any recurring bill to calculate your monthly bleed and enable 1-tap automated killing.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Merchant Name */}
            <Text style={styles.label}>Merchant / Service Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Netflix, Gym, Adobe, ChatGPT"
              placeholderTextColor="#71717A"
              value={name}
              onChangeText={setName}
            />

            {/* Monthly Amount */}
            <Text style={styles.label}>Monthly Amount ($ or ₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 19.99"
              placeholderTextColor="#71717A"
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />

            {/* Category */}
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryPill, category === cat && styles.categoryPillActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Days Inactive */}
            <Text style={styles.label}>Days Since Last Used (30+ marks as Dead Weight)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 45"
              placeholderTextColor="#71717A"
              keyboardType="number-pad"
              value={daysInactive}
              onChangeText={setDaysInactive}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.saveButtonText}>Add to Kill List</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={saving}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
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
    maxHeight: '88%',
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
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    marginBottom: 20,
    lineHeight: 18,
  },
  label: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    color: '#FFFFFF',
    padding: 12,
    fontSize: 15,
    marginBottom: 14,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  categoryPill: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryPillActive: {
    backgroundColor: '#00FFA3',
    borderColor: '#00FFA3',
  },
  categoryText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: '#000000',
    fontWeight: '900',
  },
  saveButton: {
    backgroundColor: '#00FFA3',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 10,
  },
  cancelText: {
    color: '#71717A',
    fontSize: 13,
  },
});
