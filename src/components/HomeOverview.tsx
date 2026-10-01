import { useApp } from '../context/AppContext';
import { ROOMS, NOTICE_CATS } from '../utils/rooms';
import { formatDate, money, toBn } from '../utils/dateUtils';
import { Container, btnAccent } from './ui';

export function HomeOverview({ setActiveTab }: { setActiveTab: (t: string) => void }) {
  const { settings, data, openDonation, loading } = useApp();
  const raised = data.projects.reduce((s, p) => s + Number(p.raised_amount || 0), 0);
  const donors = data.projects.reduce((s, p) => s + Number(p.donor_count || 0), 0);
  const counts: Record<string, number> = {
    projects: data.projects.length,
    notices: data.notices.length,
    blood: data.blood_donors.length,
    media: data.media_links.length,
    members: data.members.length,
  };

  return (
    <div>
      <section
        className="relative bg-emerald-900 text-white"
        style={settings.cover_photo_url ? { backgroundImage: `linear-gradient(rgba(6,78,59,.85),rgba(6,78,59,.85)), url(${settings.cover_photo_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        <div className="max-w-6xl mx-auto px-4 py-14">
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">{settings.name_bn}</h1>
          <p className="mt-3 text-lg text-emerald-100 max-w-xl">{settings.tagline_bn}</p>
          <div className="mt-6 flex gap-3 flex-wrap">
            <button className={btnAccent} onClick={() => openDonation()}>💝 অনুদান দিন</button>
            <button className="border border-white/60 rounded-lg px-4 py-2 hover:bg-white/10" onClick={() => setActiveTab('projects')}>প্রজেক্ট দেখুন</button>
          </div>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="bg-white/10 rounded-xl p-3"><div className="text-2xl font-bold">{money(raised)}</div>মোট সংগৃহীত</div>
            <div className="bg-white/10 rounded-xl p-3"><div className="text-2xl font-bold">{toBn(donors)}</div>দাতা</div>
            <div className="bg-white/10 rounded-xl p-3"><div className="text-2xl font-bold">{toBn(data.projects.length)}</div>প্রজেক্ট</div>
            <div className="bg-white/10 rounded-xl p-3"><div className="text-2xl font-bold">{toBn(data.blood_donors.length)}</div>রক্তদাতা</div>
          </div>
        </div>
      </section>

      <Container>
        {loading && <p className="text-stone-500 mb-4">লোড হচ্ছে...</p>}
        <h2 className="text-xl font-bold text-emerald-900 mb-3">আমাদের ঘরসমূহ</h2>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {ROOMS.filter((r) => r.id !== 'home').map((r) => (
            <button key={r.id} onClick={() => setActiveTab(r.id)} className="text-left bg-white border rounded-xl p-4 hover:border-emerald-600 hover:shadow transition">
              <div className="text-3xl">{r.icon}</div>
              <div className="font-semibold mt-2">{r.label}</div>
              <div className="text-xs text-stone-500 mt-1">{r.desc}</div>
              {counts[r.id] !== undefined && <div className="text-xs text-emerald-700 mt-2 font-medium">{toBn(counts[r.id])} টি</div>}
            </button>
          ))}
        </div>

        <h2 className="text-xl font-bold text-emerald-900 mt-8 mb-3">সর্বশেষ নোটিশ</h2>
        <div className="space-y-2">
          {data.notices.slice(0, 3).map((n) => (
            <div key={n.id} className="bg-white border rounded-xl p-3">
              <div className="text-xs text-stone-500">{NOTICE_CATS[n.category] || n.category} • {formatDate(n.date)}</div>
              <div className="font-semibold">{n.title_bn}</div>
              <div className="text-sm text-stone-600">{n.content_bn}</div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
