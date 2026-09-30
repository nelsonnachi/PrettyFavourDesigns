import { CheckoutSuccessPage } from "@/components/(storefront)/checkout/checkout-success-page";

type CheckoutSuccessRouteProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function CheckoutSuccessRoute({
  searchParams,
}: CheckoutSuccessRouteProps) {
  const params = await searchParams;

  return (
    <CheckoutSuccessPage
      orderId={params.order ?? ""}
    />
  );
}