import React from 'react';
import { SubredditStats, SentimentLabel } from '../types/reddit';
import { Smile, Meh, Frown, ShieldCheck } from 'lucide-react';

interface SubredditOverviewProps {
  subreddit: string;
  stats: SubredditStats;
  isMockData?: boolean;
}

export const SubredditOverview: React.FC<SubredditOverviewProps> = ({
  subreddit,
  stats,
  isMockData = false,
}) => {
  const getVibeDetails = (label: SentimentLabel) => {
    switch (label) {
      case 'positive':
        return {
          icon: Smile,
          title: 'Positive Vibe',
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          gradientClass: 'from-emerald-500/10 to-transparent border-emerald-500/20',
          dotColor: 'bg-emerald-400',
          description: `The community is feeling predominantly upbeat, enthusiastic, and constructive right now with ${stats.positivePct}% positive sentiment.`,
        };
      case 'negative':
        return {
          icon: Frown,
          title: 'Negative / Critical Vibe',
          badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          gradientClass: 'from-rose-500/10 to-transparent border-rose-500/20',
          dotColor: 'bg-rose-400',
          description: `The community discussions currently lean critical, frustrated, or controversial with ${stats.negativePct}% negative post sentiment.`,
        };
      case 'neutral':
      default:
        return {
          icon: Meh,
          title: 'Neutral / Balanced Vibe',
          badgeClass: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
          gradientClass: 'from-blue-500/10 to-transparent border-blue-500/20',
          dotColor: 'bg-slate-400',
          description: `The community discussions are mostly informative, objective, or question-driven with ${stats.neutralPct}% neutral sentiment.`,
        };
    }
  };

  const vibe = getVibeDetails(stats.dominantSentiment);
  const VibeIcon = vibe.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-surface-900/90 border ${vibe.gradientClass} shadow-2xl backdrop-blur-xl transition-all`}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-gradient-to-br from-reddit-orange/10 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        
        {/* Subreddit Info & Vibe Headline */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              r/{subreddit}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-reddit-orange" />
              {stats.total} Posts Analyzed
            </span>
            {isMockData && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                ⚠️ Dev Mode (Sample Fallback)
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {vibe.description}
          </p>
        </div>

        {/* Big Dominant Vibe Pill */}
        <div className="flex items-center sm:self-start md:self-auto">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${vibe.badgeClass} shadow-lg backdrop-blur-md`}
          >
            <div className="p-2 rounded-xl bg-surface-950/60">
              <VibeIcon className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold opacity-75 block">
                Overall Vibe
              </span>
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                {vibe.title}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
