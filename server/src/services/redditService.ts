import axios, { AxiosError } from 'axios';
import { RedditApiResponse, RedditPost, SubredditResponse } from '../types/reddit';
import { AppError } from '../middleware/errorHandler';

class RedditService {
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  private get clientId(): string | undefined {
    return process.env.REDDIT_CLIENT_ID?.trim();
  }

  private get clientSecret(): string | undefined {
    return process.env.REDDIT_CLIENT_SECRET?.trim();
  }

  private get userAgent(): string {
    return (
      process.env.REDDIT_USER_AGENT?.trim() ||
      'web:subreddit-vibe-check:v1.0.0 (by /u/vibecheck_app)'
    );
  }

  public get hasCredentials(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  /**
   * Fetches or reuses a cached Reddit OAuth2 application-only access token.
   */
  private async getAccessToken(): Promise<string | null> {
    if (!this.clientId || !this.clientSecret) {
      return null;
    }

    const now = Date.now();
    if (this.accessToken && this.tokenExpiresAt > now + 60_000) {
      return this.accessToken;
    }

    try {
      const basicAuth = Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString('base64');

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const response = await axios.post<{
        access_token: string;
        token_type: string;
        expires_in: number;
      }>('https://www.reddit.com/api/v1/access_token', params.toString(), {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': this.userAgent,
        },
        timeout: 8000,
      });

      if (response.data?.access_token) {
        this.accessToken = response.data.access_token;
        this.tokenExpiresAt = now + (response.data.expires_in || 3600) * 1000;
        console.log('[RedditService] Successfully obtained Reddit OAuth2 access token.');
        return this.accessToken;
      }
    } catch (error) {
      console.warn(
        '[RedditService] OAuth2 token acquisition failed:',
        error instanceof Error ? error.message : error
      );
    }

    return null;
  }

  /**
   * Generates realistic development fallback posts for testing when Reddit API credentials
   * are not yet configured or when Reddit blocks unauthenticated datacenter IPs.
   */
  private generateDevFallbackPosts(subreddit: string, limit = 50): SubredditResponse {
    console.log(
      `[RedditService] NOTICE: Using development fallback sample posts for r/${subreddit}. Configure REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in .env for live Reddit API data.`
    );

    const templates = [
      { prefix: 'Amazing breakthrough in', mood: 'positive', up: 2840, com: 412 },
      { prefix: 'Why I absolutely love using', mood: 'positive', up: 1950, com: 289 },
      { prefix: 'Comprehensive guide and great tips for', mood: 'positive', up: 1420, com: 165 },
      { prefix: 'Excellent discussion on the future of', mood: 'positive', up: 1100, com: 210 },
      { prefix: 'Celebrating a huge milestone with our community in', mood: 'positive', up: 3200, com: 540 },
      { prefix: 'Weekly discussion thread and questions about', mood: 'neutral', up: 450, com: 180 },
      { prefix: 'Monthly update notes released for', mood: 'neutral', up: 890, com: 95 },
      { prefix: 'How does everyone approach workflow in', mood: 'neutral', up: 670, com: 140 },
      { prefix: 'Overview of recent changes affecting', mood: 'neutral', up: 1250, com: 310 },
      { prefix: 'What is your current setup for', mood: 'neutral', up: 540, com: 230 },
      { prefix: 'Terrible experience and frustrating bugs with', mood: 'negative', up: 1870, com: 620 },
      { prefix: 'Why the latest update is a massive disappointment for', mood: 'negative', up: 2450, com: 780 },
      { prefix: 'Critical security flaw and dangerous issues found in', mood: 'negative', up: 3100, com: 490 },
      { prefix: 'I am really struggling and tired of the constant problems in', mood: 'negative', up: 980, com: 340 },
      { prefix: 'Sad news regarding recent changes to', mood: 'negative', up: 1540, com: 410 },
    ];

    const authors = [
      'dev_enthusiast', 'tech_guru', 'code_ninja', 'pixel_artist', 'data_nerd',
      'web_wizard', 'curious_coder', 'system_builder', 'syntax_master', 'binary_mind'
    ];

    const posts: RedditPost[] = [];
    const now = Math.floor(Date.now() / 1000);

    for (let i = 0; i < limit; i++) {
      const template = templates[i % templates.length];
      const author = authors[i % authors.length];
      const hourOffset = (i + 1) * 3600 * 2;
      const variation = Math.floor(Math.random() * 200) - 100;

      posts.push({
        id: `mock_${subreddit}_${i + 1}`,
        title: `${template.prefix} r/${subreddit} #${i + 1}`,
        author: `${author}_${(i % 5) + 1}`,
        subreddit,
        score: Math.max(10, template.up + variation * 3),
        numComments: Math.max(5, template.com + variation),
        url: `https://www.reddit.com/r/${subreddit}`,
        permalink: `https://www.reddit.com/r/${subreddit}/comments/mock_${i + 1}`,
        createdUtc: now - hourOffset,
        isVideo: i % 7 === 0,
      });
    }

    return {
      subreddit,
      count: posts.length,
      posts,
      isMockData: true,
    };
  }

  /**
   * Fetches the top Hot posts from a given subreddit.
   * @param subreddit Normalized subreddit name
   * @param limit Number of posts to retrieve (max 50)
   */
  public async getHotPosts(
    subreddit: string,
    limit = 50
  ): Promise<SubredditResponse> {
    const sanitizedLimit = Math.min(Math.max(1, limit), 50);
    const token = await this.getAccessToken();

    const url = token
      ? `https://oauth.reddit.com/r/${encodeURIComponent(subreddit)}/hot`
      : `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/hot.json`;

    const headers: Record<string, string> = {
      'User-Agent': this.userAgent,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await axios.get<RedditApiResponse>(url, {
        params: {
          limit: sanitizedLimit,
          raw_json: 1,
        },
        headers,
        timeout: 10000,
      });

      const data = response.data;
      if (!data || !data.data || !Array.isArray(data.data.children)) {
        throw new AppError(
          `Received unexpected response format from Reddit for r/${subreddit}.`,
          502,
          'MALFORMED_REDDIT_RESPONSE'
        );
      }

      const rawPosts = data.data.children;

      if (rawPosts.length === 0) {
        throw new AppError(
          `No hot posts found for r/${subreddit}. The subreddit might be empty or inactive.`,
          404,
          'SUBREDDIT_EMPTY'
        );
      }

      const posts: RedditPost[] = rawPosts
        .filter((child) => child.kind === 't3' && child.data)
        .map((child) => {
          const item = child.data;
          const thumbnail =
            item.thumbnail &&
            item.thumbnail.startsWith('http') &&
            !['default', 'self', 'nsfw', 'spoiler', 'image'].includes(item.thumbnail)
              ? item.thumbnail
              : undefined;

          return {
            id: item.id || Math.random().toString(36).substring(2, 9),
            title: item.title ? item.title.trim() : '(Untitled Post)',
            author: item.author || '[deleted]',
            subreddit: item.subreddit || subreddit,
            score: typeof item.score === 'number' ? item.score : 0,
            numComments:
              typeof item.num_comments === 'number' ? item.num_comments : 0,
            url: item.url || `https://www.reddit.com${item.permalink || ''}`,
            permalink: item.permalink
              ? `https://www.reddit.com${item.permalink}`
              : `https://www.reddit.com/r/${subreddit}`,
            createdUtc: item.created_utc || Math.floor(Date.now() / 1000),
            thumbnail,
            isVideo: Boolean(item.is_video),
          };
        });

      return {
        subreddit,
        count: posts.length,
        posts,
        isMockData: false,
      };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        const axiosErr = error as AxiosError<{ message?: string; error?: number | string }>;
        const status = axiosErr.response?.status;

        // If unauthenticated and Reddit blocks our server IP (403/429), fall back to
        // demo sample data so the UI remains fully demonstrable without OAuth credentials.
        if (!token && (status === 403 || status === 429)) {
          return this.generateDevFallbackPosts(subreddit, sanitizedLimit);
        }

        if (status === 404) {
          throw new AppError(
            `Subreddit r/${subreddit} was not found. Please check the spelling and try again.`,
            404,
            'SUBREDDIT_NOT_FOUND'
          );
        }

        if (status === 403) {
          throw new AppError(
            `r/${subreddit} is a private or quarantined subreddit and cannot be accessed.`,
            403,
            'SUBREDDIT_FORBIDDEN'
          );
        }

        if (status === 429) {
          throw new AppError(
            'Reddit API rate limit reached. Please wait a moment before trying again.',
            429,
            'RATE_LIMIT_EXCEEDED'
          );
        }

        if (status && status >= 500) {
          throw new AppError(
            'Reddit servers are currently experiencing issues. Please try again in a few moments.',
            503,
            'REDDIT_SERVICE_UNAVAILABLE'
          );
        }

        if (axiosErr.code === 'ECONNABORTED' || axiosErr.message.includes('timeout')) {
          throw new AppError(
            'Request to Reddit timed out. Please check your network and try again.',
            504,
            'REDDIT_TIMEOUT'
          );
        }
      }

      // If no OAuth token and any network error, fall back to demo data
      if (!token) {
        return this.generateDevFallbackPosts(subreddit, sanitizedLimit);
      }

      throw new AppError(
        `Unable to fetch posts for r/${subreddit}. Please verify your connection or try another community.`,
        502,
        'REDDIT_FETCH_FAILED'
      );
    }
  }
}

export const redditService = new RedditService();
