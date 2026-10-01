import type { LucideIcon } from "lucide-react";

import {
  Boxes,
  ChartNoAxesCombined,
  LayoutDashboard,
  MessageSquare,
  Package,
  Palette,
  Settings,
  ShoppingBag,
  Tags,
  Truck,
  Users,
  BadgePercent,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const adminNavigation: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },

  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },

  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },

  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },

  {
    label: "Categories",
    href: "/admin/categories",
    icon: Boxes,
  },

  {
    label: "Colors",
    href: "/admin/colors",
    icon: Palette,
  },

  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Truck,
  },

  {
    label: "Discounts",
    href: "/admin/discounts",
    icon: BadgePercent,
  },

  {
    label: "Messages",
    href: "/admin/messages",
    icon: MessageSquare,
  },

  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: ChartNoAxesCombined,
  },

  {
    label: "Payments",
    href: "/admin/payments",
    icon: Tags,
  },

  {
    label: "Announcement",
    href: "/admin/announcements",
    icon: Settings,
  },
];
