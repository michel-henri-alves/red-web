import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDebounce from "../../shared/hooks/useDebounce";
import { fetchAllCustomersPaginated } from "../../shared/hooks/useCustomers"

import FilterBar from "../../components/FilterBar";
import ExpandableTable from "../../components/ExpandableTable";


export default function CustomerList(
    { renderCreateButton, renderExpandedDiv }

) {
    const { t } = useTranslation();

    const [filter, setFilter] = useState("");
    const debouncedFilter = useDebounce(filter, 500);
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage }
        = fetchAllCustomersPaginated(debouncedFilter, 10);
    const allCustomers = data?.pages.flatMap((page) => page.data) ?? [];
    const [expandedCustomer, setExpandedCustomer] = useState(null);
    const loaderRef = useRef(null);

    const setRowTitle = (customer) => {
        const nickname = `"${customer.nickname}"`
        return customer.name + (customer.nickname ? " " + nickname : "");
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
            <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("customer.name")} />
            {allCustomers.length === 0 ? (
                <tr>
                    <td colSpan={4} className="py-6 px-4 text-center text-gray-500">{t("customers.empty")}</td>
                </tr>
            ) : (
                allCustomers.map((customer) => {
                    return (
                        <ExpandableTable
                            key={customer._id}
                            title={setRowTitle(customer)}
                            item={customer}
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