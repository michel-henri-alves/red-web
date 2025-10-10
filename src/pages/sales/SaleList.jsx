import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "../../shared/hooks/useDebounce";
import { fetchAllSalesPaginatedAndFilteredByDate } from "../../shared/hooks/useSales";
import DateFilter from "../../components/DateFilter";
import FormattedDate from '../../shared/utils/dateUtils';

export default function SaleList() {
  const { t } = useTranslation();
  const domain = t("sector");

  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 500);
  const [sectorToDelete, setSectorToDelete] = useState(null);
  const [sectorToUpdate, setSectorToUpdate] = useState(null);
  const [expandedSector, setExpandedSector] = useState(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage }
    = fetchAllSalesPaginatedAndFilteredByDate(10, startDate, endDate);
  const allSales = data?.pages.flatMap((page) => page.data) ?? [];

  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });

    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  const toggleExpand = (code) => {
    setExpandedSector(expandedSector === code ? null : code);
  };


  const openDeleteModal = (sector) => {
    setSectorToDelete(sector);
    setDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setDeleteModalOpen(false);

  const openUpdateModal = (sector) => {
    setSectorToUpdate(sector);
    setFormModalOpen(true);
  };
  const openCreationModal = () => {
    setSectorToUpdate({});
    setFormModalOpen(true);
  };
  const closeFormModal = () => setFormModalOpen(false);

  function formatDate(dataIso) {
    const data = new Date(dataIso);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }


  if (isLoading) return <p>{t("loading.waiting")}</p>;
  if (error) return <p>{t("loading.error")}</p>;

  return (
    <div className="space-y-4">
      <DateFilter onFilter={(start, end) => {
        setStartDate(start?.toISOString())
        setEndDate(end?.toISOString())
        // fetch(`/api/sales?page=1&limit=10&startDate=${start?.toISOString()}&endDate=${end?.toISOString()}`)
        //   .then(res => res.json())
        //   .then(data => console.log(data));
      }} />
      {/* <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("sector.name")} /> */}

      {allSales.map((sale) => {
        const isExpanded = expandedSector === sale._id;
        const received = sale.amountPaid.reduce((acc, num) => acc + num, 0) - sale.change;

        return (
          <div
            key={sale._id}
            className="bg-white rounded shadow border hover:shadow-lg transition"
          >
            <button
              onClick={() => toggleExpand(sale._id)}
              className="w-full text-left p-4 flex justify-between items-center cursor-pointer"
            >
              <span className="font-semibold"><FormattedDate iso={sale.realizedAt} /></span>
              <span className="text-red-500 text-2xl">{t("currency")}{received}</span>
              <span>{isExpanded ? "▲" : "▼"}</span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-4 pb-4 text-sm text-gray-700">
                  <p>
                    <strong>vendedor:</strong> {sale.vendor}
                  </p>
                  <p>
                    <strong>cliente:</strong> {sale.client}
                  </p>
                  <p>
                    <strong>métodos de pagamento/valor:</strong>
                    <ul>
                      {sale.paymentMethod.map((item, index) => (
                        <li key={index}>{t(item)} / {t("currency")} {sale.amountPaid[index]}</li>
                      ))}
                    </ul>
                  </p>
                  <p>
                    <strong>troco:</strong> {t("currency")}{sale.change}
                  </p>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

    </div>
  );
}
