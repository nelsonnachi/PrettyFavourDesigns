import { auth } from "@clerk/nextjs/server";

import { CheckoutPage } from "@/components/(storefront)/checkout/checkout-page";

export default async function CheckoutRoute() {
  // ==========================================================
  // REQUIRE SIGNED-IN USER
  // ==========================================================
  //
  // If the visitor is not signed in, Clerk redirects them
  // to the sign-in page.
  //
  // After successful authentication, Clerk can return the
  // user to the checkout page they originally requested.
  //
  // ==========================================================

  await auth.protect();

  return <CheckoutPage />;
}