import Sentiment from 'sentiment';
import { SentimentResult, SentimentLabel } from '../types/reddit';

const sentiment = new Sentiment();

/**
 * Classifies a text string into positive, neutral, or negative sentiment.
 * 
 * Thresholds:
 * - POSITIVE: raw score > 0 (or comparative > 0.05)
 * - NEGATIVE: raw score < 0 (or comparative < -0.05)
 * - NEUTRAL:  raw score === 0 (or -0.05 <= comparative <= 0.05)
 *
 * @param text The post title or string to analyze
 * @returns Standardized SentimentResult
 */
export function analyzeSentiment(text: string): SentimentResult {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return {
      label: 'neutral',
      score: 0,
      comparative: 0,
      positiveWords: [],
      negativeWords: [],
    };
  }

  const result = sentiment.analyze(text);
  const score = result.score;
  const comparative = Number(result.comparative.toFixed(3));

  let label: SentimentLabel = 'neutral';

  if (score > 0 || comparative > 0.05) {
    label = 'positive';
  } else if (score < 0 || comparative < -0.05) {
    label = 'negative';
  } else {
    label = 'neutral';
  }

  return {
    label,
    score,
    comparative,
    positiveWords: result.positive || [],
    negativeWords: result.negative || [],
  };
}
