import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BLOOD_GROUPS } from '../utils/rooms';
import { toBn, uid } from '../utils/dateUtils';
import { Container, Empty, Field, PageHeader, btnDanger, btnPrimary, inputCls } from './ui';

export function BloodBankSection() {
  const { data, isAdmin, add, remove } = useApp();
  const [group, setGroup] = useState('');
  const [district, setDistrict] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fGroup, setFGroup] = useState('O+');
  const [fDistrict, setFDistrict] = useState('');
  const [msg, setMsg] = useState('');

  const list = data.blood_donors.filter((d) => (!group || d.blood_group === group) && (!district || d.district.includes(district)));

  const submit = async () => {
    if (!name.trim() || !phone.trim() || !fDistrict.trim()) return setMsg('নাম, ফোন ও জেলা দিন');
    const ok = await add('blood_donors', { id: uid(), name_bn: name.trim(), blood_group: fGroup, district: fDistrict.trim(), phone: phone.trim() });
    setMsg(ok ? '✅ আপনাকে রক্তদাতা তালিকায় যোগ করা হয়েছে' : '❌ যোগ হয়নি');
    if (ok) { setName(''); setPhone(''); setFDistrict(''); }
  };

  return (
    <Container>
      <PageHeader icon="🩸" title="রক্তদান নেটওয়ার্ক" desc="জরুরি রক্ত দরকার হলে দাতা খুঁজুন, অথবা নিজেই দাতা হিসেবে যোগ দিন।" />
      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <select className={inputCls} value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">সব রক্তের গ্রুপ</option>
          {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
        </select>
        <input className={inputCls} placeholder="জেলা দিয়ে খুঁজুন" value={district} onChange={(e) => setDistrict(e.target.value)} />
      </div>

      {list.length === 0 && <Empty text="এই শর্তে কোনো দাতা পাওয়া যায়নি।" />}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((d) => (
          <div key={d.id} className="bg-white border rounded-xl p-4 flex items-center gap-3">
            <div className="h-12 w-12 shrink-0 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">{d.blood_group}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{d.name_bn}</div>
              <div className="text-sm text-stone-500">{d.district}</div>
              <a className="text-sm text-emerald-700" href={`tel:${d.phone}`}>📞 {d.phone}</a>
            </div>
            {isAdmin && <button className={btnDanger} onClick={() => confirm('মুছবেন?') && remove('blood_donors', d.id)}>মুছুন</button>}
          </div>
        ))}
      </div>
      <p className="text-sm text-stone-500 mt-2">মোট দাতা: {toBn(data.blood_donors.length)} জন</p>

      <div className="bg-white border rounded-xl p-4 mt-6">
        <h3 className="font-bold mb-1">রক্তদাতা হিসেবে যোগ দিন</h3>
        <p className="text-xs text-stone-500 mb-3">আপনার নাম ও ফোন নম্বর সবাই দেখতে পারবে। রাজি থাকলেই যোগ দিন।</p>
        <Field label="নাম"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="ফোন"><input className={inputCls} inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field label="রক্তের গ্রুপ">
          <select className={inputCls} value={fGroup} onChange={(e) => setFGroup(e.target.value)}>{BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}</select>
        </Field>
        <Field label="জেলা"><input className={inputCls} value={fDistrict} onChange={(e) => setFDistrict(e.target.value)} /></Field>
        {msg && <p className="text-sm mb-2">{msg}</p>}
        <button className={btnPrimary} onClick={submit}>তালিকায় যোগ দিন</button>
      </div>
    </Container>
  );
}
