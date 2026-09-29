import type {
  CreateAdminUserInput,
  CreateAdminUserResponse,
  DeleteAdminUserResponse,
  UpdateAdminUserInput,
  UpdateAdminUserResponse,
} from "./admin-user-types";

// ============================================================
// API ERROR HELPER
// ============================================================

async function getApiError(
  response: Response,
  fallback: string,
) {
  try {
    const body = await response.json();

    return body?.message ?? fallback;
  } catch {
    return fallback;
  }
}

// ============================================================
// CREATE ADMIN USER
// ============================================================

export async function createAdminUser(
  data: CreateAdminUserInput,
): Promise<CreateAdminUserResponse> {
  const response = await fetch(
    "/api/admin/users",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiError(
        response,
        "Failed to create user",
      ),
    );
  }

  return response.json();
}

// ============================================================
// UPDATE ADMIN USER
// ============================================================

export async function updateAdminUser(
  id: string,
  data: UpdateAdminUserInput,
): Promise<UpdateAdminUserResponse> {
  const response = await fetch(
    `/api/admin/users/${id}`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiError(
        response,
        "Failed to update user",
      ),
    );
  }

  return response.json();
}

// ============================================================
// DELETE ADMIN USER
// ============================================================

export async function deleteAdminUser(
  id: string,
): Promise<DeleteAdminUserResponse> {
  const response = await fetch(
    `/api/admin/users/${id}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiError(
        response,
        "Failed to delete user",
      ),
    );
  }

  return response.json();
}