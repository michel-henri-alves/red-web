import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "red-shared";
import {
  searchProductsRegexBySmartCodeOrName,
} from "red-shared";

import FilterBar from "./FilterBar";

export default function ProductSearch() {
  const { t } = useTranslation();
  const domain = t("product");

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const debouncedFilter = useDebounce(filter, 500);
  const [expandedProduct, setExpandedProduct] = useState(null);

  const { data, isLoading, error } = searchProductsRegexBySmartCodeOrName(debouncedFilter, page, limit);

  const toggleExpand = (code) => {
    setExpandedProduct(expandedProduct === code ? null : code);
  };


  if (isLoading) return <p>{t("loading.waiting")}</p>;
  if (error) return <p>{t("loading.error")}</p>;

  return (
    <div className="space-y-4">
      <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("product.name")} />

      {data?.map((product) => {
        const isExpanded = expandedProduct === product._id;
        return (
          <div
            key={product._id}
            className="bg-white rounded shadow border hover:shadow-lg transition"
          >
            <button
              onClick={() => toggleExpand(product._id)}
              className="w-full text-left p-4 flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold">{product.name}</span>
            </button>

          </div>
        );
      })}

    </div>
  );
}
