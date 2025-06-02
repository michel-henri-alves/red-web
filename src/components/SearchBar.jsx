import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    // alert(value+"1111")
    setQuery(value);
    onSearch(value); // envia o texto para o componente pai
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Filtrar..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
}