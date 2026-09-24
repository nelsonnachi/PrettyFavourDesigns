import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  cancelCustomerOrder,
  updateAdminOrderStatus,
} from "./order-api";

import { orderKeys } from "./order-keys";

import type {
  UpdateOrderStatusInput,
} from "./order-types";

// ============================================================
// CANCEL CUSTOMER ORDER
// ============================================================

export function useCancelCustomerOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) =>
      cancelCustomerOrder(orderId),

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
      queryClient.invalidateQueries({
        queryKey: orderKeys.admin.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.admin.detail(
          variables.orderId,
        ),
      });
    },
  });
}