"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Loader2,
} from "lucide-react";
import { CustomerDetailsHeader } from "./customer-details-header";
import { CustomerProfile } from "./customer-profile";
import { CustomerOverview } from "./customer-overview";
import { CustomerStats } from "./customer-stats";
import { CustomerOrders } from "./customer-orders";
import { CustomerAddresses } from "./customer-addresses";
import { CustomerCart } from "./customer-cart";
import { CustomerWishlist } from "./customer-wishlist";
import { CustomerMessages } from "./customer-messages";
import { CustomerInventory } from "./customer-inventory";
import { CustomerAccountActions } from "./customer-account-actions";
import { adminUserKeys } from "@/lib/query/customer/admin-user-keys";
import { CustomerRatings } from "./customer-rating";
import { getAdminUser } from "@/lib/query/customer/admin-user-api";

type CustomerDetailsPageProps = {
  id: string;
};

export function CustomerDetailsPage({
  id,
}: CustomerDetailsPageProps) {
  const customerQuery = useQuery({
    queryKey: adminUserKeys.detail(id),
    queryFn: () => getAdminUser(id),
    enabled: Boolean(id),
  });

  if (customerQuery.isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading customer...
        </div>
      </div>
    );
  }

  if (
    customerQuery.isError ||
    !customerQuery.data?.data
  ) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

        <h2 className="mt-4 text-lg font-semibold text-red-900">
          Customer not found
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {customerQuery.error instanceof Error
            ? customerQuery.error.message
            : "We couldn't load this customer."}
        </p>

        <button
          type="button"
          onClick={() =>
            customerQuery.refetch()
          }
          className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  const customer =
    customerQuery.data.data;

  return (
    <div className="space-y-6">
      <CustomerDetailsHeader
        customer={customer}
      />

      <CustomerStats
        customer={customer}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <CustomerOverview
            customer={customer}
          />

          <CustomerOrders
            orders={customer.orders}
          />

          <CustomerCart
            cart={customer.cart}
          />

          <CustomerRatings
            ratings={customer.ratings}
          />

          <CustomerWishlist
            wishlistItems={
              customer.wishlistItems
            }
          />

          <CustomerMessages
            messages={
              customer.contactMessages
            }
          />

          <CustomerInventory
            movements={
              customer.inventoryMovements
            }
          />
        </div>

        <div className="space-y-6">
          <CustomerProfile
            customer={customer}
          />

          <CustomerAddresses
            addresses={customer.addresses}
          />

          <CustomerAccountActions
            customer={customer}
          />
        </div>
      </div>
    </div>
  );
}