import React, { useRef, useEffect } from 'react';
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
        className="bg-white-800	focus:bg-white border rounded px-3 py-2 w-full"
      />
    </div>
  );
}
