interface CategoryTagProps {
  category: string;
}

export default function CategoryTag({ category }: CategoryTagProps) {
  const colorMap: Record<string, string> = {
    'AI Agents': 'bg-purple-50 text-purple-700',
    'AI Coding': 'bg-blue-50 text-blue-700',
    'AI Search': 'bg-green-50 text-green-700',
    'AI Video': 'bg-pink-50 text-pink-700',
    'AI Voice': 'bg-orange-50 text-orange-700',
    'AI Infrastructure': 'bg-gray-50 text-gray-700',
    'Healthcare AI': 'bg-red-50 text-red-700',
    'Robotics': 'bg-yellow-50 text-yellow-700',
  };

  const colorClass = colorMap[category] || 'bg-gray-50 text-gray-700';

  return (
    <span className={`px-2 py-1 text-xs rounded ${colorClass}`}>
      {category}
    </span>
  );
}
