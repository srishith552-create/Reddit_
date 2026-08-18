import React from 'react';
import { AnalyzedPost, SentimentLabel } from '../types/reddit';
import {
  ArrowUp,
  MessageSquare,
  ExternalLink,
  Smile,
  Meh,
  Frown,
  Clock,
  User,
} from 'lucide-react';
import { formatNumber, formatRelativeTime } from '../utils/stats';

interface PostCardProps {
  post: AnalyzedPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const getBadgeConfig = (label: SentimentLabel, score: number) => {
    switch (label) {
      case 'positive':
        return {
          icon: Smile,
          text: 'Positive',
          classes:
            'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 group-hover:border-emerald-500/50',
          scoreText: score > 0 ? `+${score}` : `${score}`,
        };
      case 'negative':
        return {
          icon: Frown,
          text: 'Negative',
          classes:
            'bg-rose-500/10 text-rose-400 border-rose-500/30 group-hover:border-rose-500/50',
          scoreText: `${score}`,
        };
      case 'neutral':
      default:
        return {
          icon: Meh,
          text: 'Neutral',
          classes:
            'bg-slate-500/10 text-slate-300 border-slate-500/30 group-hover:border-slate-500/50',
          scoreText: `${score}`,
        };
    }
  };

  const badge = getBadgeConfig(post.sentiment.label, post.sentiment.score);
  const BadgeIcon = badge.icon;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-surface-900/80 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 shadow-md hover:shadow-xl transition-all duration-200"
    >
      {/* Top row: Sentiment Badge & Score */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badge.classes} transition-colors`}
        >
          <BadgeIcon className="w-3.5 h-3.5" />
          <span>{badge.text}</span>
          <span className="opacity-70 font-mono text-[11px]">
            ({badge.scoreText})
          </span>
        </div>

        <div className="flex items-center text-xs text-slate-400 group-hover:text-reddit-orange transition-colors gap-1">
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Main title & optional thumbnail */}
      <div className="flex items-start gap-3.5 my-2">
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt=""
            loading="lazy"
            className="w-14 h-14 object-cover rounded-xl border border-slate-800 flex-shrink-0 bg-slate-800"
            onError={(e) => {
              // Hide image if broken
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <h4 className="text-sm sm:text-base font-semibold text-slate-100 group-hover:text-white leading-snug line-clamp-3">
          {post.title}
        </h4>
      </div>

      {/* Sentiment Keywords Tags (if detected) */}
      {(post.sentiment.positiveWords.length > 0 ||
        post.sentiment.negativeWords.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5 my-2.5 pt-2 border-t border-slate-800/50">
          {post.sentiment.positiveWords.map((w, idx) => (
            <span
              key={`pos-${idx}`}
              className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-mono"
            >
              +{w}
            </span>
          ))}
          {post.sentiment.negativeWords.map((w, idx) => (
            <span
              key={`neg-${idx}`}
              className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 font-mono"
            >
              -{w}
            </span>
          ))}
        </div>
      )}

      {/* Footer Metadata: Upvotes, Comments, Author, Time */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        
        {/* Upvotes & Comments */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <ArrowUp className="w-3.5 h-3.5 text-reddit-orange stroke-[2.5]" />
            {formatNumber(post.score)}
          </span>
          <span className="flex items-center gap-1 font-semibold text-slate-300">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            {formatNumber(post.numComments)}
          </span>
        </div>

        {/* Author & Relative Time */}
        <div className="flex items-center gap-2.5 text-[11px] text-slate-500">
          <span className="flex items-center gap-1 truncate max-w-[120px]">
            <User className="w-3 h-3 text-slate-400" />
            u/{post.author}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {formatRelativeTime(post.createdUtc)}
          </span>
        </div>

      </div>
    </a>
  );
};
