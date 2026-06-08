import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDebounce from "../../shared/hooks/useDebounce";
import { fetchAllIssuesPaginated } from "../../shared/hooks/useIssues";
import FilterBar from "../../components/FilterBar";
import ExpandableTable from "../../components/ExpandableTable";

const RISK_FILTER_OPTIONS = ["", "INFO", "WARN", "ERROR"];

export default function IssueList({ renderCreateButton, renderExpandedDiv }) {
  const { t } = useTranslation();

  const [workflowFilter, setWorkflowFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const debouncedWorkflowFilter = useDebounce(workflowFilter, 500);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = fetchAllIssuesPaginated(
    {
      workflow: debouncedWorkflowFilter,
      risk: riskFilter
    },
    10
  );

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
    //const internalId = issue.internalId || t("issue.noInternalId");
    const workflow = issue.workflow || t("undefined.info");
    return `${workflow}`;
  };

  if (isLoading) return <p>{t("loading.waiting")}</p>;
  if (error) return <p>{t("loading.error")}</p>;

  return (
    <div className="text-2xl space-y-4">
      <FilterBar
        filter={workflowFilter}
        onFilterChange={setWorkflowFilter}
        tooltipParam={`${t("issue.workflow")}`}
      />

      <label className="block text-base font-medium text-gray-700" htmlFor="issue-risk-filter">
        {t("issue.risk")}
      </label>
      <select
        id="issue-risk-filter"
        value={riskFilter}
        onChange={(event) => setRiskFilter(event.target.value)}
        className="px-3 py-2 w-full bg-[rgba(209,209,233)] focus:bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg focus:shadow-blue-500/50 focus:border-blue-500 shadow-md hover:shadow-lg transition duration-300"
      >
        {RISK_FILTER_OPTIONS.map((risk) => (
          <option key={risk || "all"} value={risk}>
            {risk ? t(risk) : t("all")}
          </option>
        ))}
      </select>

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

      {/* {renderCreateButton} */}
    </div>
  );
}
