import { ProductEditForm } from "@/components/admin/products/edit/ProductEditForm";

interface ProductEditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductEditPage({
  params,
}: ProductEditPageProps) {
  const { slug } = await params;

  return <ProductEditForm slug={slug} />;
}