import { db, MarketplaceOffer } from '../db/store';

export class MarketplaceService {
  public static getOffersForUser(userId: string): MarketplaceOffer[] {
    return Array.from(db.marketplaceOffers.values());
  }

  public static trackSwitchLead(offerId: string, userId: string): {
    redirectUrl: string;
    bountyEstimated: number;
    annualSavings: number;
  } {
    const offer = db.marketplaceOffers.get(offerId);
    if (!offer) {
      throw new Error('Offer not found');
    }

    // In production, record lead event for affiliate postback reconciliation
    return {
      redirectUrl: `${offer.actionUrl}&session=${userId}_${Date.now()}`,
      bountyEstimated: offer.affiliateBounty,
      annualSavings: offer.annualSavings,
    };
  }
}

