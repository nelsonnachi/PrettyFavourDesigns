
import { apiClient } from "@/lib/api/client";
import type {
  Address,
  CreateAddressInput,
  UpdateAddressInput,
  GetAddressesResponse,
  GetAddressResponse,
  AddressMutationResponse,
  DeleteAddressResponse,
} from "./address-types";

// ============================================================
// GET ALL ADDRESSES
// ============================================================

export async function getAddresses(): Promise<
  Address[]
> {
  const response =
    await apiClient<GetAddressesResponse>(
      "/api/addresses",
      {
        method: "GET",
      },
    );

  return response.data;
}

// ============================================================
// GET ONE ADDRESS
// ============================================================

export async function getAddress(
  id: string,
): Promise<Address> {
  const response =
    await apiClient<GetAddressResponse>(
      `/api/addresses/${id}`,
      {
        method: "GET",
      },
    );

  return response.data;
}

// ============================================================
// CREATE ADDRESS
// ============================================================

export async function createAddress(
  data: CreateAddressInput,
): Promise<Address> {
  const response =
    await apiClient<AddressMutationResponse>(
      "/api/addresses",
      {
        method: "POST",

        body: JSON.stringify(data),
      },
    );

  return response.data;
}

// ============================================================
// UPDATE ADDRESS
// ============================================================

export async function updateAddress(
  id: string,
  data: UpdateAddressInput,
): Promise<Address> {
  const response =
    await apiClient<AddressMutationResponse>(
      `/api/addresses/${id}`,
      {
        method: "PATCH",

        body: JSON.stringify(data),
      },
    );

  return response.data;
}

// ============================================================
// DELETE ADDRESS
// ============================================================

export async function deleteAddress(
  id: string,
): Promise<DeleteAddressResponse> {
  return apiClient<DeleteAddressResponse>(
    `/api/addresses/${id}`,
    {
      method: "DELETE",
    },
  );
}