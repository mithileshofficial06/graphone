import { cn } from '@/lib/utils';
import { getCategoryTagColor } from '@/lib/categoryColors';

interface CategoryTagProps {
  category: string;
  className?: string;
}

export default function CategoryTag({ category, className }: CategoryTagProps) {
  return (
    <span
      className={cn(
        'inline-flex px-2 py-0.5 rounded-full text-xs font-medium',
        getCategoryTagColor(category),
        className
      )}
    >
      {category}
    </span>
  );
}
