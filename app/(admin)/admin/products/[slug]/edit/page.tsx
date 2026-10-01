import { ProductEditForm } from "@/components/admin/products/edit/ProductEditForm";

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ProductEditForm slug={slug} />;
}