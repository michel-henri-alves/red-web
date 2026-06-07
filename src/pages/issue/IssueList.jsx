import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDebounce from "../../shared/hooks/useDebounce";
import { fetchAllIssuesPaginated } from "../../shared/hooks/useIssues";
import FilterBar from "../../components/FilterBar";
import ExpandableTable from "../../components/ExpandableTable";

export default function IssueList({ renderCreateButton, renderExpandedDiv }) {
  const { t } = useTranslation();

  const [filter, setFilter] = useState("");
  const debouncedFilter = useDebounce(filter, 500);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = fetchAllIssuesPaginated(debouncedFilter, 10);

  const allIssues = data?.pages.flatMap((page) => page.data) ?? [];
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

  const setRowTitle = (issue) => {
    const internalId = issue.internalId || t("issue.noInternalId");
    const workflow = issue.workflow || t("undefined.info");
    return `${internalId} - ${workflow}`;
  };

  if (isLoading) return <p>{t("loading.waiting")}</p>;
  if (error) return <p>{t("loading.error")}</p>;

  return (
    <div className="text-2xl space-y-4">
      <FilterBar
        filter={filter}
        onFilterChange={setFilter}
        tooltipParam={`${t("issue.internalId")} / ${t("issue.workflow")}`}
      />

      {allIssues.length === 0 ? (
        <div className="py-6 px-4 text-center text-gray-500">{t("issues.empty")}</div>
      ) : (
        allIssues.map((issue) => (
          <ExpandableTable
            key={issue._id}
            title={setRowTitle(issue)}
            item={issue}
            expandedDiv={renderExpandedDiv}
          />
        ))
      )}

      <div ref={loaderRef} className="h-10" />
      {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

      {renderCreateButton}
    </div>
  );
}
