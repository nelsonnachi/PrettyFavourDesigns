"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Ban,
  CheckCircle2,
  Loader2,
  Shield,
  Trash2,
} from "lucide-react";
import { AdminUser, AdminUserRole } from "@/lib/query/customer/admin-user-types";
import { deleteAdminUser, updateAdminUser } from "@/lib/query/customer/admin-user-mutations";
import { adminUserKeys } from "@/lib/query/customer/admin-user-keys";


type CustomerAccountActionsProps = {
  customer: AdminUser;
};

export function CustomerAccountActions({
  customer,
}: CustomerAccountActionsProps) {
  const queryClient =   useQueryClient();

  const [role, setRole] =
    useState<AdminUserRole>(
      customer.role,
    );

  const updateMutation =
    useMutation({
      mutationFn: (
        data: {
          isBanned?: boolean;
          role?: AdminUserRole;
        },
      ) =>
        updateAdminUser(
          customer.id,
          data,
        ),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: adminUserKeys.detail(
            customer.id,
          ),
        });

        queryClient.invalidateQueries({
          queryKey: adminUserKeys.lists(),
        });
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn: () =>
        deleteAdminUser(customer.id),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: adminUserKeys.lists(),
        });

        window.location.href =
          "/admin/customers";
      },
    });

  function handleToggleBan() {
    updateMutation.mutate({
      isBanned: !customer.isBanned,
    });
  }

  function handleRoleChange(
    nextRole: AdminUserRole,
  ) {
    setRole(nextRole);

    updateMutation.mutate({
      role: nextRole,
    });
  }

  function handleDelete() {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${customer.email}? This action cannot be undone.`,
      );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate();
  }

  return (
    <section className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border p-5">
        <h2 className="font-semibold">
          Account actions
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage this customer's account.
        </p>
      </div>

      <div className="space-y-4 p-5">
        <button
          type="button"
          disabled={
            updateMutation.isPending ||
            deleteMutation.isPending
          }
          onClick={handleToggleBan}
          className="flex w-full items-center justify-between rounded-xl border border-border p-4 text-left transition hover:bg-muted disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              {customer.isBanned ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
            </div>

            <div>
              <p className="text-sm font-semibold">
                {customer.isBanned
                  ? "Unban customer"
                  : "Ban customer"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {customer.isBanned
                  ? "Allow this customer to use their account again."
                  : "Prevent this customer from using their account."}
              </p>
            </div>
          </div>

          {updateMutation.isPending && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
        </button>

        <div className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Shield className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold">
                Account role
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Change this user's administrative role.
              </p>
            </div>
          </div>

          <select
            value={role}
            disabled={
              updateMutation.isPending
            }
            onChange={(event) =>
              handleRoleChange(
                event.target
                  .value as AdminUserRole,
              )
            }
            className="mt-4 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            <option value="customer">
              Customer
            </option>

            <option value="admin">
              Admin
            </option>

            <option value="super_admin">
              Super Admin
            </option>
          </select>

          <p className="mt-2 text-xs text-muted-foreground">
            Your API will enforce the required super-admin permissions.
          </p>
        </div>

        <button
          type="button"
          disabled={
            deleteMutation.isPending
          }
          onClick={handleDelete}
          className="flex w-full items-center gap-3 rounded-xl border border-red-200 p-4 text-left text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
            {deleteMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold">
              Delete customer
            </p>

            <p className="mt-1 text-xs text-red-500">
              Permanently delete this account.
            </p>
          </div>
        </button>

        {updateMutation.isError && (
          <p className="text-sm text-red-600">
            {updateMutation.error instanceof Error
              ? updateMutation.error.message
              : "Failed to update customer."}
          </p>
        )}

        {deleteMutation.isError && (
          <p className="text-sm text-red-600">
            {deleteMutation.error instanceof Error
              ? deleteMutation.error.message
              : "Failed to delete customer."}
          </p>
        )}
      </div>
    </section>
  );
}