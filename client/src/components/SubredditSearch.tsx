import React, { useState, useEffect } from 'react';
import { Search, Loader2, X, Sparkles } from 'lucide-react';
import { SuggestedSubreddits } from './SuggestedSubreddits';
import { normalizeSubreddit } from '../utils/subreddit';

interface SubredditSearchProps {
  onSearch: (subreddit: string) => void;
  loading: boolean;
  currentSubreddit?: string;
}

export const SubredditSearch: React.FC<SubredditSearchProps> = ({
  onSearch,
  loading,
  currentSubreddit,
}) => {
  const [inputValue, setInputValue] = useState<string>(currentSubreddit || '');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  useEffect(() => {
    if (currentSubreddit) {
      setInputValue(currentSubreddit);
    }
  }, [currentSubreddit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeSubreddit(inputValue);

    if (!normalized) {
      setValidationWarning('Please enter a subreddit name to analyze.');
      return;
    }

    setValidationWarning(null);
    onSearch(normalized);
  };

  const handleSuggestionSelect = (sub: string) => {
    setInputValue(sub);
    setValidationWarning(null);
    onSearch(sub);
  };

  const handleClear = () => {
    setInputValue('');
    setValidationWarning(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center rounded-2xl bg-surface-900/90 border border-slate-700/80 shadow-xl shadow-black/40 focus-within:border-reddit-orange focus-within:ring-2 focus-within:ring-reddit-orange/30 transition-all">
          {/* Prefix indicator */}
          <div className="pl-4 pr-1 text-slate-400 flex items-center gap-1.5 select-none font-mono text-sm font-semibold">
            <Search className="w-4 h-4 text-reddit-orange" />
            <span className="text-slate-500">r/</span>
          </div>

          {/* Subreddit text input */}
          <input
            id="subreddit-input"
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (validationWarning) setValidationWarning(null);
            }}
            placeholder="e.g. programming, technology, webdev..."
            disabled={loading}
            className="w-full py-3.5 px-1 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none disabled:opacity-50"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Clear button */}
          {inputValue && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 mr-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit button */}
          <div className="pr-2">
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-reddit-orange to-amber-500 hover:from-reddit-hover hover:to-amber-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-reddit-orange/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Vibe</span>
                </>
              )}
            </button>
          </div>
        </div>

        {validationWarning && (
          <p className="text-xs text-amber-400 mt-1.5 pl-2 animate-fade-in font-medium">
            {validationWarning}
          </p>
        )}
      </form>

      {/* Suggested Subreddits */}
      <SuggestedSubreddits
        onSelect={handleSuggestionSelect}
        activeSubreddit={currentSubreddit}
        disabled={loading}
      />
    </div>
  );
};
