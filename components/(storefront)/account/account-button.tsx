"use client";

import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

import {
  ClipboardList,
  UserRound,
} from "lucide-react";

// ============================================================
// ACCOUNT BUTTON
// ============================================================
//
// Signed out:
// - Shows the user icon
// - Clicking it opens Clerk sign-in
//
// Signed in:
// - Shows the Clerk profile avatar
// - Dropdown contains:
//   1. Manage account
//   2. My Orders
//   3. Sign out
//
// ============================================================

export function AccountButton() {
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
          {/* ==================================================
              CUSTOM MENU ITEMS
          ================================================== */}

          <UserButton.MenuItems>
            {/* ==================================================
                MY ORDERS
            ================================================== */}

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