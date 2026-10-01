"use client";

import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ClipboardList, LayoutDashboard, UserRound } from "lucide-react";

interface AccountButtonProps {
  isAdmin?: boolean;
}

export function AccountButton({ isAdmin }: AccountButtonProps) {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            aria-label="Sign in"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#211b17] transition-colors hover:bg-[#eee6da] hover:text-[#e85d22]"
          >
            <UserRound className="size-[17px]" strokeWidth={1.6} />
          </button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
        <UserButton appearance={{ elements: { avatarBox: "size-9" } }}>
          <UserButton.MenuItems>
            {isAdmin && (
              <UserButton.Link
                label="Dashboard"
                href="/admin"
                labelIcon={
                  <LayoutDashboard className="size-4" strokeWidth={1.6} />
                }
              />
            )}

            <UserButton.Link
              label="My Orders"
              href="/orders"
              labelIcon={<ClipboardList className="size-4" strokeWidth={1.6} />}
            />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </>
  );
}