import { describe, it, expect } from 'vitest';
import { calculateStats, formatNumber, formatRelativeTime } from '../stats';
import { AnalyzedPost } from '../../types/reddit';

const createMockPost = (
  id: string,
  score: number,
  label: 'positive' | 'neutral' | 'negative',
  sentimentScore: number
): AnalyzedPost => ({
  id,
  title: `Sample post title ${id}`,
  author: 'test_user',
  subreddit: 'programming',
  score,
  numComments: 10,
  url: 'https://reddit.com',
  permalink: 'https://reddit.com/r/programming/1',
  createdUtc: Math.floor(Date.now() / 1000) - 3600,
  sentiment: {
    label,
    score: sentimentScore,
    comparative: sentimentScore / 5,
    positiveWords: label === 'positive' ? ['good'] : [],
    negativeWords: label === 'negative' ? ['bad'] : [],
  },
});

describe('Statistics Calculations', () => {
  it('should handle empty post array', () => {
    const stats = calculateStats([]);
    expect(stats.total).toBe(0);
    expect(stats.positiveCount).toBe(0);
    expect(stats.neutralCount).toBe(0);
    expect(stats.negativeCount).toBe(0);
    expect(stats.avgScore).toBe(0);
    expect(stats.dominantSentiment).toBe('neutral');
  });

  it('should correctly aggregate counts and percentages', () => {
    const mockPosts: AnalyzedPost[] = [
      createMockPost('1', 100, 'positive', 3),
      createMockPost('2', 50, 'positive', 2),
      createMockPost('3', 30, 'neutral', 0),
      createMockPost('4', 10, 'negative', -2),
    ];

    const stats = calculateStats(mockPosts);

    expect(stats.total).toBe(4);
    expect(stats.positiveCount).toBe(2);
    expect(stats.neutralCount).toBe(1);
    expect(stats.negativeCount).toBe(1);

    expect(stats.positivePct).toBe(50);
    expect(stats.neutralPct).toBe(25);
    expect(stats.negativePct).toBe(25);

    // Total percentages sum to 100%
    expect(stats.positivePct + stats.neutralPct + stats.negativePct).toBe(100);

    // Avg score: (3 + 2 + 0 + (-2)) / 4 = 3 / 4 = 0.75
    expect(stats.avgScore).toBe(0.75);

    expect(stats.dominantSentiment).toBe('positive');
  });

  it('should format numbers cleanly', () => {
    expect(formatNumber(450)).toBe('450');
    expect(formatNumber(1200)).toBe('1.2K');
    expect(formatNumber(45000)).toBe('45K');
    expect(formatNumber(1500000)).toBe('1.5M');
  });

  it('should format relative timestamps', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(formatRelativeTime(now - 10)).toBe('just now');
    expect(formatRelativeTime(now - 300)).toBe('5m ago');
    expect(formatRelativeTime(now - 7200)).toBe('2h ago');
    expect(formatRelativeTime(now - 86400 * 3)).toBe('3d ago');
  });
});
