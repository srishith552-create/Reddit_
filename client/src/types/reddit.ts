export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export type SentimentFilter = 'all' | 'positive' | 'neutral' | 'negative';

export type SortOption =
  | 'score'
  | 'comments'
  | 'sentiment-desc'
  | 'sentiment-asc'
  | 'date';

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  numComments: number;
  url: string;
  permalink: string;
  createdUtc: number;
  thumbnail?: string;
  isVideo?: boolean;
}

export interface SentimentResult {
  label: SentimentLabel;
  score: number;
  comparative: number;
  positiveWords: string[];
  negativeWords: string[];
}

export interface AnalyzedPost extends RedditPost {
  sentiment: SentimentResult;
}

export interface ScoreBucket {
  name: string;
  count: number;
  category: SentimentLabel;
}

export interface SubredditStats {
  total: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  avgScore: number;
  dominantSentiment: SentimentLabel;
  scoreBuckets: ScoreBucket[];
}

export interface SubredditApiResponse {
  subreddit: string;
  count: number;
  posts: RedditPost[];
  isMockData?: boolean;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}
