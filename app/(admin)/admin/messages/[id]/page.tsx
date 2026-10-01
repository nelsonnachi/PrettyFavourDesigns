import { MessageDetails } from "@/components/admin/messages/MessageDetails";

export default async function AdminMessageDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <MessageDetails messageId={id} />;
}