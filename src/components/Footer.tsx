import { useApp } from '../context/AppContext';

export function Footer({ setActiveTab }: { setActiveTab: (t: string) => void }) {
  const { settings } = useApp();
  return (
    <footer className="bg-emerald-950 text-emerald-100 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 sm:grid-cols-3">
        <div>
          <div className="font-bold text-lg">{settings.name_bn}</div>
          <p className="text-sm text-emerald-300 mt-1">{settings.tagline_bn}</p>
        </div>
        <div className="text-sm space-y-1">
          <div>📞 হটলাইন: {settings.hotline}</div>
          <div>বিকাশ: {settings.bkash_number}</div>
          <div>নগদ: {settings.nagad_number}</div>
        </div>
        <div className="text-sm space-y-1">
          <button className="block hover:underline" onClick={() => setActiveTab('projects')}>প্রজেক্টসমূহ</button>
          <button className="block hover:underline" onClick={() => setActiveTab('complaints')}>অভিযোগ ও পরামর্শ</button>
          <button className="block hover:underline" onClick={() => setActiveTab('blood')}>রক্তদাতা খুঁজুন</button>
        </div>
      </div>
      <div className="text-center text-xs text-emerald-400 pb-4">© {settings.name_bn}</div>
    </footer>
  );
}
