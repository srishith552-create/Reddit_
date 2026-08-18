/**
 * Standardized internal post data model returned to the frontend.
 */
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

/**
 * Standardized backend API response envelope.
 */
export interface SubredditResponse {
  subreddit: string;
  count: number;
  posts: RedditPost[];
  isMockData?: boolean;
}

/**
 * Raw data structure returned by Reddit's API for each post.
 */
export interface RedditApiChildData {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  url: string;
  permalink: string;
  created_utc: number;
  thumbnail?: string;
  is_video?: boolean;
  over_18?: boolean;
  stickied?: boolean;
}

export interface RedditApiChild {
  kind: string;
  data: RedditApiChildData;
}

export interface RedditApiResponse {
  kind: string;
  data: {
    after: string | null;
    dist: number;
    children: RedditApiChild[];
  };
}

/**
 * Error model returned in response bodies on failure.
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
