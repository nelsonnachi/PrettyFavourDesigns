import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { storefrontProducts } from "@/data/storefront-products";

import { ProductDetails } from "@/components/(storefront)/products/product-details";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = storefrontProducts.find(
    (product) => product.slug === slug
  );

  if (!product) {
    return {
      title: "Product Not Found | SHOPPFD",
    };
  }

  return {
    title: `${product.name} | SHOPPFD`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = storefrontProducts.find(
    (product) => product.slug === slug
  );

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}