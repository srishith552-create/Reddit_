import { useState, useMemo, useCallback, useRef } from 'react';
import {
  AnalyzedPost,
  SentimentFilter,
  SortOption,
  SubredditStats,
} from '../types/reddit';
import { fetchSubredditHot } from '../services/redditApi';
import { analyzeSentiment } from '../utils/sentiment';
import { calculateStats } from '../utils/stats';
import { validateSubreddit } from '../utils/subreddit';

export function useSubreddit() {
  const [currentSubreddit, setCurrentSubreddit] = useState<string>('');
  const [posts, setPosts] = useState<AnalyzedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<SentimentFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [isMockData, setIsMockData] = useState<boolean>(false);

  // In-memory cache to store analyzed subreddits for fast switching
  const cacheRef = useRef<Map<string, AnalyzedPost[]>>(new Map());

  const analyzeSubreddit = useCallback(async (rawInput: string) => {
    const validation = validateSubreddit(rawInput);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid subreddit name.');
      return;
    }

    const subreddit = validation.normalized;
    setError(null);
    setLoading(true);
    setCurrentSubreddit(subreddit);

    // Check in-memory cache
    if (cacheRef.current.has(subreddit.toLowerCase())) {
      const cachedPosts = cacheRef.current.get(subreddit.toLowerCase())!;
      setPosts(cachedPosts);
      setLoading(false);
      return;
    }

    try {
      const data = await fetchSubredditHot(subreddit, 50);

      // Perform client-side sentiment analysis once per post
      const analyzed: AnalyzedPost[] = data.posts.map((post) => ({
        ...post,
        sentiment: analyzeSentiment(post.title),
      }));

      cacheRef.current.set(subreddit.toLowerCase(), analyzed);
      setPosts(analyzed);
      setIsMockData(Boolean(data.isMockData));
    } catch (err) {
      setPosts([]);
      setIsMockData(false);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch subreddit data. Please check the name and try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const retry = useCallback(() => {
    if (currentSubreddit) {
      // Clear cache on explicit retry to get fresh data
      cacheRef.current.delete(currentSubreddit.toLowerCase());
      analyzeSubreddit(currentSubreddit);
    }
  }, [currentSubreddit, analyzeSubreddit]);

  // Derived aggregate statistics
  const stats: SubredditStats = useMemo(() => {
    return calculateStats(posts);
  }, [posts]);

  // Filtered and sorted post list
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];

    // Filter
    if (filter !== 'all') {
      result = result.filter((post) => post.sentiment.label === filter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'comments':
          return b.numComments - a.numComments;
        case 'sentiment-desc':
          return b.sentiment.score - a.sentiment.score;
        case 'sentiment-asc':
          return a.sentiment.score - b.sentiment.score;
        case 'date':
          return b.createdUtc - a.createdUtc;
        default:
          return 0;
      }
    });

    return result;
  }, [posts, filter, sortBy]);

  return {
    currentSubreddit,
    posts: filteredAndSortedPosts,
    rawPostsCount: posts.length,
    stats,
    loading,
    error,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    isMockData,
    analyzeSubreddit,
    retry,
  };
}
