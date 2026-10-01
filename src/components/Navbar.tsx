import { useApp } from '../context/AppContext';
import { btnAccent } from './ui';

export function Navbar({ setActiveTab }: { setActiveTab: (t: string) => void }) {
  const { settings, isAdmin, logout, setShowLogin, setShowSettings, openDonation } = useApp();
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
        <button onClick={() => setActiveTab('home')} className="flex items-center gap-2 text-left">
          {settings.logo_url ? (
            <img src={settings.logo_url} alt="লোগো" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="text-3xl">🤲</span>
          )}
          <span>
            <span className="block font-bold text-lg text-emerald-900 leading-tight">{settings.name_bn}</span>
            <span className="block text-xs text-stone-500">{settings.name_en}</span>
          </span>
        </button>
        <div className="ml-auto flex items-center gap-2 flex-wrap text-sm">
          <a href={`tel:${settings.hotline}`} className="text-stone-600 hover:text-emerald-800">
            📞 {settings.hotline}
          </a>
          <button className={btnAccent} onClick={() => openDonation()}>
            💝 অনুদান দিন
          </button>
          {isAdmin ? (
            <>
              <button className="border rounded-lg px-3 py-2 hover:bg-stone-100" onClick={() => setShowSettings(true)}>
                ⚙️ সেটিংস
              </button>
              <button className="border rounded-lg px-3 py-2 hover:bg-stone-100" onClick={logout}>
                লগআউট
              </button>
            </>
          ) : (
            <button className="border rounded-lg px-3 py-2 hover:bg-stone-100" onClick={() => setShowLogin(true)}>
              🔐 অ্যাডমিন
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
