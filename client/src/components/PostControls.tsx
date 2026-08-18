import React from 'react';
import { SentimentFilter, SortOption, SubredditStats } from '../types/reddit';
import { Filter, ArrowUpDown } from 'lucide-react';

interface PostControlsProps {
  filter: SentimentFilter;
  setFilter: (filter: SentimentFilter) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  stats: SubredditStats;
  totalFiltered: number;
}

export const PostControls: React.FC<PostControlsProps> = ({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  stats,
  totalFiltered,
}) => {
  const filterOptions: { id: SentimentFilter; label: string; count: number; colorClass: string }[] = [
    { id: 'all', label: 'All Posts', count: stats.total, colorClass: 'hover:text-white' },
    { id: 'positive', label: 'Positive', count: stats.positiveCount, colorClass: 'hover:text-emerald-400' },
    { id: 'neutral', label: 'Neutral', count: stats.neutralCount, colorClass: 'hover:text-slate-300' },
    { id: 'negative', label: 'Negative', count: stats.negativeCount, colorClass: 'hover:text-rose-400' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-900/90 border border-slate-800/80 shadow-md">
      
      {/* Sentiment Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5 text-reddit-orange" />
          Filter:
        </div>
        
        {filterOptions.map((opt) => {
          const isActive = filter === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setFilter(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-reddit-orange text-white shadow-md shadow-reddit-orange/20'
                  : `bg-slate-800/70 text-slate-400 border border-slate-700/50 ${opt.colorClass}`
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-black/30 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort Dropdown & Result Count */}
      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
        <span className="text-xs text-slate-400 font-medium">
          Showing <span className="text-white font-bold">{totalFiltered}</span> posts
        </span>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-800 text-slate-200 text-xs font-medium py-1.5 px-3 rounded-xl border border-slate-700 focus:outline-none focus:border-reddit-orange cursor-pointer"
            aria-label="Sort posts by"
          >
            <option value="score">🔥 Reddit Upvotes</option>
            <option value="comments">💬 Comments Count</option>
            <option value="sentiment-desc">🟢 Highest Sentiment</option>
            <option value="sentiment-asc">🔴 Lowest Sentiment</option>
            <option value="date">⏱️ Newest Posted</option>
          </select>
        </div>
      </div>

    </div>
  );
};
