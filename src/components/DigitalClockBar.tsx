import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { banglaDateText } from '../utils/dateUtils';

export function DigitalClockBar() {
  const { data, demoMode } = useApp();
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const urgent = data.notices.filter((n) => n.is_urgent || n.category === 'urgent');

  return (
    <div className="bg-stone-900 text-stone-100 text-sm">
      <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center gap-4">
        <div className="shrink-0 font-semibold tabular-nums">
          🕒 {now.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="shrink-0 hidden sm:block text-stone-400">{banglaDateText(now)}</div>
        <div className="flex-1 overflow-hidden">
          {urgent.length > 0 && (
            <div className="marquee text-amber-300">🚨 {urgent.map((n) => n.title_bn + ': ' + n.content_bn).join('   •   ')}</div>
          )}
        </div>
      </div>
      {demoMode && (
        <div className="bg-amber-100 text-amber-900 text-center text-xs py-1">
          ডেমো মোড: Supabase যুক্ত নেই, তাই তথ্য শুধু এই ব্রাউজারে সেভ হচ্ছে। (অ্যাডমিন পাসওয়ার্ড: demo123)
        </div>
      )}
    </div>
  );
}
