import { Database, Server, ShieldCheck, Volume2 } from 'lucide-react';
import { isLocalAuthMode } from '@/config/authConfig';

const services = [
  { icon: Server, name: 'Backend API' },
  { icon: Database, name: 'Database' },
  { icon: Volume2, name: 'Speech synthesis' },
];

export function AdminServiceConnections() {
  return (
    <section aria-labelledby="admin-connections-title" className="space-y-4 rounded-2xl border border-antique-gold/30 bg-rice-paper p-6 shadow-sm dark:bg-heritage-dark/60">
      <h2 id="admin-connections-title" className="text-lg text-ink">Service connections</h2>
      <p className="text-sm text-ink-faint">Live service health is not available in this overview.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ icon: Icon, name }) => (
          <div key={name} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
            <Icon className="size-5 shrink-0 text-ink-faint" aria-hidden="true" />
            <div><h3 className="text-sm text-ink">{name}</h3><p className="text-xs text-ink-faint">Not checked</p></div>
          </div>
        ))}
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
          <ShieldCheck className="size-5 shrink-0 text-action" aria-hidden="true" />
          <div><h3 className="text-sm text-ink">Account access</h3><p className="text-xs text-ink-faint">{isLocalAuthMode ? 'Local demo administrator' : 'Administrator role'}</p></div>
        </div>
      </div>
    </section>
  );
}
