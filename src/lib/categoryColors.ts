export const categoryLogoColors: Record<string, string> = {
  'AI Agents': 'bg-purple-100 text-purple-700',
  'AI Coding': 'bg-blue-100 text-blue-700',
  'AI Search': 'bg-green-100 text-green-700',
  'AI Video': 'bg-pink-100 text-pink-700',
  'AI Voice': 'bg-orange-100 text-orange-700',
  'AI Infrastructure': 'bg-gray-100 text-gray-700',
  'Healthcare AI': 'bg-red-100 text-red-700',
  'Robotics': 'bg-yellow-100 text-yellow-700',
};

export const categoryTagColors: Record<string, string> = {
  'AI Agents': 'bg-purple-100 text-purple-700',
  'AI Coding': 'bg-blue-100 text-blue-700',
  'AI Search': 'bg-green-100 text-green-700',
  'AI Video': 'bg-pink-100 text-pink-700',
  'AI Voice': 'bg-orange-100 text-orange-700',
  'AI Infrastructure': 'bg-gray-100 text-gray-700',
  'Healthcare AI': 'bg-red-100 text-red-700',
  'Robotics': 'bg-yellow-100 text-yellow-700',
};

export const categoryIconColors: Record<string, string> = {
  'AI Agents': 'bg-purple-100 text-purple-600',
  'AI Coding': 'bg-blue-100 text-blue-600',
  'AI Search': 'bg-green-100 text-green-600',
  'AI Video': 'bg-pink-100 text-pink-600',
  'AI Voice': 'bg-orange-100 text-orange-600',
  'AI Infrastructure': 'bg-gray-100 text-gray-600',
  'Healthcare AI': 'bg-red-100 text-red-600',
  'Robotics': 'bg-yellow-100 text-yellow-600',
};

export function getCategoryLogoColor(category: string): string {
  return categoryLogoColors[category] ?? 'bg-gray-100 text-gray-700';
}

export function getCategoryTagColor(category: string): string {
  return categoryTagColors[category] ?? 'bg-gray-100 text-gray-700';
}

export function getCategoryIconColor(category: string): string {
  return categoryIconColors[category] ?? 'bg-gray-100 text-gray-600';
}
