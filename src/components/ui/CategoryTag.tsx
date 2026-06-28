import { cn } from '@/lib/utils';

interface CategoryTagProps {
  category: string;
  className?: string;
}

const categoryStyles: Record<string, string> = {
  'AI Agents': 'bg-purple-100 text-purple-700 border-purple-200',
  'AI Coding': 'bg-blue-100 text-blue-700 border-blue-200',
  'AI Search': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'AI Video': 'bg-pink-100 text-pink-700 border-pink-200',
  'AI Voice': 'bg-orange-100 text-orange-700 border-orange-200',
  'AI Infrastructure': 'bg-slate-100 text-slate-700 border-slate-200',
  'Healthcare AI': 'bg-red-100 text-red-700 border-red-200',
  'Robotics': 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function CategoryTag({ category, className }: CategoryTagProps) {
  const style = categoryStyles[category] || 'bg-slate-100 text-slate-700 border-slate-200';
  return (
    <span
      className={cn(
        'inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border',
        style,
        className
      )}
    >
      {category}
    </span>
  );
}
