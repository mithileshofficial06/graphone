import { cn } from '@/lib/utils';

interface CategoryTagProps {
  category: string;
}

const colorMap: Record<string, string> = {
  'AI Agents': 'bg-violet-500/10 text-violet-300 border-violet-500/20',
  'AI Coding': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  'AI Search': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  'AI Video': 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  'AI Voice': 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  'AI Infrastructure': 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20',
  'Healthcare AI': 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  'Robotics': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
};

export default function CategoryTag({ category }: CategoryTagProps) {
  const colorClass = colorMap[category] || 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20';

  return (
    <span className={cn('px-2 py-0.5 text-xs rounded-md border', colorClass)}>
      {category}
    </span>
  );
}
