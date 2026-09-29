import { AdminPaymentOrderItem } from "@/lib/query/payments/payment-types";
import Image from "next/image";


interface PaymentOrderItemsProps {
  items: AdminPaymentOrderItem[];
}

function formatCurrency(
  amount: string,
) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `₦${amount}`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

export function PaymentOrderItems({
  items,
}: PaymentOrderItemsProps) {
  return (
    <section className="rounded-xl border bg-card">
      <div className="border-b p-5">
        <h2 className="font-semibold">
          Order items
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Products included in this order.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="p-5 text-sm text-muted-foreground">
          No order items found.
        </div>
      ) : (
        <div className="divide-y">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-5"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
                {item.productImageUrl ? (
                  <Image
                    src={item.productImageUrl}
                    alt={item.productName}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div>
                    <h3 className="truncate font-medium">
                      {item.productName}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      SKU: {item.productSku}
                    </p>

                    {item.variantSku && (
                      <p className="text-xs text-muted-foreground">
                        Variant: {item.variantSku}
                      </p>
                    )}

                    {item.colorName && (
                      <p className="text-xs text-muted-foreground">
                        Color: {item.colorName}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-left sm:text-right">
                    <p className="font-medium">
                      {formatCurrency(
                        item.totalPrice,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.quantity} ×{" "}
                      {formatCurrency(
                        item.unitPrice,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}