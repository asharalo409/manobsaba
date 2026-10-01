import { ROOMS } from '../utils/rooms';

export function RoomTabsNav({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (t: string) => void }) {
  return (
    <nav className="sticky top-0 z-30 bg-emerald-900 text-white shadow">
      <div className="max-w-6xl mx-auto px-2 flex overflow-x-auto gap-1 py-1">
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveTab(r.id)}
            className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === r.id ? 'bg-white text-emerald-900' : 'hover:bg-emerald-800'
            }`}
          >
            {r.icon} {r.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
