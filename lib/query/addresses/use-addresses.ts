"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createAddress,
  deleteAddress,
  getAddress,
  getAddresses,
  updateAddress,
} from "./address-api";

import { addressKeys } from "./address-keys";

import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "./address-types";

// ============================================================
// GET ALL ADDRESSES
// ============================================================

export function useAddresses() {
  return useQuery({
    queryKey: addressKeys.list(),

    queryFn: getAddresses,
  });
}

// ============================================================
// GET SINGLE ADDRESS
// ============================================================

export function useAddress(
  id: string,
) {
  return useQuery({
    queryKey: addressKeys.detail(id),

    queryFn: () => getAddress(id),

    enabled: Boolean(id),
  });
}

// ============================================================
// CREATE ADDRESS
// ============================================================

export function useCreateAddress() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      data: CreateAddressInput,
    ) => createAddress(data),

    onSuccess: () => {
      // Refresh address list
      queryClient.invalidateQueries({
        queryKey: addressKeys.list(),
      });
    },
  });
}

// ============================================================
// UPDATE ADDRESS
// ============================================================

export function useUpdateAddress() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;

      data: UpdateAddressInput;
    }) =>
      updateAddress(id, data),

    onSuccess: (updatedAddress) => {
      // Refresh address list
      queryClient.invalidateQueries({
        queryKey: addressKeys.list(),
      });

      // Update the individual address cache
      queryClient.setQueryData(
        addressKeys.detail(
          updatedAddress.id,
        ),
        updatedAddress,
      );
    },
  });
}

// ============================================================
// DELETE ADDRESS
// ============================================================

export function useDeleteAddress() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      id: string,
    ) => deleteAddress(id),

    onSuccess: (_, deletedId) => {
      // Refresh address list
      queryClient.invalidateQueries({
        queryKey: addressKeys.list(),
      });

      // Remove deleted address
      // from the individual cache
      queryClient.removeQueries({
        queryKey:
          addressKeys.detail(
            deletedId,
          ),
      });
    },
  });
}