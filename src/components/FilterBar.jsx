import React, { useRef, useEffect } from 'react';

export default function FilterBar({ filter, onFilterChange }) {

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="mb-4">
      <input
        ref={inputRef}
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
    </div>
  );
}
