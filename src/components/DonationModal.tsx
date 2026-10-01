import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Donation } from '../types';
import { nowTime, todayISO, uid } from '../utils/dateUtils';
import { Field, Modal, btnAccent, inputCls } from './ui';

export function DonationModal() {
  const { donationModal, closeDonation, data, settings, submitDonation, showReceipt } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [projectId, setProjectId] = useState<string>('');
  const [method, setMethod] = useState<Donation['payment_method']>('bkash');
  const [trx, setTrx] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (!donationModal) return null;
  const selected = projectId || donationModal.projectId || '';
  const ongoing = data.projects.filter((p) => p.status === 'ongoing');

  const payInfo =
    method === 'bkash'
      ? `বিকাশ (Send Money): ${settings.bkash_number}`
      : method === 'nagad'
      ? `নগদ (Send Money): ${settings.nagad_number}`
      : `${settings.bank_name}, একাউন্ট: ${settings.bank_account_number}`;

  const submit = async () => {
    setError('');
    const amt = Number(amount);
    if (!name.trim() || !phone.trim() || !trx.trim() || !(amt > 0)) {
      setError('নাম, ফোন, টাকার পরিমাণ ও ট্রানজেকশন আইডি সব দিতে হবে');
      return;
    }
    const project = data.projects.find((p) => p.id === selected);
    const d: Donation = {
      id: uid(),
      receipt_no: 'MF-' + todayISO().replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      donor_name: name.trim(),
      donor_phone: phone.trim(),
      amount: amt,
      project_id: project ? project.id : null,
      project_title: project ? project.title_bn : 'সাধারণ তহবিল',
      payment_method: method,
      trx_id: trx.trim(),
      date: todayISO(),
      time: nowTime(),
      status: 'pending',
    };
    setBusy(true);
    const ok = await submitDonation(d);
    setBusy(false);
    if (!ok) {
      setError('জমা হয়নি, আবার চেষ্টা করুন');
      return;
    }
    setName(''); setPhone(''); setAmount(''); setTrx(''); setProjectId('');
    closeDonation();
    showReceipt(d);
  };

  return (
    <Modal title="💝 অনুদান দিন" onClose={closeDonation}>
      <p className="text-sm text-stone-600 mb-3">
        প্রথমে নিচের নম্বরে টাকা পাঠান, তারপর ফর্মটি পূরণ করে ট্রানজেকশন আইডি দিন। আমরা টাকা পাওয়া নিশ্চিত করলে রসিদ "যাচাইকৃত" হবে।
      </p>
      <Field label="কোথায় দিবেন">
        <select className={inputCls} value={selected} onChange={(e) => setProjectId(e.target.value)}>
          <option value="">সাধারণ তহবিল</option>
          {ongoing.map((p) => (
            <option key={p.id} value={p.id}>{p.title_bn}</option>
          ))}
        </select>
      </Field>
      <Field label="পেমেন্ট মাধ্যম">
        <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value as Donation['payment_method'])}>
          <option value="bkash">বিকাশ</option>
          <option value="nagad">নগদ</option>
          <option value="bank">ব্যাংক</option>
        </select>
      </Field>
      <div className="bg-emerald-50 text-emerald-900 rounded-lg p-3 mb-3 text-sm font-medium">{payInfo}</div>
      <Field label="আপনার নাম"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="ফোন নম্বর"><input className={inputCls} inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
      <Field label="টাকার পরিমাণ"><input className={inputCls} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
      <Field label="ট্রানজেকশন আইডি (TrxID)"><input className={inputCls} value={trx} onChange={(e) => setTrx(e.target.value)} /></Field>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <button className={btnAccent + ' w-full'} onClick={submit} disabled={busy}>
        {busy ? 'অপেক্ষা করুন...' : 'অনুদান জমা দিন'}
      </button>
    </Modal>
  );
}
