import React from 'react';
import { SubredditStats } from '../types/reddit';
import { Smile, Meh, Frown, Gauge, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatsCardsProps {
  stats: SubredditStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const isPositiveAvg = stats.avgScore > 0;
  const isNegativeAvg = stats.avgScore < 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* Positive Posts Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-surface-900/80 border border-slate-800/80 hover:border-emerald-500/40 shadow-lg transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Positive Posts
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
            <Smile className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {stats.positiveCount}
          </span>
          <span className="text-sm font-semibold text-emerald-400">
            {stats.positivePct}%
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.positivePct}%` }}
          />
        </div>
      </div>

      {/* Neutral Posts Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-surface-900/80 border border-slate-800/80 hover:border-slate-500/40 shadow-lg transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Neutral Posts
          </span>
          <div className="p-2 rounded-xl bg-slate-500/10 text-slate-300 group-hover:scale-110 transition-transform">
            <Meh className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {stats.neutralCount}
          </span>
          <span className="text-sm font-semibold text-slate-300">
            {stats.neutralPct}%
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-slate-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.neutralPct}%` }}
          />
        </div>
      </div>

      {/* Negative Posts Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-surface-900/80 border border-slate-800/80 hover:border-rose-500/40 shadow-lg transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Negative Posts
          </span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
            <Frown className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-3xl font-extrabold text-white tracking-tight">
            {stats.negativeCount}
          </span>
          <span className="text-sm font-semibold text-rose-400">
            {stats.negativePct}%
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-rose-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats.negativePct}%` }}
          />
        </div>
      </div>

      {/* Average Sentiment Score Card */}
      <div className="relative overflow-hidden rounded-2xl p-5 bg-surface-900/80 border border-slate-800/80 hover:border-amber-500/40 shadow-lg transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Avg Sentiment Score
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
            <Gauge className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span
            className={`text-3xl font-extrabold tracking-tight ${
              isPositiveAvg
                ? 'text-emerald-400'
                : isNegativeAvg
                ? 'text-rose-400'
                : 'text-slate-200'
            }`}
          >
            {stats.avgScore > 0 ? `+${stats.avgScore}` : stats.avgScore}
          </span>
          <span className="flex items-center text-xs font-semibold text-slate-400">
            {isPositiveAvg ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400 inline" />
            ) : isNegativeAvg ? (
              <ArrowDownRight className="w-4 h-4 text-rose-400 inline" />
            ) : (
              <Minus className="w-4 h-4 text-slate-400 inline" />
            )}
            AFINN Scale
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-3 font-normal">
          Calculated across all analyzed titles
        </p>
      </div>

    </div>
  );
};
