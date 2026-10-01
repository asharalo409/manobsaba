import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NOTICE_CATS } from '../utils/rooms';
import { banglaDateText, englishDateText, formatDate, hijriDateText, toBanglaDate, toBn } from '../utils/dateUtils';
import { Container, PageHeader, btnGhost } from './ui';

const WEEK = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র', 'শনি'];

export function MultiCalendarSection() {
  const { data } = useApp();
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const first = cursor.getDay();
  const days = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  const isToday = (d: number) => d === today.getDate() && cursor.getMonth() === today.getMonth() && cursor.getFullYear() === today.getFullYear();
  const meetings = data.notices.filter((n) => n.category === 'meeting');

  return (
    <Container>
      <PageHeader icon="📅" title="ক্যালেন্ডার" desc="বাংলা, হিজরি ও ইংরেজি তারিখ একসাথে" />
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        <div className="bg-white border rounded-xl p-4"><div className="text-xs text-stone-500">ইংরেজি</div><div className="font-semibold">{englishDateText(today)}</div></div>
        <div className="bg-white border rounded-xl p-4"><div className="text-xs text-stone-500">বাংলা</div><div className="font-semibold">{banglaDateText(today)}</div></div>
        <div className="bg-white border rounded-xl p-4"><div className="text-xs text-stone-500">হিজরি</div><div className="font-semibold">{hijriDateText(today)}</div><div className="text-xs text-stone-400 mt-1">চাঁদ দেখার উপর ১ দিন এদিক-ওদিক হতে পারে</div></div>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <button className={btnGhost} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>‹</button>
          <div className="font-bold">{cursor.toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' })}</div>
          <button className={btnGhost} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>›</button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs text-stone-500 mb-1">{WEEK.map((w) => <div key={w}>{w}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) =>
            d === null ? <div key={i} /> : (
              <div key={i} className={`rounded-lg py-1.5 text-center border ${isToday(d) ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-stone-50'}`}>
                <div className="font-semibold">{toBn(d)}</div>
                <div className={`text-[10px] ${isToday(d) ? 'text-emerald-100' : 'text-stone-400'}`}>{toBn(toBanglaDate(new Date(cursor.getFullYear(), cursor.getMonth(), d)).day)}</div>
              </div>
            )
          )}
        </div>
        <div className="text-xs text-stone-400 mt-2">বড় সংখ্যা ইংরেজি তারিখ, ছোট সংখ্যা বাংলা তারিখ</div>
      </div>

      <h3 className="font-bold text-emerald-900 mt-6 mb-2">সভা ও সময়সূচি</h3>
      {meetings.length === 0 ? <p className="text-stone-500 text-sm">কোনো সভার নোটিশ নেই।</p> : (
        <div className="space-y-2">
          {meetings.map((n) => (
            <div key={n.id} className="bg-white border rounded-xl p-3">
              <div className="text-xs text-stone-500">{NOTICE_CATS.meeting} • {formatDate(n.date)}</div>
              <div className="font-semibold">{n.title_bn}</div>
              <div className="text-sm text-stone-600">{n.content_bn}</div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
