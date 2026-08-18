import React from 'react';
import { Loader2, Sparkles, Activity } from 'lucide-react';

interface LoadingStateProps {
  subreddit: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ subreddit }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Loading banner */}
      <div className="rounded-3xl p-8 bg-surface-900/90 border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-reddit-orange/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-4 rounded-2xl bg-reddit-orange/10 text-reddit-orange border border-reddit-orange/20 animate-pulse">
            <Activity className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Loader2 className="w-5 h-5 text-reddit-orange animate-spin" />
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Analyzing r/{subreddit}...
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Fetching top 50 Hot posts from Reddit and evaluating client-side sentiment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          Processing AFINN Lexicon
        </div>
      </div>

      {/* KPI Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={`kpi-skel-${i}`}
            className="rounded-2xl p-5 bg-surface-900/60 border border-slate-800/80 animate-pulse space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="w-24 h-3.5 bg-slate-800 rounded" />
              <div className="w-8 h-8 bg-slate-800 rounded-xl" />
            </div>
            <div className="w-16 h-7 bg-slate-800 rounded" />
            <div className="w-full h-2 bg-slate-800 rounded-full" />
          </div>
        ))}
      </div>

      {/* Chart Skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl p-6 bg-surface-900/60 border border-slate-800/80 animate-pulse h-80 flex flex-col justify-between">
          <div className="w-40 h-4 bg-slate-800 rounded" />
          <div className="w-40 h-40 rounded-full bg-slate-800/80 mx-auto" />
          <div className="w-48 h-4 bg-slate-800 rounded mx-auto" />
        </div>
        <div className="rounded-3xl p-6 bg-surface-900/60 border border-slate-800/80 animate-pulse h-80 flex flex-col justify-between">
          <div className="w-44 h-4 bg-slate-800 rounded" />
          <div className="w-full h-44 bg-slate-800/60 rounded-xl" />
          <div className="w-32 h-4 bg-slate-800 rounded" />
        </div>
      </div>

      {/* Post List Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={`post-skel-${i}`}
            className="rounded-2xl p-5 bg-surface-900/60 border border-slate-800/80 animate-pulse space-y-3"
          >
            <div className="w-20 h-5 bg-slate-800 rounded-lg" />
            <div className="w-full h-4 bg-slate-800 rounded" />
            <div className="w-3/4 h-4 bg-slate-800 rounded" />
            <div className="w-1/2 h-3 bg-slate-800 rounded pt-2" />
          </div>
        ))}
      </div>

    </div>
  );
};
