const SUBREDDIT_REGEX = /^[a-zA-Z0-9_]{2,21}$/;

export interface SubredditValidationResult {
  isValid: boolean;
  normalized: string;
  error?: string;
}

/**
 * Normalizes user input for subreddit searches:
 * - Trims leading and trailing whitespace
 * - Removes URL structures (e.g. reddit.com/r/...)
 * - Strips 'r/' or '/r/' prefixes
 * - Removes trailing slashes and subroutes (e.g. '/hot')
 */
export function normalizeSubreddit(input: string): string {
  if (!input) return '';
  let cleaned = input.trim();

  // Strip URL prefixes (with or without http:// or https://)
  cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?reddit\.com\/r\//i, '');
  // Strip r/ or /r/
  cleaned = cleaned.replace(/^\/?r\//i, '');
  // Strip trailing slashes or sub-paths like /hot or /top
  cleaned = cleaned.split('/')[0].trim();

  return cleaned;
}

/**
 * Validates whether the normalized subreddit matches Reddit's naming criteria:
 * - 2 to 21 alphanumeric characters or underscores
 */
export function validateSubreddit(input: string): SubredditValidationResult {
  const normalized = normalizeSubreddit(input);

  if (!normalized) {
    return {
      isValid: false,
      normalized: '',
      error: 'Please enter a subreddit name.',
    };
  }

  if (normalized.length < 2) {
    return {
      isValid: false,
      normalized,
      error: 'Subreddit name is too short (minimum 2 characters).',
    };
  }

  if (normalized.length > 21) {
    return {
      isValid: false,
      normalized,
      error: 'Subreddit name is too long (maximum 21 characters).',
    };
  }

  if (!SUBREDDIT_REGEX.test(normalized)) {
    return {
      isValid: false,
      normalized,
      error: 'Subreddit names can only contain letters, numbers, and underscores.',
    };
  }

  return {
    isValid: true,
    normalized,
  };
}
