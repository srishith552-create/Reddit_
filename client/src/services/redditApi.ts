import { SubredditApiResponse } from '../types/reddit';

/**
 * Fetches Hot posts for a subreddit from our Express backend.
 */
export async function fetchSubredditHot(
  subreddit: string,
  limit = 50
): Promise<SubredditApiResponse> {
  const url = `/api/subreddit/${encodeURIComponent(subreddit)}/hot?limit=${limit}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      const errorMessage =
        data?.error?.message ||
        `Failed to fetch r/${subreddit} (HTTP ${res.status}).`;
      throw new Error(errorMessage);
    }

    return data as SubredditApiResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected network error occurred. Please try again.');
  }
}
