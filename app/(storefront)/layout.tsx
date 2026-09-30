import { StorefrontHeader } from "@/components/(storefront)/header";
import { StorefrontFooter } from "@/components/(storefront)/footer";
import { getOptionalUser } from "@/lib/APIs/auth";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getOptionalUser();

  const isAdmin =
    user?.role === "admin" ||
    user?.role === "super_admin";

  return (
    <div className="min-h-screen bg-background">
      <StorefrontHeader isAdmin={isAdmin} />

      <main>{children}</main>

      <StorefrontFooter />
    </div>
  );
}