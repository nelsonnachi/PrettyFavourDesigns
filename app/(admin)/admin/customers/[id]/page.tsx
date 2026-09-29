import { CustomerDetailsPage } from "@/components/admin/customers/details/customer-details-page";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDetailsRoute({
  params,
}: PageProps) {
  const { id } = await params;

  return (
    <CustomerDetailsPage id={id} />
  );
}