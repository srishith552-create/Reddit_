import React from 'react';
import { Activity, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="relative pt-6 pb-4 border-b border-slate-800/80 bg-surface-950/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5 text-center sm:text-left">
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-reddit-orange to-amber-500 shadow-lg shadow-reddit-orange/20 ring-1 ring-white/20">
              <Activity className="w-6 h-6 text-white stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  The Subreddit <span className="bg-gradient-to-r from-reddit-orange via-amber-400 to-emerald-400 bg-clip-text text-transparent">Vibe Check</span>
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-reddit-orange/10 text-reddit-orange border border-reddit-orange/20">
                  <Sparkles className="w-3 h-3" /> Live Mood Analyzer
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-normal mt-0.5">
                Instant client-side sentiment analysis and deep community vibe insights
              </p>
            </div>
          </div>

          {/* Quick Info Pill */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Client-side Sentiment Engine</span>
          </div>

        </div>
      </div>
    </header>
  );
};
