"use client";

import { useMemo, useState } from "react";


import { PaymentsHeader } from "./payments-header";
import { PaymentsStats } from "./payments-stats";
import { PaymentsFilters } from "./payments-filters";
import { AdminPaymentFilters, AdminPaymentMethod, AdminPaymentSort, AdminPaymentStatus } from "@/lib/query/payments/payment-types";
import { useAdminPayments } from "@/lib/query/payments/payment-queries";
import { PaymentsTable } from "./payments-table";
import { PaymentsPagination } from "./payments-pagination";


export function PaymentsPage() {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [status, setStatus] =
    useState<AdminPaymentStatus | "all">("all");

  const [paymentMethod, setPaymentMethod] =
    useState<AdminPaymentMethod | "all">("all");

  const [sort, setSort] =
    useState<AdminPaymentSort>("newest");

  const filters = useMemo<AdminPaymentFilters>(() => {
    return {
      page,
      limit: 10,
      ...(search.trim()
        ? { search: search.trim() }
        : {}),
      ...(status !== "all"
        ? { status }
        : {}),
      ...(paymentMethod !== "all"
        ? { paymentMethod }
        : {}),
      sort,
    };
  }, [
    page,
    search,
    status,
    paymentMethod,
    sort,
  ]);

  const paymentsQuery =
    useAdminPayments(filters);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusChange(
    value: AdminPaymentStatus | "all",
  ) {
    setStatus(value);
    setPage(1);
  }

  function handlePaymentMethodChange(
    value: AdminPaymentMethod | "all",
  ) {
    setPaymentMethod(value);
    setPage(1);
  }

  function handleSortChange(
    value: AdminPaymentSort,
  ) {
    setSort(value);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PaymentsHeader />

      <PaymentsStats
        payments={
          paymentsQuery.data?.data ?? []
        }
      />

      <PaymentsFilters
        search={search}
        status={status}
        paymentMethod={paymentMethod}
        sort={sort}
        onSearchChange={handleSearch}
        onStatusChange={
          handleStatusChange
        }
        onPaymentMethodChange={
          handlePaymentMethodChange
        }
        onSortChange={handleSortChange}
      />

      <PaymentsTable
        payments={
          paymentsQuery.data?.data ?? []
        }
        isLoading={paymentsQuery.isLoading}
        isFetching={
          paymentsQuery.isFetching
        }
        isError={paymentsQuery.isError}
      />

      {paymentsQuery.data?.pagination && (
        <PaymentsPagination
          pagination={
            paymentsQuery.data.pagination
          }
          onPageChange={setPage}
        />
      )}
    </div>
  );
}