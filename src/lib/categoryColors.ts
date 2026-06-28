export const categoryLogoColors: Record<string, string> = {
  'AI Agents': 'bg-purple-100 text-purple-700',
  'AI Coding': 'bg-blue-100 text-blue-700',
  'AI Search': 'bg-emerald-100 text-emerald-700',
  'AI Video': 'bg-pink-100 text-pink-700',
  'AI Voice': 'bg-orange-100 text-orange-700',
  'AI Infrastructure': 'bg-slate-100 text-slate-700',
  'Healthcare AI': 'bg-red-100 text-red-700',
  'Robotics': 'bg-yellow-100 text-yellow-700',
};

export const categoryTagColors: Record<string, string> = {
  'AI Agents': 'bg-purple-100 text-purple-700 border-purple-200',
  'AI Coding': 'bg-blue-100 text-blue-700 border-blue-200',
  'AI Search': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'AI Video': 'bg-pink-100 text-pink-700 border-pink-200',
  'AI Voice': 'bg-orange-100 text-orange-700 border-orange-200',
  'AI Infrastructure': 'bg-slate-100 text-slate-700 border-slate-200',
  'Healthcare AI': 'bg-red-100 text-red-700 border-red-200',
  'Robotics': 'bg-amber-100 text-amber-700 border-amber-200',
};

export const categoryIconColors: Record<string, string> = {
  'AI Agents': 'bg-purple-50 text-purple-600',
  'AI Coding': 'bg-blue-50 text-blue-600',
  'AI Search': 'bg-emerald-50 text-emerald-600',
  'AI Video': 'bg-pink-50 text-pink-600',
  'AI Voice': 'bg-orange-50 text-orange-600',
  'AI Infrastructure': 'bg-slate-50 text-slate-600',
  'Healthcare AI': 'bg-red-50 text-red-600',
  'Robotics': 'bg-amber-50 text-amber-600',
};

export function getCategoryLogoColor(category: string): string {
  return categoryLogoColors[category] ?? 'bg-slate-100 text-slate-700';
}

export function getCategoryTagColor(category: string): string {
  return categoryTagColors[category] ?? 'bg-slate-100 text-slate-700 border-slate-200';
}

export function getCategoryIconColor(category: string): string {
  return categoryIconColors[category] ?? 'bg-slate-50 text-slate-600';
}
