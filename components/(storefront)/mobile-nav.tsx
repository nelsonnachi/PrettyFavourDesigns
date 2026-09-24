"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavigationItem = {
  label: string;
  href: string;
};

type MobileNavProps = {
  navigation: NavigationItem[];
};

export function MobileNav({ navigation }: MobileNavProps) {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#211b17] transition-colors hover:bg-[#eee6da] hover:text-[#e85d22]"
          aria-label="Open navigation"
        >
          <Menu
            className="size-[19px]"
            strokeWidth={1.6}
          />
        </SheetTrigger>

        <SheetContent
          side="right"
          className="w-[85%] max-w-sm border-l border-[#e6ddd1] bg-[#faf7f1] px-6"
        >
          <SheetHeader className="border-b border-[#e6ddd1] pb-5 text-left">
            <SheetTitle className="font-serif text-2xl tracking-[0.08em] text-[#211b17]">
              SHOPPFD
            </SheetTitle>
          </SheetHeader>

          <nav
            className="mt-8 flex flex-col"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-[#e6ddd1] py-5 font-serif text-2xl text-[#211b17] transition-colors hover:text-[#e85d22]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 text-sm leading-6 text-[#756a60]">
            Handcrafted bags for every occasion, style and story.
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}