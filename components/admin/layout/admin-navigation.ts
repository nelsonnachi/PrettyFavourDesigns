import type { LucideIcon } from "lucide-react";

import {
  Boxes,
  ChartNoAxesCombined,
  LayoutDashboard,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Tags,
  Truck,
  Users,
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
    label: "Inventory",
    href: "/admin/inventory",
    icon: Truck,
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
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];