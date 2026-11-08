import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MarketplaceOffer } from '../services/api';

interface Props {
  offers: MarketplaceOffer[];
}

export const MarketplaceScreen: React.FC<Props> = ({ offers }) => {
  const totalSavings = offers.reduce((acc, o) => acc + o.annualSavings, 0);

  const handleSwitch = (offer: MarketplaceOffer) => {
    // In production, opens affiliate link or in-app concierge form
    Linking.openURL(offer.actionUrl).catch(() => {
      alert(`Redirecting to ${offer.suggestedProvider} affiliate portal...`);
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Savings Header */}
      <View style={styles.heroBox}>
        <Text style={styles.heroSub}>BILL OPTIMIZATION MARKETPLACE</Text>
        <Text style={styles.heroTitle}>Keep the Service. Slash the Price.</Text>
        <Text style={styles.heroDescription}>
          Dime scanned your utility and fixed bills against verified national rates. You can save up to:
        </Text>
        <View style={styles.totalSavingsTag}>
          <Text style={styles.totalSavingsText}>+${totalSavings.toFixed(0)} / Year in Savings</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Available Bill Replacements</Text>

      {offers.map((offer) => (
        <View key={offer.id} style={styles.offerCard}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{offer.category.toUpperCase()}</Text>
          </View>

          <View style={styles.comparisonGrid}>
            <View style={styles.comparisonCol}>
              <Text style={styles.colLabel}>Current Provider</Text>
              <Text style={styles.providerName}>{offer.currentProvider}</Text>
              <Text style={styles.currentCost}>${offer.currentEstimatedMonthly.toFixed(0)}/mo</Text>
            </View>

            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={styles.comparisonCol}>
              <Text style={styles.colLabel}>Dime Verified Match</Text>
              <Text style={styles.matchProviderName}>{offer.suggestedProvider}</Text>
              <Text style={styles.matchCost}>${offer.suggestedMonthly.toFixed(0)}/mo</Text>
            </View>
          </View>

          <View style={styles.highlightBar}>
            <Text style={styles.highlightText}>✓ {offer.highlight}</Text>
          </View>

          <View style={styles.actionRow}>
            <View>
              <Text style={styles.savingsSub}>ANNUAL SAVINGS</Text>
              <Text style={styles.savingsVal}>+${offer.annualSavings.toFixed(0)}/yr</Text>
            </View>
            <TouchableOpacity style={styles.switchButton} onPress={() => handleSwitch(offer)}>
              <Text style={styles.switchButtonText}>SWITCH & SAVE</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  content: {
    padding: 16,
    paddingTop: 10,
  },
  heroBox: {
    backgroundColor: '#18181B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  heroSub: {
    color: '#00FFA3',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroDescription: {
    color: '#A1A1AA',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  totalSavingsTag: {
    backgroundColor: 'rgba(0, 255, 163, 0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 163, 0.3)',
  },
  totalSavingsText: {
    color: '#00FFA3',
    fontSize: 16,
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  offerCard: {
    backgroundColor: '#18181B',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#27272A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 14,
  },
  categoryBadgeText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  comparisonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  comparisonCol: {
    flex: 1,
  },
  colLabel: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  providerName: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  currentCost: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '800',
  },
  vsContainer: {
    paddingHorizontal: 10,
  },
  vsText: {
    color: '#52525B',
    fontSize: 12,
    fontWeight: '900',
  },
  matchProviderName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  matchCost: {
    color: '#00FFA3',
    fontSize: 16,
    fontWeight: '800',
  },
  highlightBar: {
    backgroundColor: '#27272A',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  highlightText: {
    color: '#D4D4D8',
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#27272A',
  },
  savingsSub: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '800',
  },
  savingsVal: {
    color: '#00FFA3',
    fontSize: 16,
    fontWeight: '900',
  },
  switchButton: {
    backgroundColor: '#00FFA3',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  switchButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

