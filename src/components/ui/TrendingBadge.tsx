import { Flame } from 'lucide-react';

interface TrendingBadgeProps {
  rank: number;
}

export default function TrendingBadge({ rank }: TrendingBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold rounded-full">
      <Flame className="w-4 h-4" />
      <span>Trending #{rank}</span>
    </div>
  );
}
