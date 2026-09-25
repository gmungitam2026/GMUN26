import { committees } from "@/config/committees";

export default function AdminCommitteesPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-ivory">Committees</h1>
      <p className="mt-2 max-w-xl text-sm text-ivory-dim">
        Committee content is seeded from the <code className="text-ivory">committees</code> table
        (see <code className="text-ivory">supabase/migrations/0001_init.sql</code>). Full CRUD
        management from this screen is planned for a future pass. For now, edit rows directly in
        Supabase or update the seed migration.
      </p>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-[0.08em] text-ivory-faint">
              <th className="py-3 pr-4 font-normal">Short Name</th>
              <th className="py-3 pr-4 font-normal">Committee</th>
              <th className="py-3 pr-4 font-normal">Type</th>
            </tr>
          </thead>
          <tbody>
            {committees.map((c) => (
              <tr key={c.id} className="border-b border-line">
                <td className="py-3 pr-4 text-gold">{c.shortName}</td>
                <td className="py-3 pr-4 text-ivory-dim">{c.name}</td>
                <td className="py-3 pr-4 text-ivory-faint">{c.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
