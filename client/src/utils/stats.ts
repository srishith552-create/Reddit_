import {
  AnalyzedPost,
  SubredditStats,
  SentimentLabel,
  ScoreBucket,
} from '../types/reddit';

/**
 * Calculates aggregate sentiment metrics, percentage distributions,
 * average score, dominant sentiment, and score histogram buckets.
 */
export function calculateStats(posts: AnalyzedPost[]): SubredditStats {
  const total = posts.length;

  if (total === 0) {
    return {
      total: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      positivePct: 0,
      neutralPct: 0,
      negativePct: 0,
      avgScore: 0,
      dominantSentiment: 'neutral',
      scoreBuckets: [],
    };
  }

  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let totalScore = 0;

  // Bucket counters for histogram
  let veryNeg = 0;   // score <= -3
  let slightNeg = 0; // score -2 or -1
  let neutral = 0;   // score 0
  let slightPos = 0; // score 1 or 2
  let veryPos = 0;   // score >= 3

  for (const post of posts) {
    const s = post.sentiment;
    totalScore += s.score;

    if (s.label === 'positive') {
      positiveCount++;
    } else if (s.label === 'negative') {
      negativeCount++;
    } else {
      neutralCount++;
    }

    if (s.score <= -3) veryNeg++;
    else if (s.score < 0) slightNeg++;
    else if (s.score === 0) neutral++;
    else if (s.score <= 2) slightPos++;
    else veryPos++;
  }

  // Calculate percentages rounded to 1 decimal
  const positivePct = Number(((positiveCount / total) * 100).toFixed(1));
  const neutralPct = Number(((neutralCount / total) * 100).toFixed(1));
  const negativePct = Number(((negativeCount / total) * 100).toFixed(1));

  const avgScore = Number((totalScore / total).toFixed(2));

  // Determine dominant vibe based on highest frequency
  let dominantSentiment: SentimentLabel = 'neutral';
  if (positiveCount > neutralCount && positiveCount > negativeCount) {
    dominantSentiment = 'positive';
  } else if (negativeCount > neutralCount && negativeCount > positiveCount) {
    dominantSentiment = 'negative';
  } else if (positiveCount === negativeCount && positiveCount > neutralCount) {
    dominantSentiment = 'neutral';
  } else {
    dominantSentiment = 'neutral';
  }

  const scoreBuckets: ScoreBucket[] = [
    { name: 'Very Negative (≤ -3)', count: veryNeg, category: 'negative' },
    { name: 'Negative (-2 to -1)', count: slightNeg, category: 'negative' },
    { name: 'Neutral (0)', count: neutral, category: 'neutral' },
    { name: 'Positive (+1 to +2)', count: slightPos, category: 'positive' },
    { name: 'Very Positive (≥ +3)', count: veryPos, category: 'positive' },
  ];

  return {
    total,
    positiveCount,
    neutralCount,
    negativeCount,
    positivePct,
    neutralPct,
    negativePct,
    avgScore,
    dominantSentiment,
    scoreBuckets,
  };
}

/**
 * Formats a score/comment number into a human-friendly format (e.g. 1.2k).
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toLocaleString();
}

/**
 * Formats a UTC timestamp into relative elapsed time (e.g. 3h ago).
 */
export function formatRelativeTime(createdUtc: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diffSeconds = Math.max(0, now - createdUtc);

  if (diffSeconds < 60) {
    return 'just now';
  }
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  }
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
}
