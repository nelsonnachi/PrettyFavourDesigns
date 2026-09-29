import { MessageDetails } from "@/components/admin/messages/MessageDetails";

interface AdminMessageDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminMessageDetailsPage({
  params,
}: AdminMessageDetailsPageProps) {
  const { id } = await params;

  return <MessageDetails messageId={id} />;
}