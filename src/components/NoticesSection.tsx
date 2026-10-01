import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NOTICE_CATS } from '../utils/rooms';
import { formatDate, todayISO, uid } from '../utils/dateUtils';
import { Container, Empty, Field, PageHeader, btnDanger, btnPrimary, inputCls } from './ui';

export function NoticesSection() {
  const { data, isAdmin, add, remove } = useApp();
  const [filter, setFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cat, setCat] = useState('other');
  const [urgent, setUrgent] = useState(false);

  const list = data.notices.filter((n) => filter === 'all' || n.category === filter);

  const submit = async () => {
    if (!title.trim() || !content.trim()) return alert('শিরোনাম ও বিবরণ দিন');
    const ok = await add('notices', { id: uid(), title_bn: title, category: cat, content_bn: content, date: todayISO(), is_urgent: urgent || cat === 'urgent' });
    if (ok) { setTitle(''); setContent(''); setUrgent(false); } else alert('যোগ হয়নি। অ্যাডমিন লগইন দেখুন।');
  };

  return (
    <Container>
      <PageHeader icon="📢" title="নোটিশ বোর্ড" desc="খেলা, খাওয়া, দান, রক্ত, সভা ও জরুরি ঘোষণা" />
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {['all', ...Object.keys(NOTICE_CATS)].map((k) => (
          <button key={k} onClick={() => setFilter(k)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border ${filter === k ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white'}`}>
            {k === 'all' ? 'সব' : NOTICE_CATS[k]}
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className="bg-white border rounded-xl p-4 mb-5">
          <h3 className="font-semibold mb-2">নতুন নোটিশ</h3>
          <Field label="শিরোনাম"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="বিবরণ"><textarea className={inputCls} rows={3} value={content} onChange={(e) => setContent(e.target.value)} /></Field>
          <Field label="ধরন">
            <select className={inputCls} value={cat} onChange={(e) => setCat(e.target.value)}>
              {Object.entries(NOTICE_CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm mb-3"><input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} /> উপরের স্ক্রলিং বারে দেখান (জরুরি)</label>
          <button className={btnPrimary} onClick={submit}>নোটিশ দিন</button>
        </div>
      )}

      {list.length === 0 && <Empty text="কোনো নোটিশ নেই।" />}
      <div className="space-y-3">
        {list.map((n) => (
          <div key={n.id} className={`bg-white border rounded-xl p-4 ${n.is_urgent ? 'border-red-300' : ''}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-stone-500">{NOTICE_CATS[n.category] || n.category} • {formatDate(n.date)}</span>
              {isAdmin && <button className={btnDanger} onClick={() => confirm('মুছবেন?') && remove('notices', n.id)}>মুছুন</button>}
            </div>
            <h3 className="font-bold mt-1">{n.title_bn}</h3>
            <p className="text-stone-600 mt-1 whitespace-pre-line">{n.content_bn}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
