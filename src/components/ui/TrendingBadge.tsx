interface TrendingBadgeProps {
  rank: number;
}

export default function TrendingBadge({ rank }: TrendingBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-xs font-medium px-2 py-0.5 rounded-full">
      🔥 Trending #{rank}
    </span>
  );
}
