import { PaymentDetailsPage } from "@/components/admin/payment/payments-details/payment-details-page";

interface AdminPaymentDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminPaymentDetailsPage({
  params,
}: AdminPaymentDetailsPageProps) {
  const { id } = await params;

  return <PaymentDetailsPage id={id} />;
}