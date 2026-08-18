import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { SubredditStats, SentimentLabel } from '../types/reddit';
import { BarChart3 } from 'lucide-react';

interface SentimentScoreChartProps {
  stats: SubredditStats;
}

const CATEGORY_COLORS: Record<SentimentLabel, string> = {
  positive: '#10B981',
  neutral: '#64748B',
  negative: '#EF4444',
};

interface TooltipPayloadItem {
  value: number;
  payload: {
    name: string;
    count: number;
    category: SentimentLabel;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const CustomBarTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-950/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold text-slate-300 mb-1">{data.name}</p>
        <p className="text-sm font-bold text-white">
          {data.count} {data.count === 1 ? 'post' : 'posts'}
        </p>
      </div>
    );
  }
  return null;
};

export const SentimentScoreChart: React.FC<SentimentScoreChartProps> = ({
  stats,
}) => {
  const data = stats.scoreBuckets.map((bucket) => ({
    name: bucket.name.split(' (')[0], // Shorter name for X-axis
    fullName: bucket.name,
    count: bucket.count,
    category: bucket.category,
  }));

  return (
    <div className="rounded-3xl p-6 bg-surface-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-reddit-orange" />
            Sentiment Intensity Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Distribution of titles from strong negative to strong positive
          </p>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomBarTooltip />} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={800}>
              {data.map((entry, index) => (
                <Cell
                  key={`bar-cell-${index}`}
                  fill={CATEGORY_COLORS[entry.category]}
                  fillOpacity={0.85}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
