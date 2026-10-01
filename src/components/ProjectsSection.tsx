import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';
import { money, toBn, uid } from '../utils/dateUtils';
import { Container, Empty, Field, Modal, PageHeader, btnAccent, btnDanger, btnGhost, btnPrimary, inputCls } from './ui';

const blank = { title_bn: '', category: '', description_bn: '', target_amount: '', raised_amount: '0', location_bn: '', status: 'ongoing', image_url: '', coordinator: '' };

function ProjectForm({ initial, onClose }: { initial: Project | null; onClose: () => void }) {
  const { save } = useApp();
  const [f, setF] = useState<any>(initial ? { ...initial } : { ...blank });
  const set = (k: string, v: string) => setF({ ...f, [k]: v });
  const submit = async () => {
    if (!f.title_bn.trim()) return alert('প্রজেক্টের নাম দিন');
    const row = {
      id: initial?.id || uid(),
      title_bn: f.title_bn,
      category: f.category || 'সাধারণ',
      description_bn: f.description_bn || '',
      target_amount: Number(f.target_amount) || 0,
      raised_amount: Number(f.raised_amount) || 0,
      donor_count: initial?.donor_count || 0,
      status: f.status,
      location_bn: f.location_bn || '',
      image_url: f.image_url || null,
      coordinator: f.coordinator || null,
    };
    if (await save('projects', row)) onClose();
    else alert('সেভ হয়নি। অ্যাডমিন হিসেবে লগইন আছে কিনা দেখুন।');
  };
  return (
    <Modal title={initial ? 'প্রজেক্ট এডিট' : 'নতুন প্রজেক্ট'} onClose={onClose}>
      <Field label="নাম"><input className={inputCls} value={f.title_bn} onChange={(e) => set('title_bn', e.target.value)} /></Field>
      <Field label="ধরন (যেমন: ত্রাণ, শিক্ষা)"><input className={inputCls} value={f.category} onChange={(e) => set('category', e.target.value)} /></Field>
      <Field label="বিবরণ"><textarea className={inputCls} rows={3} value={f.description_bn} onChange={(e) => set('description_bn', e.target.value)} /></Field>
      <Field label="লক্ষ্যমাত্রা (টাকা)"><input className={inputCls} inputMode="numeric" value={f.target_amount} onChange={(e) => set('target_amount', e.target.value)} /></Field>
      <Field label="এ পর্যন্ত জমা (টাকা)"><input className={inputCls} inputMode="numeric" value={f.raised_amount} onChange={(e) => set('raised_amount', e.target.value)} /></Field>
      <Field label="স্থান"><input className={inputCls} value={f.location_bn} onChange={(e) => set('location_bn', e.target.value)} /></Field>
      <Field label="সমন্বয়কারী"><input className={inputCls} value={f.coordinator || ''} onChange={(e) => set('coordinator', e.target.value)} /></Field>
      <Field label="ছবির লিংক (ঐচ্ছিক)"><input className={inputCls} value={f.image_url || ''} onChange={(e) => set('image_url', e.target.value)} /></Field>
      <Field label="অবস্থা">
        <select className={inputCls} value={f.status} onChange={(e) => set('status', e.target.value)}>
          <option value="ongoing">চলমান</option>
          <option value="completed">সমাপ্ত</option>
        </select>
      </Field>
      <button className={btnPrimary + ' w-full'} onClick={submit}>সেভ করুন</button>
    </Modal>
  );
}

export function ProjectsSection() {
  const { data, isAdmin, openDonation, remove } = useApp();
  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <Container>
      <PageHeader icon="🤝" title="প্রজেক্ট ও অনুদান" desc="আমাদের চলমান ও সমাপ্ত কাজ। অনুদান দিয়ে পাশে থাকুন।" />
      {isAdmin && (
        <button className={btnPrimary + ' mb-4'} onClick={() => { setEditing(null); setShowForm(true); }}>+ নতুন প্রজেক্ট</button>
      )}
      {data.projects.length === 0 && <Empty text="এখনো কোনো প্রজেক্ট নেই।" />}
      <div className="grid gap-4 md:grid-cols-2">
        {data.projects.map((p) => {
          const pct = p.target_amount > 0 ? Math.min(100, Math.round((p.raised_amount / p.target_amount) * 100)) : 0;
          return (
            <div key={p.id} className="bg-white border rounded-xl overflow-hidden">
              {p.image_url && <img src={p.image_url} alt={p.title_bn} className="h-40 w-full object-cover" />}
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="bg-emerald-100 text-emerald-800 rounded px-2 py-0.5">{p.category}</span>
                  <span className={p.status === 'ongoing' ? 'text-amber-700' : 'text-stone-500'}>{p.status === 'ongoing' ? 'চলমান' : 'সমাপ্ত'}</span>
                  {p.location_bn && <span className="text-stone-500">📍 {p.location_bn}</span>}
                </div>
                <h3 className="font-bold text-lg">{p.title_bn}</h3>
                <p className="text-sm text-stone-600 mt-1">{p.description_bn}</p>
                <div className="mt-3 h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600" style={{ width: pct + '%' }} />
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>{money(p.raised_amount)} / {money(p.target_amount)}</span>
                  <span>{toBn(pct)}% • {toBn(p.donor_count)} জন দাতা</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {p.status === 'ongoing' && <button className={btnAccent} onClick={() => openDonation(p.id)}>💝 অনুদান দিন</button>}
                  {isAdmin && (
                    <>
                      <button className={btnGhost} onClick={() => { setEditing(p); setShowForm(true); }}>এডিট</button>
                      <button className={btnDanger} onClick={() => confirm('মুছে ফেলবেন?') && remove('projects', p.id)}>মুছুন</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {showForm && <ProjectForm initial={editing} onClose={() => setShowForm(false)} />}
    </Container>
  );
}
