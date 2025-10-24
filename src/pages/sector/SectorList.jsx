import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDebounce from "../../shared/hooks/useDebounce";
import { fetchAllSectorsPaginated } from "../../shared/hooks/useSectors";
import FilterBar from "../../components/FilterBar";
import ExpandableTable from "../../components/ExpandableTable";

export default function SectorList(
  { renderCreateButton, renderExpandedDiv }
) {
  const { t } = useTranslation();

  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 500);

  const { data, isLoading, error, fetchNextPage,
    hasNextPage, isFetchingNextPage } =
    fetchAllSectorsPaginated(debouncedFilter, 10);
  const allSectors = data?.pages.flatMap((page) => page.data) ?? [];
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

  if (isLoading) return <p>{t("loading.waiting")}</p>;
  if (error) return <p>{t("loading.error")}</p>;

  return (
    <div className="text-2xl space-y-4">
      <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("sector.name")} />

      {allSectors.length === 0 ? (
        <tr>
          <td colSpan={4} className="py-6 px-4 text-center text-gray-500">{t("sectors.empty")}</td>
        </tr>
      ) : (
        allSectors.map((sector) => {
          return (
            <ExpandableTable
              key={sector._id}
              title={sector.name}
              item={sector}
              expandedDiv={renderExpandedDiv} />
          );
        }))
      }

      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

      {renderCreateButton}

    </div>
  );
}
