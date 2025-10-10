import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDebounce from "../../../shared/hooks/useDebounce";
import { fetchAllPendingsPaginatedByCustomerId } from "../../../shared/hooks/usePendings";
import FilterBar from "../../../components/FilterBar";
import MainCard from "../../../components/MainCard";

import FormattedDate from '../../../shared/utils/dateUtils';


export default function BookletList(
    { id, customer, renderCreateButton }

) {
    const { t } = useTranslation();
    const [filter, setFilter] = useState(id);
    const debouncedFilter = useDebounce(filter, 500);
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage }
        = fetchAllPendingsPaginatedByCustomerId(debouncedFilter, 10);
    var balance = data?.pages[0].balance
    const allRegisters = data?.pages.flatMap((page) => page.data) ?? [];
    const [expandedCustomer, setExpandedCustomer] = useState(null);
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

    const toggleExpand = (code) => setExpandedCustomer(expandedCustomer === code ? null : code);

    if (isLoading) return <p>{t("loading.waiting")}</p>;
    if (error) return <p>{t("loading.error")}</p>;

    return (
        <div className="space-y-4">
            <MainCard value={balance} />

            {/* <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("customer.name")} /> */}
            {allRegisters.map((pending) => {
                return (
                    <div
                        key={pending._id}
                        className="bg-white rounded shadow border hover:shadow-lg transition"
                    >
                        <button
                            onClick={() => toggleExpand(pending._id)}
                            className="w-full text-left p-4 flex justify-between items-center cursor-pointer
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:shadow-lg focus:shadow-blue-500/50
                            hover:outline-none hover:ring-2 hover:ring-blue-500 
                            hover:shadow-lg hover:shadow-blue-500/50"
                        >
                            <span className="flex items-center gap-3">
                                <p>{t(pending.pendingType)}</p> <p>{t("currency")}{pending.value}</p> <p><FormattedDate iso={pending.createdAt} /></p>
                            </span>
                            <span>
                                {pending.pendingType === "DEBIT" ? "🔴" : "🟢"}
                            </span>
                        </button>
                    </div>
                );
            })}

            <div ref={loaderRef} className="h-10" />
            {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

            {renderCreateButton}

        </div>
    );
}