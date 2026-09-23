// ============================================================
// ADDRESS
// ============================================================

export interface Address {
  id: string;

  userId: string;

  firstName: string;

  lastName: string;

  phone: string;

  addressLine1: string;

  addressLine2: string | null;

  city: string;

  state: string;

  country: string;

  postalCode: string | null;

  isDefault: boolean;

  createdAt: string;

  updatedAt: string;
}

// ============================================================
// CREATE ADDRESS INPUT
// ============================================================

export interface CreateAddressInput {
  firstName: string;

  lastName: string;

  phone: string;

  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  country?: string;

  postalCode?: string;

  isDefault?: boolean;
}

// ============================================================
// UPDATE ADDRESS INPUT
// ============================================================

export interface UpdateAddressInput {
  firstName?: string;

  lastName?: string;

  phone?: string;

  addressLine1?: string;

  addressLine2?: string;

  city?: string;

  state?: string;

  country?: string;

  postalCode?: string;

  isDefault?: boolean;
}

// ============================================================
// GET ADDRESSES RESPONSE
// ============================================================

export interface GetAddressesResponse {
  success: boolean;

  data: Address[];
}

// ============================================================
// SINGLE ADDRESS RESPONSE
// ============================================================

export interface GetAddressResponse {
  success: boolean;

  data: Address;
}

// ============================================================
// CREATE / UPDATE RESPONSE
// ============================================================

export interface AddressMutationResponse {
  success: boolean;

  data: Address;

  message: string;
}

// ============================================================
// DELETE RESPONSE
// ============================================================

export interface DeleteAddressResponse {
  success: boolean;

  message: string;
}