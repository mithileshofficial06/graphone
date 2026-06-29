interface TrendingBadgeProps {
  rank: number;
  variant?: 'light' | 'dark';
}

export default function TrendingBadge({ rank, variant = 'light' }: TrendingBadgeProps) {
  if (variant === 'dark') {
    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
        🔥 #{rank}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 border border-red-200 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
      🔥 Trending #{rank}
    </span>
  );
}
