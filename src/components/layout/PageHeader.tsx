import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  label: string;
  icon?: LucideIcon;
  title: React.ReactNode;
  description?: string;
  centered?: boolean;
  className?: string;
}

export default function PageHeader({
  label,
  icon: Icon,
  title,
  description,
  centered = true,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-10 max-w-3xl', centered && 'mx-auto text-center', className)}>
      <p className={cn('section-label mb-3', centered && 'justify-center')}>
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </p>
      <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
        {title}
      </h1>
      {description && (
        <p className="text-base text-slate-500 mt-4 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
