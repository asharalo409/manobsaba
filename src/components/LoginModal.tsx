import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Field, Modal, btnPrimary, inputCls } from './ui';

export function LoginModal() {
  const { showLogin, setShowLogin, login, demoMode } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!showLogin) return null;

  const submit = async () => {
    setBusy(true);
    setError('');
    const err = await login(email.trim(), password);
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <Modal title="🔐 অ্যাডমিন লগইন" onClose={() => setShowLogin(false)}>
      {demoMode && <p className="text-sm bg-amber-50 text-amber-800 rounded-lg p-2 mb-3">ডেমো মোড: যেকোনো ইমেইল দিন, পাসওয়ার্ড লিখুন demo123</p>}
      <Field label="ইমেইল">
        <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="পাসওয়ার্ড">
        <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
      </Field>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <button className={btnPrimary + ' w-full'} onClick={submit} disabled={busy}>
        {busy ? 'অপেক্ষা করুন...' : 'লগইন করুন'}
      </button>
    </Modal>
  );
}
