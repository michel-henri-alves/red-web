export default function ProgressBar({ value = 0, max = 100 }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
      <div
        className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}