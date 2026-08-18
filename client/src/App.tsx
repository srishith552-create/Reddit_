import React from 'react';
import { Header } from './components/Header';
import { SubredditSearch } from './components/SubredditSearch';
import { SubredditOverview } from './components/SubredditOverview';
import { StatsCards } from './components/StatsCards';
import { SentimentChart } from './components/SentimentChart';
import { SentimentScoreChart } from './components/SentimentScoreChart';
import { PostControls } from './components/PostControls';
import { PostList } from './components/PostList';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { EmptyState } from './components/EmptyState';
import { useSubreddit } from './hooks/useSubreddit';

export const App: React.FC = () => {
  const {
    currentSubreddit,
    posts,
    rawPostsCount,
    stats,
    loading,
    error,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    isMockData,
    analyzeSubreddit,
    retry,
  } = useSubreddit();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col justify-between selection:bg-reddit-orange selection:text-white">
      
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-grow">
        
        {/* Search & Suggestions Section */}
        <section className="space-y-4">
          <SubredditSearch
            onSearch={analyzeSubreddit}
            loading={loading}
            currentSubreddit={currentSubreddit}
          />
        </section>

        {/* Dynamic Content Views */}
        {loading ? (
          <LoadingState subreddit={currentSubreddit} />
        ) : error ? (
          <ErrorState
            error={error}
            onRetry={retry}
            subreddit={currentSubreddit}
          />
        ) : rawPostsCount > 0 ? (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Community Vibe Overview Banner */}
            <SubredditOverview
              subreddit={currentSubreddit}
              stats={stats}
              isMockData={isMockData}
            />

            {/* 2. KPI Stats Cards */}
            <StatsCards stats={stats} />

            {/* 3. Recharts Visualizations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SentimentChart stats={stats} />
              <SentimentScoreChart stats={stats} />
            </div>

            {/* 4. Post Controls (Filter & Sort) */}
            <PostControls
              filter={filter}
              setFilter={setFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              stats={stats}
              totalFiltered={posts.length}
            />

            {/* 5. Analyzed Posts Grid */}
            <PostList
              posts={posts}
              filter={filter}
              onClearFilter={() => setFilter('all')}
            />
          </div>
        ) : (
          <EmptyState onSelectSubreddit={analyzeSubreddit} />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-surface-950/60 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            The Subreddit Vibe Check &bull; Full Stack Developer Internship Project
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side AFINN Lexicon</span>
            <span>&bull;</span>
            <span>Official Reddit OAuth2 Backend</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
