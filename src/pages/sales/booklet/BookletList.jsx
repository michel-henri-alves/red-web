import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDebounce from "../../../shared/hooks/useDebounce";
import { fetchAllPendingsPaginatedByCustomerId } from "../../../shared/hooks/usePendings";
import formatDate from "../../../shared/utils/dateUtils";
import MainCard from "../../../components/MainCard";
import DateFilter from "../../../components/DateFilter";
import ExpandableTable from "../../../components/ExpandableTable";


export default function BookletList(
    { id, customer, renderCreateButton, renderExpandedDiv }

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

    const setRowTitle = (pending) => {
        const type = t(pending.pendingType);
        const realizedAt = formatDate(pending.createdAt);
        const icon = pending.pendingType === "DEBIT" ? "🔴" : "🟢";
        return icon + " " + type + " - " + t("currency") + pending.amount + " - " + realizedAt;
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

    const toggleExpand = (code) => setExpandedCustomer(expandedCustomer === code ? null : code);

    if (isLoading) return <p>{t("loading.waiting")}</p>;
    if (error) return <p>{t("loading.error")}</p>;

    return (
        <div className="text-2xl space-y-4">
            <MainCard amount={balance} />

            <DateFilter onFilter={(start, end) => {
                setStartDate(start?.toISOString())
                setEndDate(end?.toISOString())
            }} />

            {allRegisters.map((pending) => {
                return (
                    <ExpandableTable
                        key={pending._id}
                        title={setRowTitle(pending)}
                        item={pending}
                        expandedDiv={renderExpandedDiv}
                    />
                );
            })}

            <div ref={loaderRef} className="h-10" />
            {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

            {renderCreateButton}

        </div>
    );
}