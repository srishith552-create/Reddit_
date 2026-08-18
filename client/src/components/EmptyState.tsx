import React from 'react';
import { Flame, Activity, BarChart2, Zap } from 'lucide-react';

interface EmptyStateProps {
  onSelectSubreddit: (subreddit: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSelectSubreddit,
}) => {
  const popularExamples = [
    { name: 'technology', description: 'Tech industry news & developments' },
    { name: 'programming', description: 'Software engineering & discussions' },
    { name: 'movies', description: 'Film releases & cinematic debates' },
    { name: 'gaming', description: 'Latest video games & player community' },
  ];

  return (
    <div className="py-12 space-y-12 animate-fade-in max-w-4xl mx-auto">
      
      {/* Hero Welcome Banner */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-reddit-orange/20 to-amber-500/20 text-reddit-orange border border-reddit-orange/30 shadow-2xl shadow-reddit-orange/10 mb-2">
          <Flame className="w-10 h-10 stroke-[2.2]" />
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Discover the Vibe of Any Community
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Enter any subreddit above or choose one below to fetch the top 50 Hot posts and compute real-time sentiment distribution.
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-surface-900/80 border border-slate-800/80 shadow-md">
          <div className="p-3 w-fit rounded-xl bg-reddit-orange/10 text-reddit-orange mb-4">
            <Flame className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Top 50 Hot Posts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time synchronization with Reddit's latest trending discussions and community engagement.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-900/80 border border-slate-800/80 shadow-md">
          <div className="p-3 w-fit rounded-xl bg-emerald-500/10 text-emerald-400 mb-4">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">In-Browser AFINN NLP</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fast, zero-latency client-side sentiment analysis evaluating mood, intensity, and polarity.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-surface-900/80 border border-slate-800/80 shadow-md">
          <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-400 mb-4">
            <BarChart2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Rich Visual Analytics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Interactive Donut breakdown, score histograms, and responsive client-side post filtering.
          </p>
        </div>
      </div>

      {/* Popular Subreddit Quick-Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Zap className="w-4 h-4 text-reddit-orange" />
          <span>Popular Subreddits To Analyze</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {popularExamples.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => onSelectSubreddit(item.name)}
              className="flex items-center justify-between p-4 rounded-2xl bg-surface-900/60 hover:bg-surface-850 border border-slate-800 hover:border-reddit-orange/50 transition-all text-left group cursor-pointer"
            >
              <div>
                <span className="text-sm font-bold text-white group-hover:text-reddit-orange transition-colors">
                  r/{item.name}
                </span>
                <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
              </div>
              <span className="text-xs font-semibold text-reddit-orange px-3 py-1.5 rounded-xl bg-reddit-orange/10 border border-reddit-orange/20 opacity-0 group-hover:opacity-100 transition-opacity">
                Analyze →
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
