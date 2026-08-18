import React from 'react';
import { AlertTriangle, RefreshCw, HelpCircle } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  subreddit?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  subreddit,
}) => {
  return (
    <div className="rounded-3xl p-8 sm:p-12 bg-surface-900/90 border border-rose-500/30 shadow-2xl backdrop-blur-xl animate-fade-in text-center max-w-2xl mx-auto">
      <div className="inline-flex p-4 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4 shadow-lg shadow-rose-500/10">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white tracking-tight">
        {subreddit ? `Could not load r/${subreddit}` : 'Something went wrong'}
      </h3>

      <p className="text-sm text-slate-300 mt-2 leading-relaxed">
        {error}
      </p>

      {/* Helpful tips */}
      <div className="mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-left text-xs text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
          <HelpCircle className="w-4 h-4 text-reddit-orange" />
          Common troubleshooting tips:
        </div>
        <p>• Verify that the subreddit is spelled correctly and not deleted.</p>
        <p>• Check if the subreddit is private, quarantined, or restricted.</p>
        <p>• If rate-limited, wait 30 seconds before retrying.</p>
      </div>

      {/* Retry button */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-reddit-orange to-amber-500 hover:from-reddit-hover hover:to-amber-600 text-white text-sm font-semibold shadow-lg shadow-reddit-orange/20 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
};
