import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, todayISO, uid } from '../utils/dateUtils';
import { Container, Empty, Field, PageHeader, btnDanger, btnPrimary, inputCls } from './ui';

const STATUS: Record<string, string> = { pending: '⏳ অপেক্ষমাণ', processing: '🔧 প্রক্রিয়াধীন', resolved: '✅ সমাধান হয়েছে' };

export function ComplaintCenterSection() {
  const { data, isAdmin, add, update, remove } = useApp();
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [contact, setContact] = useState('');
  const [done, setDone] = useState('');

  const submit = async () => {
    if (!subject.trim() || !details.trim()) return alert('বিষয় ও বিস্তারিত লিখুন');
    const tracking = 'MF-C-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const ok = await add('complaints', { id: uid(), tracking_no: tracking, subject: subject.trim(), details: details.trim(), contact: contact.trim() || null, status: 'pending', date: todayISO() });
    if (ok) { setDone(tracking); setSubject(''); setDetails(''); setContact(''); } else alert('জমা হয়নি, আবার চেষ্টা করুন');
  };

  return (
    <Container>
      <PageHeader icon="📝" title="অভিযোগ ও পরামর্শ কেন্দ্র" desc="আপনার অভিযোগ বা পরামর্শ শুধু অ্যাডমিনরা দেখতে পারবেন।" />
      {done && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
          ✅ জমা হয়েছে। আপনার ট্র্যাকিং নম্বর: <b>{done}</b>
          <div className="text-sm text-stone-600">নম্বরটি লিখে রাখুন।</div>
        </div>
      )}
      <div className="bg-white border rounded-xl p-4 mb-6">
        <Field label="বিষয়"><input className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} /></Field>
        <Field label="বিস্তারিত"><textarea className={inputCls} rows={4} value={details} onChange={(e) => setDetails(e.target.value)} /></Field>
        <Field label="যোগাযোগের ফোন/ইমেইল (ঐচ্ছিক)"><input className={inputCls} value={contact} onChange={(e) => setContact(e.target.value)} /></Field>
        <button className={btnPrimary} onClick={submit}>জমা দিন</button>
      </div>

      {isAdmin && (
        <>
          <h3 className="font-bold text-emerald-900 mb-2">সব অভিযোগ (শুধু অ্যাডমিন দেখছেন)</h3>
          {data.complaints.length === 0 && <Empty text="কোনো অভিযোগ নেই।" />}
          <div className="space-y-3">
            {data.complaints.map((c) => (
              <div key={c.id} className="bg-white border rounded-xl p-4">
                <div className="text-xs text-stone-500">{c.tracking_no} • {formatDate(c.date)}</div>
                <div className="font-bold">{c.subject}</div>
                <p className="text-sm text-stone-600 whitespace-pre-line">{c.details}</p>
                {c.contact && <div className="text-sm mt-1">📞 {c.contact}</div>}
                <div className="flex gap-2 mt-2 items-center flex-wrap">
                  <select className="border rounded-lg px-2 py-1 text-sm" value={c.status} onChange={(e) => update('complaints', c.id, { status: e.target.value })}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <button className={btnDanger} onClick={() => confirm('মুছবেন?') && remove('complaints', c.id)}>মুছুন</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
