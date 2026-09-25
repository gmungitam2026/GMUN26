import { registrationPackages } from "@/config/pricing";
import { verifyAdminSession } from "@/lib/supabase/dal";
import { getRegistrationOpen } from "@/lib/admin/queries";
import { RegistrationToggle } from "@/components/admin/RegistrationToggle";

export default async function AdminSettingsPage() {
  const session = await verifyAdminSession();
  const activeProvider = process.env.PAYMENT_PROVIDER || "mock";
  const registrationOpen = await getRegistrationOpen();

  return (
    <div>
      <h1 className="font-display text-2xl text-ivory">Settings</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Signed in as</p>
          <p className="text-ivory">{session.name}</p>
          <p className="text-sm text-ivory-faint">{session.email} · {session.role}</p>
        </div>

        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Registration Status</p>
          <RegistrationToggle initialOpen={registrationOpen} />
        </div>

        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Active Payment Provider</p>
          <p className="text-ivory">{activeProvider}</p>
          <p className="mt-1 text-sm text-ivory-faint">
            Set via the <code className="text-ivory">PAYMENT_PROVIDER</code> environment variable.
            No payment gateway has been finalised for GMUN 5.0 yet, so this defaults to the mock
            provider.
          </p>
        </div>

        <div className="lg:col-span-2">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.24em] text-gold">Registration Packages</p>
          <table className="w-full max-w-2xl border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-[0.08em] text-ivory-faint">
                <th className="py-2 pr-4 font-normal">Name</th>
                <th className="py-2 pr-4 font-normal">Price</th>
                <th className="py-2 pr-4 font-normal">Active</th>
              </tr>
            </thead>
            <tbody>
              {registrationPackages.map((p) => (
                <tr key={p.id} className="border-b border-line">
                  <td className="py-2 pr-4 text-ivory">{p.name}</td>
                  <td className="py-2 pr-4 text-ivory-dim">₹{p.price}</td>
                  <td className="py-2 pr-4 text-ivory-dim">{p.active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 max-w-xl text-sm text-ivory-faint">
            Defined in <code className="text-ivory">config/pricing.ts</code>. Pricing is not yet
            finalised for GMUN 5.0. Update this file (or migrate it to the{" "}
            <code className="text-ivory">registration_packages</code> table) once it is.
          </p>
        </div>
      </div>
    </div>
  );
}
