import { TrendingUp } from 'lucide-react';

interface TrendingBadgeProps {
  rank: number;
}

export default function TrendingBadge({ rank }: TrendingBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-indigo-500/25">
      <TrendingUp className="w-3 h-3" />
      <span>#{rank}</span>
    </div>
  );
}
