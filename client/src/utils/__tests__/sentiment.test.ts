import { describe, it, expect } from 'vitest';
import { analyzeSentiment } from '../sentiment';

describe('Sentiment Analysis Engine', () => {
  it('should correctly classify positive titles', () => {
    const res = analyzeSentiment('This new feature is absolutely amazing and wonderful!');
    expect(res.label).toBe('positive');
    expect(res.score).toBeGreaterThan(0);
    expect(res.positiveWords.length).toBeGreaterThan(0);
  });

  it('should correctly classify negative titles', () => {
    const res = analyzeSentiment('Massive outage caused catastrophic disaster and terrible bugs');
    expect(res.label).toBe('negative');
    expect(res.score).toBeLessThan(0);
    expect(res.negativeWords.length).toBeGreaterThan(0);
  });

  it('should correctly classify neutral titles', () => {
    const res = analyzeSentiment('Version 3.4.0 released for general availability');
    expect(res.label).toBe('neutral');
    expect(res.score).toBe(0);
  });

  it('should handle empty or whitespace text gracefully', () => {
    const res = analyzeSentiment('   ');
    expect(res.label).toBe('neutral');
    expect(res.score).toBe(0);
    expect(res.positiveWords).toEqual([]);
    expect(res.negativeWords).toEqual([]);
  });
});
