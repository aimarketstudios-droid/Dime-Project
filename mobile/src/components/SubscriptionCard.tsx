import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Subscription } from '../services/api';

interface Props {
  subscription: Subscription;
  onKillPress: (sub: Subscription) => void;
}

export const SubscriptionCard: React.FC<Props> = ({ subscription, onKillPress }) => {
  const isDead = subscription.daysInactive >= 30;
  const isCancelled = subscription.status === 'cancelled';
  const isCancelling = subscription.status === 'cancelling';

  return (
    <View style={[styles.card, isDead && !isCancelled && styles.cardDead]}>
      <View style={styles.headerRow}>
        <View style={styles.merchantInfo}>
          <Text style={styles.merchantName}>{subscription.merchantName}</Text>
          <Text style={styles.category}>{subscription.category} • Billed {subscription.billingCycle}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.amount}>${subscription.billingAmount.toFixed(2)}</Text>
          <Text style={styles.monthLabel}>/mo</Text>
        </View>
      </View>

      <View style={styles.statusRow}>
        {isCancelled ? (
          <View style={[styles.badge, styles.badgeCancelled]}>
            <Text style={styles.badgeTextCancelled}>KILLED (Saved ${(subscription.billingAmount * 12).toFixed(2)}/yr)</Text>
          </View>
        ) : isCancelling ? (
          <View style={[styles.badge, styles.badgeCancelling]}>
            <Text style={styles.badgeTextCancelling}>KILLING IN PROGRESS...</Text>
          </View>
        ) : isDead ? (
          <View style={[styles.badge, styles.badgeDead]}>
            <Text style={styles.badgeTextDead}>⚠️ DEAD WEIGHT: {subscription.daysInactive} days inactive</Text>
          </View>
        ) : (
          <View style={[styles.badge, styles.badgeActive]}>
            <Text style={styles.badgeTextActive}>Active • Used {subscription.daysInactive}d ago</Text>
          </View>
        )}

        {!isCancelled && !isCancelling && (
          <TouchableOpacity
            style={[styles.killButton, isDead ? styles.killButtonUrgent : styles.killButtonNormal]}
            onPress={() => onKillPress(subscription)}
          >
            <Text style={styles.killButtonText}>{isDead ? '⚡ KILL' : 'CANCEL'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  cardDead: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  category: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  amount: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  monthLabel: {
    color: '#71717A',
    fontSize: 12,
    marginLeft: 2,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeDead: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  badgeTextDead: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeActive: {
    backgroundColor: '#27272A',
  },
  badgeTextActive: {
    color: '#A1A1AA',
    fontSize: 11,
  },
  badgeCancelled: {
    backgroundColor: 'rgba(0, 255, 163, 0.15)',
  },
  badgeTextCancelled: {
    color: '#00FFA3',
    fontSize: 11,
    fontWeight: '800',
  },
  badgeCancelling: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },
  badgeTextCancelling: {
    color: '#FACC15',
    fontSize: 11,
    fontWeight: '800',
  },
  killButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  killButtonUrgent: {
    backgroundColor: '#EF4444',
  },
  killButtonNormal: {
    backgroundColor: '#3F3F46',
  },
  killButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

