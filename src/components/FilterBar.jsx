import { useRef, useEffect } from 'react';
import { useTranslation } from "react-i18next";

export default function FilterBar({ filter, onFilterChange, tooltipParam }) {

  const inputRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="mb-4">
      <input
        ref={inputRef}
        type="text"
        placeholder={t('tooltip.filter', { param: tooltipParam })}
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-3 py-2 w-full 
                   bg-[rgba(209,209,233)]	focus:bg-white border rounded
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:shadow-lg focus:shadow-blue-500/50
                   focus:border-blue-500 px-4 py-2
                   transition duration-300"
      />
    </div>
  );
}
