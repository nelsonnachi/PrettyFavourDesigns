const orders = [
  {
    id: "#SHP-001248",
    customer: "Aisha Bello",
    date: "Sep 24, 2026",
    amount: "₦95,000",
    payment: "Paid",
    status: "Delivered",
  },
  {
    id: "#SHP-001247",
    customer: "Emeka Okafor",
    date: "Sep 23, 2026",
    amount: "₦135,000",
    payment: "Paid",
    status: "Processing",
  },
  {
    id: "#SHP-001246",
    customer: "Fatima Yusuf",
    date: "Sep 22, 2026",
    amount: "₦75,000",
    payment: "Paid",
    status: "Shipped",
  },
];

function getStatusClass(status: string) {
  switch (status) {
    case "Delivered":
      return "bg-green-500/10 text-green-700";

    case "Processing":
      return "bg-accent/10 text-accent";

    case "Shipped":
      return "bg-secondary text-muted-foreground";

    default:
      return "bg-muted text-muted-foreground";
  }
}

export function RecentOrders() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">
          Recent Orders
        </h2>

        <a
          href="/admin/orders"
          className="text-xs text-accent hover:underline"
        >
          View all →
        </a>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Payment</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border last:border-0"
              >
                <td className="py-4 text-sm font-medium">
                  {order.id}
                </td>

                <td className="py-4 text-sm">
                  {order.customer}
                </td>

                <td className="py-4 text-sm text-muted-foreground">
                  {order.date}
                </td>

                <td className="py-4 text-sm font-medium">
                  {order.amount}
                </td>

                <td className="py-4">
                  <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-medium text-green-700">
                    {order.payment}
                  </span>
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}