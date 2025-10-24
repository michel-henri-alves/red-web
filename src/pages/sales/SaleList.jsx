import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { fetchAllSalesPaginatedAndFilteredByDate } from "../../shared/hooks/useSales";
import formatDate from "../../shared/utils/dateUtils";
import DateFilter from "../../components/DateFilter";
import ExpandableTable from "../../components/ExpandableTable";


export default function SaleList(
  { renderExpandedDiv }
) {
  const { t } = useTranslation();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage }
    = fetchAllSalesPaginatedAndFilteredByDate(10, startDate, endDate);
  const allSales = data?.pages.flatMap((page) => page.data) ?? [];
  const loaderRef = useRef(null);

  const setRowTitle = (sale) => {
    const received = sale.amountPaid.reduce((acc, num) => acc + num, 0) - sale.change;
    const realizedAt = formatDate(sale.realizedAt);
    return realizedAt + " - " + t("currency") + received
  }

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

  if (isLoading) return <p>{t("loading.waiting")}</p>;
  if (error) return <p>{t("loading.error")}</p>;

  return (
    <div className="text-2xl space-y-4">
      <DateFilter onFilter={(start, end) => {
        setStartDate(start?.toISOString())
        setEndDate(end?.toISOString())
      }} />

      {allSales.length === 0 ? (
        <tr>
          <td colSpan={4} className="py-6 px-4 text-center text-gray-500">{t("sales.empty")}</td>
        </tr>
      ) : (allSales.map((sale) => {
        return (
          <ExpandableTable
            key={sale._id}
            title={setRowTitle(sale)}
            item={sale}
            expandedDiv={renderExpandedDiv}
          />
        );
      }))
      }

      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

    </div>
  );
}
