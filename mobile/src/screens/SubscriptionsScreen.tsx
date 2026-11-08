import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Subscription } from '../services/api';
import { SubscriptionCard } from '../components/SubscriptionCard';

interface Props {
  subscriptions: Subscription[];
  onKillPress: (sub: Subscription) => void;
}

export const SubscriptionsScreen: React.FC<Props> = ({ subscriptions, onKillPress }) => {
  const [filter, setFilter] = useState<'all' | 'dead' | 'active' | 'cancelled'>('all');

  const filtered = subscriptions.filter((s) => {
    if (filter === 'dead') return s.daysInactive >= 30 && s.status !== 'cancelled';
    if (filter === 'active') return s.status === 'active';
    if (filter === 'cancelled') return s.status === 'cancelled';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        {(['all', 'dead', 'active', 'cancelled'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, filter === tab && styles.tabActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
              {tab === 'dead' ? '⚠️ Dead Weight' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filtered.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No subscriptions in this view.</Text>
          </View>
        ) : (
          filtered.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} onKillPress={onKillPress} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#18181B',
  },
  tabActive: {
    backgroundColor: '#00FFA3',
  },
  tabText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#71717A',
    fontSize: 14,
  },
});

