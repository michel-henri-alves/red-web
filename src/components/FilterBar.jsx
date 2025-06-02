import React from 'react';

export default function FilterBar({ filter, onFilterChange }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      />
    </div>
  );
}
