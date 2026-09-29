import { OrderDetails } from "@/components/admin/orders/OrderDetails";

interface AdminOrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailsPage({
  params,
}: AdminOrderDetailsPageProps) {
  const { id } = await params;

  return <OrderDetails orderId={id} />;
}