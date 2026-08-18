import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { SubredditStats } from '../types/reddit';
import { PieChart as PieChartIcon } from 'lucide-react';

interface SentimentChartProps {
  stats: SubredditStats;
}

const COLORS = {
  positive: '#10B981', // Emerald
  neutral: '#64748B',  // Slate
  negative: '#EF4444', // Red
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { name: string; value: number; count: number; color: string };
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-surface-950/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold text-slate-300 mb-1">{data.name}</p>
        <p className="text-sm font-bold text-white">
          {data.count} posts ({data.value}%)
        </p>
      </div>
    );
  }
  return null;
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ stats }) => {
  const data = [
    {
      name: 'Positive',
      value: stats.positivePct,
      count: stats.positiveCount,
      color: COLORS.positive,
    },
    {
      name: 'Neutral',
      value: stats.neutralPct,
      count: stats.neutralCount,
      color: COLORS.neutral,
    },
    {
      name: 'Negative',
      value: stats.negativePct,
      count: stats.negativeCount,
      color: COLORS.negative,
    },
  ];

  return (
    <div className="rounded-3xl p-6 bg-surface-900/80 border border-slate-800/80 shadow-xl backdrop-blur-md flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-reddit-orange" />
            Sentiment Distribution
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Share of positive, neutral, and negative posts
          </p>
        </div>
      </div>

      <div className="w-full h-64 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="#0F172A"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-xs font-medium text-slate-300">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
          <span className="text-2xl font-black text-white">{stats.total}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Posts
          </span>
        </div>
      </div>
    </div>
  );
};
