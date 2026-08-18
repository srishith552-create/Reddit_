import React from 'react';
import { Compass } from 'lucide-react';

export interface SuggestedSubreddit {
  name: string;
  label: string;
}

export const DEFAULT_SUGGESTIONS: SuggestedSubreddit[] = [
  { name: 'programming', label: '💻 programming' },
  { name: 'technology', label: '⚡ technology' },
  { name: 'webdev', label: '🌐 webdev' },
  { name: 'movies', label: '🍿 movies' },
  { name: 'gaming', label: '🎮 gaming' },
  { name: 'india', label: '🇮🇳 india' },
];

interface SuggestedSubredditsProps {
  onSelect: (subreddit: string) => void;
  activeSubreddit?: string;
  disabled?: boolean;
}

export const SuggestedSubreddits: React.FC<SuggestedSubredditsProps> = ({
  onSelect,
  activeSubreddit,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Compass className="w-3.5 h-3.5 text-reddit-orange" />
        Explore:
      </span>
      {DEFAULT_SUGGESTIONS.map((item) => {
        const isSelected =
          activeSubreddit?.toLowerCase() === item.name.toLowerCase();

        return (
          <button
            key={item.name}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(item.name)}
            aria-label={`Select subreddit r/${item.name}`}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelected
                ? 'bg-reddit-orange text-white shadow-md shadow-reddit-orange/25 font-semibold ring-1 ring-reddit-orange'
                : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
