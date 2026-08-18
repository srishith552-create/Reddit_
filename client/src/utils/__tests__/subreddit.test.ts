import { describe, it, expect } from 'vitest';
import { normalizeSubreddit, validateSubreddit } from '../subreddit';

describe('Subreddit Normalization', () => {
  it('should preserve standard subreddit names', () => {
    expect(normalizeSubreddit('programming')).toBe('programming');
    expect(normalizeSubreddit('technology')).toBe('technology');
  });

  it('should strip r/ and /r/ prefixes', () => {
    expect(normalizeSubreddit('r/programming')).toBe('programming');
    expect(normalizeSubreddit('r/webdev')).toBe('webdev');
    expect(normalizeSubreddit('/r/movies')).toBe('movies');
    expect(normalizeSubreddit('/r/gaming/')).toBe('gaming');
  });

  it('should trim whitespace', () => {
    expect(normalizeSubreddit('   programming   ')).toBe('programming');
    expect(normalizeSubreddit('  r/reactjs  ')).toBe('reactjs');
  });

  it('should strip URLs and subpaths', () => {
    expect(
      normalizeSubreddit('https://www.reddit.com/r/technology/hot')
    ).toBe('technology');
    expect(normalizeSubreddit('reddit.com/r/news/top')).toBe('news');
  });
});

describe('Subreddit Validation', () => {
  it('should accept valid subreddit names', () => {
    expect(validateSubreddit('programming').isValid).toBe(true);
    expect(validateSubreddit('r/web_dev').isValid).toBe(true);
    expect(validateSubreddit('AskReddit').isValid).toBe(true);
  });

  it('should reject empty or whitespace-only inputs', () => {
    const res = validateSubreddit('   ');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('enter a subreddit name');
  });

  it('should reject names shorter than 2 characters', () => {
    const res = validateSubreddit('a');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('too short');
  });

  it('should reject names longer than 21 characters', () => {
    const res = validateSubreddit('thisnameiswaytoolongtobevalidinreddit');
    expect(res.isValid).toBe(false);
    expect(res.error).toContain('too long');
  });

  it('should reject names with invalid special characters', () => {
    expect(validateSubreddit('react$js').isValid).toBe(false);
    expect(validateSubreddit('web dev').isValid).toBe(false);
    expect(validateSubreddit('test!sub').isValid).toBe(false);
  });
});
