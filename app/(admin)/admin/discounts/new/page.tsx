import { DiscountForm } from "@/components/admin/discounts/discount-form";

export default function NewDiscountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#211b17]">
          Create discount
        </h1>

        <p className="mt-1 text-sm text-[#6f665f]">
          Create a promotional code for your customers.
        </p>
      </div>

      <DiscountForm mode="create" />
    </div>
  );
}