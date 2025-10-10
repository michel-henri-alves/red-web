import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useDebounce from "../../shared/hooks/useDebounce";
import { fetchAllCustomersPaginatedAndFilteredByName } from "../../shared/hooks/useCustomers"
import FilterBar from "../../components/FilterBar";

export default function CustomerList(
    { renderCreateButton, renderExpandedDiv }

) {
    const { t } = useTranslation();

    const [filter, setFilter] = useState("");
    const debouncedFilter = useDebounce(filter, 500);
    const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage }
        = fetchAllCustomersPaginatedAndFilteredByName(debouncedFilter, 10);
    const allCustomers = data?.pages.flatMap((page) => page.data) ?? [];
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
            <FilterBar filter={filter} onFilterChange={setFilter} tooltipParam={t("customer.name")} />
            {allCustomers.map((customer) => {
                console.log(customer)
                const isExpanded = expandedCustomer === customer._id;
                return (
                    <div
                        key={customer._id}
                        className="bg-white rounded shadow border hover:shadow-lg transition"
                    >
                        <button
                            onClick={() => toggleExpand(customer._id)}
                            className="w-full text-left p-4 flex justify-between items-center cursor-pointer
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:shadow-lg focus:shadow-blue-500/50
                            hover:outline-none hover:ring-2 hover:ring-blue-500 
                            hover:shadow-lg hover:shadow-blue-500/50"
                        >
                            <span className="font-semibold">{customer.nickname ? customer.nickname : customer.name}</span>
                            <span>
                                {isExpanded ? "▲" : "▼"}
                            </span>
                        </button>
                        {renderExpandedDiv && renderExpandedDiv(customer, isExpanded)}
                    </div>
                );
            })}

            <div ref={loaderRef} className="h-10" />
            {isFetchingNextPage && <p className="text-center">{t("loading.waiting")}</p>}

            {renderCreateButton}


        </div>
    );
}