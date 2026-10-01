import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { uid } from '../utils/dateUtils';
import { Container, Empty, Field, PageHeader, btnDanger, btnPrimary, inputCls } from './ui';

export function MembersDirectory() {
  const { data, isAdmin, add, remove } = useApp();
  const [name, setName] = useState('');
  const [desig, setDesig] = useState('');
  const [district, setDistrict] = useState('');

  const submit = async () => {
    if (!name.trim() || !desig.trim()) return alert('নাম ও পদবি দিন');
    const ok = await add('members', { id: uid(), name_bn: name.trim(), designation_bn: desig.trim(), district: district.trim() || null });
    if (ok) { setName(''); setDesig(''); setDistrict(''); } else alert('যোগ হয়নি। অ্যাডমিন লগইন দেখুন।');
  };

  return (
    <Container>
      <PageHeader icon="👥" title="কর্মকর্তা ও সদস্য" desc="আমাদের পরিবারের সদস্যরা" />
      {isAdmin && (
        <div className="bg-white border rounded-xl p-4 mb-5">
          <h3 className="font-bold mb-2">নতুন সদস্য যোগ করুন</h3>
          <Field label="নাম"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="পদবি"><input className={inputCls} value={desig} onChange={(e) => setDesig(e.target.value)} /></Field>
          <Field label="জেলা"><input className={inputCls} value={district} onChange={(e) => setDistrict(e.target.value)} /></Field>
          <button className={btnPrimary} onClick={submit}>যোগ করুন</button>
          <p className="text-xs text-stone-500 mt-3">নতুন অ্যাডমিন (লগইন করার অধিকার) বানাতে হলে Supabase ড্যাশবোর্ডের Authentication › Users থেকে ইউজার যোগ করুন।</p>
        </div>
      )}
      {data.members.length === 0 && <Empty text="এখনো কোনো সদস্য যোগ হয়নি।" />}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {data.members.map((m) => (
          <div key={m.id} className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">{m.name_bn.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{m.name_bn}</div>
              <div className="text-sm text-emerald-700">{m.designation_bn}</div>
              {m.district && <div className="text-xs text-stone-500">{m.district}</div>}
            </div>
            {isAdmin && <button className={btnDanger} onClick={() => confirm('মুছবেন?') && remove('members', m.id)}>মুছুন</button>}
          </div>
        ))}
      </div>
    </Container>
  );
}
