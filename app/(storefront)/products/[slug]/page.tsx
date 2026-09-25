import type { Metadata } from "next";
import { ProductPageClient } from "./product-page-client";


type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Product | SHOPPFD`,
    description:
      "Discover handcrafted bags from SHOPPFD.",
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  return <ProductPageClient slug={slug} />;
}