import { PaymentDetailsPage } from "@/components/admin/payment/payments-details/payment-details-page";

export default async function AdminPaymentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PaymentDetailsPage id={id} />;
}