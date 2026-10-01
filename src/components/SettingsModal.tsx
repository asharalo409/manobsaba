import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings } from '../types';
import { Field, Modal, btnPrimary, inputCls } from './ui';

const FIELDS: [keyof Settings, string][] = [
  ['name_bn', 'সংস্থার নাম (বাংলা)'],
  ['name_en', 'সংস্থার নাম (ইংরেজি)'],
  ['tagline_bn', 'স্লোগান'],
  ['hotline', 'হটলাইন নম্বর'],
  ['bkash_number', 'বিকাশ নম্বর'],
  ['nagad_number', 'নগদ নম্বর'],
  ['bank_name', 'ব্যাংকের নাম'],
  ['bank_account_number', 'ব্যাংক একাউন্ট নম্বর'],
  ['logo_url', 'লোগোর ছবির লিংক'],
  ['cover_photo_url', 'কভার ছবির লিংক'],
];

export function SettingsModal() {
  const { showSettings, setShowSettings, settings, save, isAdmin } = useApp();
  const [form, setForm] = useState<Settings>(settings);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (showSettings) setForm(settings);
  }, [showSettings, settings]);

  if (!showSettings || !isAdmin) return null;

  const submit = async () => {
    const ok = await save('settings', { ...form, id: 'main' });
    setMsg(ok ? '✅ সেভ হয়েছে' : '❌ সেভ হয়নি (লগইন ঠিক আছে কিনা দেখুন)');
    if (ok) setTimeout(() => setShowSettings(false), 700);
  };

  return (
    <Modal title="⚙️ সংস্থার সেটিংস" onClose={() => setShowSettings(false)}>
      {FIELDS.map(([k, label]) => (
        <Field key={k} label={label}>
          <input className={inputCls} value={(form[k] as string) || ''} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
        </Field>
      ))}
      {msg && <p className="text-sm mb-2">{msg}</p>}
      <button className={btnPrimary + ' w-full'} onClick={submit}>
        সেভ করুন
      </button>
    </Modal>
  );
}
