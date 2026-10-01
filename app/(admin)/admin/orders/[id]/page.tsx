import { OrderDetails } from "@/components/admin/orders/OrderDetails";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrderDetails orderId={id} />;
}