import { Router, Request, Response, NextFunction } from 'express';
import { redditService } from '../services/redditService';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Reddit subreddit naming standard: 2 to 21 characters, letters, numbers, and underscores
const SUBREDDIT_REGEX = /^[a-zA-Z0-9_]{2,21}$/;

/**
 * Normalizes input subreddit string:
 * - Removes 'r/' or '/r/' prefix
 * - Strips leading/trailing slashes and whitespace
 */
function normalizeSubreddit(input: string): string {
  if (!input) return '';
  let cleaned = input.trim();
  // Strip URL prefixes (with or without http:// or https://)
  cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?reddit\.com\/r\//i, '');
  // Strip r/ or /r/
  cleaned = cleaned.replace(/^\/?r\//i, '');
  // Strip trailing slashes or path segments (e.g. /hot)
  cleaned = cleaned.split('/')[0].trim();
  return cleaned;
}

/**
 * GET /api/subreddit/:subreddit/hot
 * Fetches up to 50 Hot posts for the requested subreddit.
 */
router.get(
  '/subreddit/:subreddit/hot',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawSubreddit = Array.isArray(req.params.subreddit)
        ? req.params.subreddit[0]
        : req.params.subreddit;
      const normalized = normalizeSubreddit(rawSubreddit || '');

      if (!normalized) {
        throw new AppError(
          'Please provide a valid subreddit name.',
          400,
          'INVALID_SUBREDDIT_NAME'
        );
      }

      if (!SUBREDDIT_REGEX.test(normalized)) {
        throw new AppError(
          `'${normalized}' is not a valid subreddit name. Subreddit names must be 2-21 characters and contain only letters, numbers, or underscores.`,
          400,
          'INVALID_SUBREDDIT_FORMAT'
        );
      }

      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 50;

      const result = await redditService.getHotPosts(normalized, limit);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/health
 * Basic health check endpoint.
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    redditAuthAvailable: Boolean(
      process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET
    ),
  });
});

export default router;
