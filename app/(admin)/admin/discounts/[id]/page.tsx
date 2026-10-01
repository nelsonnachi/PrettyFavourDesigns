import { notFound } from "next/navigation";

import { DiscountForm } from "@/components/admin/discounts/discount-form";
import { apiClient } from "@/lib/api/client";

interface DiscountDetail {
  id: string;
  name: string;
  description: string | null;
  code: string;
  type: "percentage" | "fixed";
  value: string;
  appliesTo: "order" | "products" | "categories";
  eligibility: "all" | "specific_customers";

  minimumPurchaseAmount: string | null;
  maximumDiscountAmount: string | null;
  minimumQuantity: number | null;

  usageLimit: number | null;
  usageLimitPerCustomer: number | null;
  usageCount: number;

  isActive: boolean;

  startsAt: string;
  endsAt: string | null;

  createdAt: string;
  updatedAt: string;

  products: {
    id: string;
    name: string;
  }[];

  categories: {
    id: string;
    name: string;
  }[];

  customers: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  }[];
}

interface DiscountResponse {
  success: boolean;
  data: DiscountDetail;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDiscountPage({
  params,
}: PageProps) {
  const { id } = await params;

  let discount: DiscountDetail;

  try {
    const response = await apiClient<DiscountResponse>(
      `/api/admin/discounts/${id}`,
    );

    discount = response.data;
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#211b17]">
          Edit discount
        </h1>

        <p className="mt-1 text-sm text-[#6f665f]">
          Update the settings for{" "}
          <span className="font-medium">
            {discount.name}
          </span>
          .
        </p>
      </div>

      <DiscountForm
        mode="edit"
        discountId={discount.id}
        initialValues={{
          name: discount.name,
          description: discount.description ?? "",
          code: discount.code,
          type: discount.type,
          value: discount.value,

          appliesTo: discount.appliesTo,

          productIds: discount.products.map(
            (product) => product.id,
          ),

          categoryIds: discount.categories.map(
            (category) => category.id,
          ),

          eligibility: discount.eligibility,

          customerIds: discount.customers.map(
            (customer) => customer.id,
          ),

          minimumPurchaseAmount:
            discount.minimumPurchaseAmount ?? "",

          maximumDiscountAmount:
            discount.maximumDiscountAmount ?? "",

          minimumQuantity:
            discount.minimumQuantity?.toString() ?? "",

          usageLimit:
            discount.usageLimit?.toString() ?? "",

          usageLimitPerCustomer:
            discount.usageLimitPerCustomer?.toString() ?? "",

          isActive: discount.isActive,

          startsAt: discount.startsAt,

          endsAt: discount.endsAt ?? "",
        }}
      />
    </div>
  );
}