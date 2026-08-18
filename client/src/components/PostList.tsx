import React from 'react';
import { AnalyzedPost, SentimentFilter } from '../types/reddit';
import { PostCard } from './PostCard';
import { Layers, SearchX } from 'lucide-react';

interface PostListProps {
  posts: AnalyzedPost[];
  filter: SentimentFilter;
  onClearFilter: () => void;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  filter,
  onClearFilter,
}) => {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-surface-900/60 border border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-800/80 text-slate-400 mb-3">
          <SearchX className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-white">
          No posts match the "{filter}" filter
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Try resetting the sentiment filter or selecting another subreddit to view posts.
        </p>
        <button
          type="button"
          onClick={onClearFilter}
          className="mt-4 px-4 py-2 text-xs font-semibold text-reddit-orange bg-reddit-orange/10 hover:bg-reddit-orange/20 border border-reddit-orange/30 rounded-xl transition-colors cursor-pointer"
        >
          Reset to All Posts
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        <Layers className="w-4 h-4 text-reddit-orange" />
        <span>Analyzed Community Posts</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};
