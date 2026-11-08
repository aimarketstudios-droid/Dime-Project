import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { DimeApi, Subscription, BleedMetrics, MarketplaceOffer, KillJob } from './src/services/api';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { SubscriptionsScreen } from './src/screens/SubscriptionsScreen';
import { MarketplaceScreen } from './src/screens/MarketplaceScreen';
import { KillConfirmModal } from './src/components/KillConfirmModal';
import { TwoFactorModal } from './src/components/TwoFactorModal';
import { BankLinkModal } from './src/components/BankLinkModal';
import { FeedbackModal } from './src/components/FeedbackModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscriptions' | 'marketplace'>('dashboard');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [metrics, setMetrics] = useState<BleedMetrics>({
    totalMonthlyBleed: 0,
    projectedAnnualBleed: 0,
    deadSubscriptionsCount: 0,
    potentialAnnualSavings: 0,
  });
  const [offers, setOffers] = useState<MarketplaceOffer[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [selectedSubForKill, setSelectedSubForKill] = useState<Subscription | null>(null);
  const [killConfirmVisible, setKillConfirmVisible] = useState(false);
  const [twoFactorVisible, setTwoFactorVisible] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [otpPromptFor, setOtpPromptFor] = useState<string>('');
  const [bankLinkVisible, setBankLinkVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [subData, marketData] = await Promise.all([
        DimeApi.getSubscriptions(),
        DimeApi.getMarketplaceOffers(),
      ]);
      setSubscriptions(subData.subscriptions);
      setMetrics(subData.metrics);
      setOffers(marketData.offers);
    } catch (err: any) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleKillPress = (sub: Subscription) => {
    setSelectedSubForKill(sub);
    setKillConfirmVisible(true);
  };

  // 100% Free Kill Action
  const handleConfirmKill = async () => {
    if (!selectedSubForKill) return;
    setKillConfirmVisible(false);

    try {
      const result = await DimeApi.triggerKill(selectedSubForKill.id);
      const job: KillJob = result.job;

      // Update state locally
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === selectedSubForKill.id ? { ...s, status: 'cancelling' } : s))
      );

      if (job.status === 'requires_2fa') {
        setActiveJobId(job.id);
        setOtpPromptFor(job.otpRequiredFor || selectedSubForKill.merchantName);
        setTwoFactorVisible(true);
      } else {
        Alert.alert(
          '⚡ Kill Switch Triggered (100% Free)',
          `Dime dispatched the cancellation for ${selectedSubForKill.merchantName}. You save $${(selectedSubForKill.billingAmount * 12).toFixed(2)}/yr with zero fees!`
        );
        loadData();
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to trigger free kill switch');
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    if (!activeJobId) return;
    try {
      await DimeApi.submitOtp(activeJobId, otp);
      setTwoFactorVisible(false);
      Alert.alert(
        '✓ Successfully Killed',
        '2FA verified and subscription has been permanently cancelled.'
      );
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to verify OTP');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Top App Bar */}
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Text style={styles.logoIcon}>💎</Text>
          <Text style={styles.logoText}>DIME</Text>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>FREE BETA</Text>
          </View>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity style={styles.feedbackButton} onPress={() => setFeedbackVisible(true)}>
            <Text style={styles.feedbackText}>💡 Feedback</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {activeTab === 'dashboard' && (
          <DashboardScreen
            metrics={metrics}
            subscriptions={subscriptions}
            onKillPress={handleKillPress}
            onConnectBank={() => setBankLinkVisible(true)}
            onOpenFeedback={() => setFeedbackVisible(true)}
            onRefresh={loadData}
            refreshing={refreshing}
          />
        )}
        {activeTab === 'subscriptions' && (
          <SubscriptionsScreen
            subscriptions={subscriptions}
            onKillPress={handleKillPress}
          />
        )}
        {activeTab === 'marketplace' && (
          <MarketplaceScreen offers={offers} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[styles.navIcon, activeTab === 'dashboard' && styles.navIconActive]}>📊</Text>
          <Text style={[styles.navLabel, activeTab === 'dashboard' && styles.navLabelActive]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('subscriptions')}
        >
          <Text style={[styles.navIcon, activeTab === 'subscriptions' && styles.navIconActive]}>✂️</Text>
          <Text style={[styles.navLabel, activeTab === 'subscriptions' && styles.navLabelActive]}>Kill List</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab('marketplace')}
        >
          <Text style={[styles.navIcon, activeTab === 'marketplace' && styles.navIconActive]}>⚡</Text>
          <Text style={[styles.navLabel, activeTab === 'marketplace' && styles.navLabelActive]}>Switch & Save</Text>
        </TouchableOpacity>
      </View>

      {/* 100% Free Kill Confirmation Modal */}
      <KillConfirmModal
        visible={killConfirmVisible}
        subscription={selectedSubForKill}
        onConfirmKill={handleConfirmKill}
        onClose={() => setKillConfirmVisible(false)}
      />

      {/* 2FA SMS Relay Modal */}
      <TwoFactorModal
        visible={twoFactorVisible}
        jobId={activeJobId}
        otpRequiredFor={otpPromptFor}
        onSubmit={handleOtpSubmit}
        onClose={() => setTwoFactorVisible(false)}
      />

      {/* Plaid Bank Link Modal */}
      <BankLinkModal
        visible={bankLinkVisible}
        onSuccess={() => {
          setBankLinkVisible(false);
          loadData();
          Alert.alert('Bank Connected', 'Synced transactions and updated subscription bleed.');
        }}
        onClose={() => setBankLinkVisible(false)}
      />

      {/* Feedback & Suggestion Modal */}
      <FeedbackModal
        visible={feedbackVisible}
        onClose={() => setFeedbackVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#18181B',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 22,
    marginRight: 6,
  },
  logoText: {
    color: '#00FFA3',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  freeBadge: {
    backgroundColor: 'rgba(0, 255, 163, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.3)',
  },
  freeBadgeText: {
    color: '#00FFA3',
    fontSize: 9,
    fontWeight: '900',
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedbackButton: {
    backgroundColor: '#18181B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  feedbackText: {
    color: '#00FFA3',
    fontSize: 12,
    fontWeight: '700',
  },
  screenContainer: {
    flex: 1,
  },
  navBar: {
    height: 64,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#121214',
    borderTopWidth: 1,
    borderTopColor: '#27272A',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#00FFA3',
  },
});
