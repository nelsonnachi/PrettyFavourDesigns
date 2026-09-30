"use client";

import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import {
  ClipboardList,
  LayoutDashboard,
  UserRound,
} from "lucide-react";

// ============================================================
// TYPES
// ============================================================

interface AccountButtonProps {
  isAdmin?: boolean;
}

// ============================================================
// ACCOUNT BUTTON
// ============================================================
//
// Signed out:
// - Shows sign-in button
//
// Signed in:
// - Shows Clerk profile avatar
// - Dashboard for admins/super admins
// - My Orders
// - Clerk's default account/sign-out actions
//
// ============================================================

export function AccountButton({
  isAdmin = false,
}: AccountButtonProps) {
  return (
    <>
      {/* ======================================================
          SIGNED OUT
      ====================================================== */}

      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            aria-label="Sign in"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#211b17] transition-colors hover:bg-[#eee6da] hover:text-[#e85d22]"
          >
            <UserRound
              className="size-[17px]"
              strokeWidth={1.6}
            />
          </button>
        </SignInButton>
      </Show>

      {/* ======================================================
          SIGNED IN
      ====================================================== */}

      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-9",
            },
          }}
        >
          <UserButton.MenuItems>

            {/* =================================================
                ADMIN DASHBOARD
            ================================================= */}

            {isAdmin && (
              <UserButton.Link
                label="Dashboard"
                href="/admin"
                labelIcon={
                  <LayoutDashboard
                    className="size-4"
                    strokeWidth={1.6}
                  />
                }
              />
            )}

            {/* =================================================
                MY ORDERS
            ================================================= */}

            <UserButton.Link
              label="My Orders"
              href="/orders"
              labelIcon={
                <ClipboardList
                  className="size-4"
                  strokeWidth={1.6}
                />
              }
            />

          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </>
  );
}