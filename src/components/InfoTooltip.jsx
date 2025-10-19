export default function InfoTooltip({ text }) {
  return (
    <span className="ml-2 relative group cursor-pointer">
      ℹ️
      <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        {text}
      </span>
    </span>
  );
}
