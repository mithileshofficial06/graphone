export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">Loading...</p>
    </div>
  );
}
