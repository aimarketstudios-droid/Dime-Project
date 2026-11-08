import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Subscription, BleedMetrics } from '../services/api';
import { SubscriptionCard } from '../components/SubscriptionCard';

interface Props {
  metrics: BleedMetrics;
  subscriptions: Subscription[];
  onKillPress: (sub: Subscription) => void;
  onConnectBank: () => void;
  onAddPress: () => void;
  onOpenFeedback: () => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export const DashboardScreen: React.FC<Props> = ({
  metrics,
  subscriptions,
  onKillPress,
  onConnectBank,
  onAddPress,
  onOpenFeedback,
  onRefresh,
  refreshing,
}) => {
  const deadSubs = subscriptions.filter((s) => s.status === 'active' && s.daysInactive >= 30);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00FFA3" />}
    >
      {/* 100% Free Beta Community Banner */}
      <TouchableOpacity style={styles.freeBetaBanner} onPress={onOpenFeedback}>
        <View style={styles.betaPill}>
          <Text style={styles.betaPillText}>COMMUNITY BETA</Text>
        </View>
        <Text style={styles.betaBannerTitle}>🎉 100% Free for Early Adopters</Text>
        <Text style={styles.betaBannerText}>
          Automated subscription cancellations are free with zero fees. Tap here to leave a suggestion!
        </Text>
      </TouchableOpacity>

      {/* Monthly Bleed Card */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>TOTAL MONTHLY BLEED</Text>
        <View style={styles.bleedRow}>
          <Text style={styles.bleedAmount}>${metrics.totalMonthlyBleed.toFixed(2)}</Text>
          <Text style={styles.bleedCycle}>/month</Text>
        </View>
        <Text style={styles.annualProjected}>
          Projected at <Text style={styles.annualHighlight}>${metrics.projectedAnnualBleed.toFixed(2)}</Text> lost this year.
        </Text>

        <View style={styles.divider} />

        <View style={styles.savingsRow}>
          <View>
            <Text style={styles.savingsLabel}>DEAD WEIGHT DETECTED</Text>
            <Text style={styles.deadCount}>{metrics.deadSubscriptionsCount} Subscriptions</Text>
          </View>
          <View style={styles.savingsTag}>
            <Text style={styles.savingsTagText}>
              SAVE +${metrics.potentialAnnualSavings.toFixed(0)}/yr
            </Text>
          </View>
        </View>
      </View>

      {/* Dead Weight Alert Banner */}
      {deadSubs.length > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertIcon}>🚨</Text>
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertTitle}>Ready to Kill: {deadSubs.length} Unused Subscriptions</Text>
            <Text style={styles.alertBody}>
              You haven't opened these apps in over 30 days. Tap "KILL" to eliminate the charge for free.
            </Text>
          </View>
        </View>
      )}

      {/* Quick Action Subscriptions List */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Subscriptions</Text>
        <View style={styles.headerButtonsRow}>
          <TouchableOpacity onPress={onAddPress} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConnectBank} style={styles.linkBtn}>
            <Text style={styles.connectBankText}>+ Link Bank</Text>
          </TouchableOpacity>
        </View>
      </View>

      {subscriptions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💳</Text>
          <Text style={styles.emptyTitle}>No Subscriptions Tracked Yet</Text>
          <Text style={styles.emptySubtitle}>
            Tap "+ Add" to add your subscriptions manually, or "+ Link Bank" to scan your accounts.
          </Text>
          <TouchableOpacity style={styles.emptyActionButton} onPress={onAddPress}>
            <Text style={styles.emptyActionButtonText}>+ Add Your First Subscription</Text>
          </TouchableOpacity>
        </View>
      ) : (
        subscriptions.map((sub) => (
          <SubscriptionCard key={sub.id} subscription={sub} onKillPress={onKillPress} />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  freeBetaBanner: {
    backgroundColor: 'rgba(0, 255, 163, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.3)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  betaPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#00FFA3',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  betaPillText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '900',
  },
  betaBannerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 2,
  },
  betaBannerText: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 16,
  },
  heroCard: {
    backgroundColor: '#18181B',
    borderRadius: 24,
    padding: 22,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  heroLabel: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  bleedRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  bleedAmount: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: '900',
  },
  bleedCycle: {
    color: '#71717A',
    fontSize: 16,
    marginLeft: 4,
    fontWeight: '600',
  },
  annualProjected: {
    color: '#A1A1AA',
    fontSize: 13,
  },
  annualHighlight: {
    color: '#EF4444',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#27272A',
    marginVertical: 16,
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  deadCount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  savingsTag: {
    backgroundColor: 'rgba(0, 255, 163, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.3)',
  },
  savingsTagText: {
    color: '#00FFA3',
    fontWeight: '900',
    fontSize: 12,
  },
  alertBanner: {
    flexDirection: 'row',
    backgroundColor: '#2A1215',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    color: '#F87171',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 4,
  },
  alertBody: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  connectBankText: {
    color: '#A1A1AA',
    fontWeight: '700',
    fontSize: 12,
  },
  headerButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addBtn: {
    backgroundColor: '#00FFA3',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
  },
  linkBtn: {
    backgroundColor: '#18181B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  emptyContainer: {
    backgroundColor: '#18181B',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
    marginVertical: 10,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#71717A',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 18,
  },
  emptyActionButton: {
    backgroundColor: '#00FFA3',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyActionButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
  },
});
