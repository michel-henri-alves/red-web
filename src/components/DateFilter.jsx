import { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";

import ActionButton from "./ActionButton";

import "react-datepicker/dist/react-datepicker.css";


export default function DateFilter({ onFilter }) {
  const { t } = useTranslation();

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
        placeholderText={t("initial.date")}
        className="px-3 py-2 w-full 
                   bg-[rgba(209,209,233)]	focus:bg-white rounded
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:shadow-lg focus:shadow-blue-500/50
                   focus:border-blue-500 px-4 py-2
                   shadow-md hover:shadow-lg transition-shadow
                   transition duration-300"
      />

      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText={t("end.date")}
        className="px-3 py-2 w-full 
                   bg-[rgba(209,209,233)]	focus:bg-white rounded
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:shadow-lg focus:shadow-blue-500/50
                   focus:border-blue-500 px-4 py-2
                   shadow-md hover:shadow-lg transition-shadow
                   transition duration-300"
      />

      <ActionButton
        type="submit"
        onClick={handleFilter}
        bgColor="blue"
        text={t("button.search")}
        icon={"🔍︎"}
      />
    </div>
  );
}
