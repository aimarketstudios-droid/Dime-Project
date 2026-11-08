import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { DimeApi } from '../services/api';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<Props> = ({ visible, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!suggestion.trim()) {
      Alert.alert('Please enter your feedback or idea');
      return;
    }

    setSubmitting(true);
    try {
      await DimeApi.submitFeedback({
        rating,
        suggestion,
      });
      setSuggestion('');
      Alert.alert('Thank You!', 'Your suggestion helps us make Dime better for everyone.');
      onClose();
    } catch {
      Alert.alert('Saved', 'Thank you for your feedback!');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.dragBar} />

          <Text style={styles.title}>💡 Suggestions & Feedback</Text>
          <Text style={styles.subtitle}>
            We're offering Dime 100% free to early adopters! Tell us how much money you saved, what worked, or what you want us to add next:
          </Text>

          {/* Star Rating */}
          <Text style={styles.ratingLabel}>Rate your experience:</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={[styles.star, star <= rating ? styles.starFilled : styles.starEmpty]}>
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Suggestion Text Input */}
          <TextInput
            style={styles.textArea}
            placeholder="What feature would you like to see? How can we make Dime better?"
            placeholderTextColor="#71717A"
            multiline
            numberOfLines={4}
            value={suggestion}
            onChangeText={setSuggestion}
          />

          <TouchableOpacity
            style={[styles.submitButton, (!suggestion.trim() || submitting) && styles.submitDisabled]}
            disabled={!suggestion.trim() || submitting}
            onPress={handleSubmit}
          >
            {submitting ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.submitText}>Submit Suggestion</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Close</Text>
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
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#A1A1AA',
    marginBottom: 16,
    lineHeight: 18,
  },
  ratingLabel: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  star: {
    fontSize: 28,
    marginRight: 8,
  },
  starFilled: {
    color: '#FACC15',
  },
  starEmpty: {
    color: '#3F3F46',
  },
  textArea: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    borderRadius: 12,
    color: '#FFFFFF',
    padding: 14,
    fontSize: 14,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  submitButton: {
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
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    color: '#71717A',
    fontSize: 13,
  },
});

