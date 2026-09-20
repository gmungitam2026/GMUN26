import { listPayments } from "@/lib/admin/queries";
import { cn } from "@/lib/utils/cn";

export default async function AdminPaymentsPage() {
  const { payments, total } = await listPayments();

  return (
    <div>
      <h1 className="font-display text-2xl text-ivory">Payments</h1>
      <p className="mt-2 text-sm text-ivory-faint">{total} payment records</p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-[0.08em] text-ivory-faint">
              <th className="py-3 pr-4 font-normal">Order ID</th>
              <th className="py-3 pr-4 font-normal">Provider</th>
              <th className="py-3 pr-4 font-normal">Payment ID</th>
              <th className="py-3 pr-4 font-normal">Amount</th>
              <th className="py-3 pr-4 font-normal">Method</th>
              <th className="py-3 pr-4 font-normal">Status</th>
              <th className="py-3 pr-4 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-b border-line">
                <td className="py-3 pr-4 text-ivory-dim">{p.order_id}</td>
                <td className="py-3 pr-4 text-ivory-dim">{p.provider}</td>
                <td className="py-3 pr-4 text-ivory-dim">{p.payment_id ?? "—"}</td>
                <td className="py-3 pr-4 text-ivory">₹{p.amount}</td>
                <td className="py-3 pr-4 text-ivory-dim">{p.method ?? "—"}</td>
                <td className="py-3 pr-4">
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[11px] uppercase tracking-[0.06em]",
                      p.status === "PAID" && "bg-gold/15 text-gold",
                      p.status === "PENDING" && "bg-ivory-faint/15 text-ivory-dim",
                      (p.status === "FAILED" || p.status === "CANCELLED") && "bg-danger/10 text-danger",
                      p.status === "REFUNDED" && "bg-info/10 text-info"
                    )}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-ivory-faint">
                  {new Date(p.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {payments.length === 0 && <p className="py-10 text-sm text-ivory-faint">No payments recorded yet.</p>}
      </div>
    </div>
  );
}
