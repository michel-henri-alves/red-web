import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateFilter({ onFilter }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleFilter = () => {
    onFilter(startDate, endDate);
  };

  return (
    <div className="flex gap-4 items-center">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Data inicial"
        className="border px-2 py-1 rounded"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="Data final"
        className="border px-2 py-1 rounded"
      />
      <button
        onClick={handleFilter}
        className="bg-blue-500 text-white px-4 py-1 rounded"
      >
        Filtrar
      </button>
    </div>
  );
}
