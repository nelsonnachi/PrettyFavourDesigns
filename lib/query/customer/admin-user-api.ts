import type {
  AdminUserResponse,
  AdminUsersQuery,
  AdminUsersResponse,
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
// GET ADMIN USERS
// ============================================================

export async function getAdminUsers(
  query: AdminUsersQuery,
): Promise<AdminUsersResponse> {
  const searchParams = new URLSearchParams();

  searchParams.set(
    "page",
    String(query.page),
  );

  searchParams.set(
    "limit",
    String(query.limit),
  );

  searchParams.set(
    "status",
    query.status,
  );

  searchParams.set(
    "role",
    query.role,
  );

  searchParams.set(
    "sort",
    query.sort,
  );

  if (query.search.trim()) {
    searchParams.set(
      "search",
      query.search.trim(),
    );
  }

  const response = await fetch(
    `/api/admin/users?${searchParams.toString()}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiError(
        response,
        "Failed to fetch users",
      ),
    );
  }

  return response.json();
}

// ============================================================
// GET SINGLE ADMIN USER
// ============================================================

export async function getAdminUser(
  id: string,
): Promise<AdminUserResponse> {
  const response = await fetch(
    `/api/admin/users/${id}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getApiError(
        response,
        "Failed to fetch user",
      ),
    );
  }

  return response.json();
}