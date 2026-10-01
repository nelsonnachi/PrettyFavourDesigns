import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  cancelCustomerOrder,
  updateAdminOrderStatus,
} from "./order-api";

import { orderKeys } from "./order-keys";
import type { UpdateOrderStatusInput } from "./order-types";
import { adminPaymentKeys } from "../payments/payment-keys";

// ============================================================
// CANCEL CUSTOMER ORDER
// ============================================================

export function useCancelCustomerOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => cancelCustomerOrder(orderId),

    onSuccess: (_data, orderId) => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.customer.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.customer.detail(orderId),
      });
    },
  });
}

// ============================================================
// UPDATE ADMIN ORDER STATUS
// ============================================================

export function useUpdateAdminOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: UpdateOrderStatusInput["status"];
    }) =>
      updateAdminOrderStatus(orderId, {
        status,
      }),

    onSuccess: (_data, variables) => {
      // --------------------------------------------------------
      // REFRESH ORDER LIST
      // --------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: orderKeys.admin.lists(),
      });

      // --------------------------------------------------------
      // REFRESH ORDER DETAIL
      // --------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: orderKeys.admin.detail(variables.orderId),
      });

      // --------------------------------------------------------
      // REFRESH ADMIN PAYMENTS
      //
      // Important for COD:
      //
      // When delivered:
      // payment.status changes pending → paid
      //
      // This invalidates:
      // - payment list
      // - payment details
      // - payment sales summary
      // - daily sales
      // --------------------------------------------------------

      queryClient.invalidateQueries({
        queryKey: adminPaymentKeys.all,
      });
    },
  });
}