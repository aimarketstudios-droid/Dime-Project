export interface RawBankTx {
  id: string;
  amount: number;
  date: string;
  rawDescriptor: string;
}

export interface DetectedResult {
  merchantName: string;
  category: 'Streaming' | 'Fitness' | 'Software' | 'Utilities' | 'Lifestyle';
  billingAmount: number;
  cadence: 'monthly' | 'annual' | 'weekly';
  confidenceScore: number;
  lastBilled: string;
  nextProjectedDate: string;
}

export class SubscriptionDetector {
  private static KNOWN_MERCHANT_CATALOG: Record<
    string,
    { name: string; category: 'Streaming' | 'Fitness' | 'Software' | 'Utilities' | 'Lifestyle' }
  > = {
    netflix: { name: 'Netflix', category: 'Streaming' },
    spotify: { name: 'Spotify Premium', category: 'Streaming' },
    hulu: { name: 'Hulu', category: 'Streaming' },
    disney: { name: 'Disney+', category: 'Streaming' },
    hbo: { name: 'Max (HBO)', category: 'Streaming' },
    adobe: { name: 'Adobe Creative Cloud', category: 'Software' },
    openai: { name: 'OpenAI ChatGPT Plus', category: 'Software' },
    chegg: { name: 'Chegg Study', category: 'Software' },
    planetfit: { name: 'Planet Fitness', category: 'Fitness' },
    equinox: { name: 'Equinox Gym', category: 'Fitness' },
    anytimefit: { name: 'Anytime Fitness', category: 'Fitness' },
    xfinity: { name: 'Xfinity Comcast', category: 'Utilities' },
    verizon: { name: 'Verizon Wireless', category: 'Utilities' },
    att: { name: 'AT&T Mobility', category: 'Utilities' },
    geico: { name: 'GEICO Auto Insurance', category: 'Utilities' },
    statefarm: { name: 'State Farm', category: 'Utilities' },
  };

  public static analyzeTransactions(transactions: RawBankTx[]): DetectedResult[] {
    const grouped = new Map<string, RawBankTx[]>();

    // 1. Group by cleaned canonical descriptor
    for (const tx of transactions) {
      const canonicalKey = this.normalizeDescriptor(tx.rawDescriptor);
      if (!grouped.has(canonicalKey)) {
        grouped.set(canonicalKey, []);
      }
      grouped.get(canonicalKey)!.push(tx);
    }

    const detected: DetectedResult[] = [];

    // 2. Run statistical interval & variance analysis
    for (const [key, txList] of grouped.entries()) {
      if (txList.length < 2) continue;

      // Sort ascending by date
      txList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Measure gaps in days
      const intervals: number[] = [];
      for (let i = 1; i < txList.length; i++) {
        const diffMs = new Date(txList[i].date).getTime() - new Date(txList[i - 1].date).getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        intervals.push(diffDays);
      }

      const meanInterval = intervals.reduce((acc, v) => acc + v, 0) / intervals.length;
      const variance =
        intervals.reduce((acc, v) => acc + Math.pow(v - meanInterval, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);

      // Amount consistency
      const amounts = txList.map((t) => Math.abs(t.amount));
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const amountVariance =
        amounts.reduce((acc, v) => acc + Math.pow(v - avgAmount, 2), 0) / amounts.length;
      const amountStdDev = Math.sqrt(amountVariance);

      let cadence: 'monthly' | 'annual' | 'weekly' = 'monthly';
      let confidence = 0.0;

      // Cadence detection
      if (meanInterval >= 27 && meanInterval <= 33 && stdDev <= 3.5) {
        cadence = 'monthly';
        confidence += 0.55;
      } else if (meanInterval >= 355 && meanInterval <= 375 && stdDev <= 6.0) {
        cadence = 'annual';
        confidence += 0.55;
      } else if (meanInterval >= 6 && meanInterval <= 8 && stdDev <= 1.2) {
        cadence = 'weekly';
        confidence += 0.55;
      }

      // Consistent price points reinforce subscription likelihood
      if (amountStdDev <= 1.5) {
        confidence += 0.25;
      }

      // Check Catalog Match
      const matchedCatalog = this.matchCatalog(key);
      if (matchedCatalog) {
        confidence += 0.2;
      }

      if (confidence >= 0.7) {
        const lastTx = txList[txList.length - 1];
        const nextProjected = new Date(lastTx.date);
        nextProjected.setDate(nextProjected.getDate() + Math.round(meanInterval));

        detected.push({
          merchantName: matchedCatalog ? matchedCatalog.name : this.capitalize(key),
          category: matchedCatalog ? matchedCatalog.category : 'Lifestyle',
          billingAmount: Number(avgAmount.toFixed(2)),
          cadence,
          confidenceScore: Math.min(1.0, Number(confidence.toFixed(2))),
          lastBilled: lastTx.date,
          nextProjectedDate: nextProjected.toISOString().split('T')[0],
        });
      }
    }

    return detected;
  }

  private static normalizeDescriptor(raw: string): string {
    return raw
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static matchCatalog(key: string) {
    for (const [k, meta] of Object.entries(this.KNOWN_MERCHANT_CATALOG)) {
      if (key.includes(k)) return meta;
    }
    return null;
  }

  private static capitalize(str: string): string {
    return str
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}

