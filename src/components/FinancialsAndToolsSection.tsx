import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatDate, money, todayISO, uid } from '../utils/dateUtils';
import { Container, Empty, Field, PageHeader, btnDanger, btnGhost, btnPrimary, inputCls } from './ui';

function ZakatCalculator() {
  const [v, setV] = useState({ cash: '', gold: '', silver: '', business: '', debt: '' });
  const n = (s: string) => Number(s) || 0;
  const net = n(v.cash) + n(v.gold) + n(v.silver) + n(v.business) - n(v.debt);
  const zakat = net > 0 ? net * 0.025 : 0;
  const rows: [keyof typeof v, string][] = [['cash', 'নগদ ও ব্যাংকে জমা'], ['gold', 'স্বর্ণের বাজারমূল্য'], ['silver', 'রূপার বাজারমূল্য'], ['business', 'ব্যবসার পণ্য/বিনিয়োগ'], ['debt', 'বাদ যাবে: ঋণ']];
  return (
    <div className="bg-white border rounded-xl p-4">
      <h3 className="font-bold mb-3">🕌 যাকাত ক্যালকুলেটর</h3>
      {rows.map(([k, label]) => (
        <Field key={k} label={label}><input className={inputCls} inputMode="numeric" value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} /></Field>
      ))}
      <div className="bg-emerald-50 rounded-lg p-3">
        <div className="text-sm">নিট সম্পদ: {money(Math.max(net, 0))}</div>
        <div className="font-bold text-emerald-800 text-lg">যাকাত (২.৫%): {money(Math.round(zakat))}</div>
        <div className="text-xs text-stone-500 mt-1">নিসাব পূর্ণ হয়েছে কিনা ও চূড়ান্ত হিসাব আলেমের কাছ থেকে নিশ্চিত হয়ে নিন।</div>
      </div>
    </div>
  );
}

function BasicCalculator() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState('+');
  const x = Number(a), y = Number(b);
  const r = op === '+' ? x + y : op === '-' ? x - y : op === '×' ? x * y : y === 0 ? NaN : x / y;
  return (
    <div className="bg-white border rounded-xl p-4">
      <h3 className="font-bold mb-3">🧮 সাধারণ ক্যালকুলেটর</h3>
      <div className="flex gap-2 items-center">
        <input className={inputCls} inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} />
        <select className="border rounded-lg px-2 py-2" value={op} onChange={(e) => setOp(e.target.value)}>{['+', '-', '×', '÷'].map((o) => <option key={o}>{o}</option>)}</select>
        <input className={inputCls} inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      <div className="mt-3 text-xl font-bold text-emerald-800">= {a !== '' && b !== '' && isFinite(r) ? r.toLocaleString('bn-BD') : '—'}</div>
    </div>
  );
}

export function FinancialsAndToolsSection() {
  const { data, isAdmin, add, remove, verifyDonation, rejectDonation, showReceipt } = useApp();
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const income = data.ledger.filter((l) => l.type === 'income').reduce((s, l) => s + Number(l.amount), 0);
  const expense = data.ledger.filter((l) => l.type === 'expense').reduce((s, l) => s + Number(l.amount), 0);
  const pending = data.donations.filter((d) => d.status === 'pending');

  const submit = async () => {
    if (!title.trim() || !(Number(amount) > 0)) return alert('বিবরণ ও টাকার পরিমাণ দিন');
    const ok = await add('ledger', { id: uid(), type, title_bn: title, amount: Number(amount), date: todayISO() });
    if (ok) { setTitle(''); setAmount(''); } else alert('যোগ হয়নি। অ্যাডমিন লগইন দেখুন।');
  };

  return (
    <Container>
      <PageHeader icon="💰" title="হিসাব ও টুলস" desc="আয়-ব্যয়ের খোলা খাতা, স্বচ্ছতার জন্য সবার জন্য উন্মুক্ত।" />
      <div className="grid grid-cols-3 gap-3 mb-5 text-center">
        <div className="bg-white border rounded-xl p-3"><div className="text-xs text-stone-500">মোট আয়</div><div className="font-bold text-emerald-700">{money(income)}</div></div>
        <div className="bg-white border rounded-xl p-3"><div className="text-xs text-stone-500">মোট ব্যয়</div><div className="font-bold text-red-600">{money(expense)}</div></div>
        <div className="bg-white border rounded-xl p-3"><div className="text-xs text-stone-500">বর্তমান জমা</div><div className="font-bold">{money(income - expense)}</div></div>
      </div>

      {isAdmin && (
        <>
          <div className="bg-white border rounded-xl p-4 mb-5">
            <h3 className="font-bold mb-2">যাচাইয়ের অপেক্ষায় অনুদান</h3>
            {pending.length === 0 ? <p className="text-sm text-stone-500">কোনো অপেক্ষমাণ অনুদান নেই।</p> : pending.map((d) => (
              <div key={d.id} className="border-t py-3 text-sm">
                <div className="font-semibold">{d.donor_name} • {money(d.amount)} • {d.payment_method}</div>
                <div className="text-stone-500">TrxID: {d.trx_id} • ফোন: {d.donor_phone} • {d.project_title}</div>
                <div className="flex gap-2 mt-2">
                  <button className={btnPrimary} onClick={() => verifyDonation(d)}>✅ টাকা পেয়েছি, যাচাই করুন</button>
                  <button className={btnDanger} onClick={() => confirm('বাতিল করবেন?') && rejectDonation(d)}>বাতিল</button>
                  <button className={btnGhost} onClick={() => showReceipt(d)}>রসিদ</button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border rounded-xl p-4 mb-5">
            <h3 className="font-bold mb-2">খাতায় নতুন এন্ট্রি</h3>
            <Field label="ধরন">
              <select className={inputCls} value={type} onChange={(e) => setType(e.target.value as 'income' | 'expense')}>
                <option value="income">আয়</option>
                <option value="expense">ব্যয়</option>
              </select>
            </Field>
            <Field label="বিবরণ"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
            <Field label="টাকা"><input className={inputCls} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
            <button className={btnPrimary} onClick={submit}>খাতায় যোগ করুন</button>
          </div>
        </>
      )}

      <h3 className="font-bold text-emerald-900 mb-2">ক্যাশিয়ার খাতা</h3>
      {data.ledger.length === 0 && <Empty text="খাতায় কোনো এন্ট্রি নেই।" />}
      <div className="bg-white border rounded-xl divide-y mb-6">
        {data.ledger.map((l) => (
          <div key={l.id} className="flex items-center justify-between gap-2 p-3 text-sm">
            <div><div className="font-medium">{l.title_bn}</div><div className="text-xs text-stone-500">{formatDate(l.date)}</div></div>
            <div className="flex items-center gap-2">
              <span className={l.type === 'income' ? 'text-emerald-700 font-semibold' : 'text-red-600 font-semibold'}>{l.type === 'income' ? '+' : '-'}{money(l.amount)}</span>
              {isAdmin && <button className={btnDanger} onClick={() => confirm('মুছবেন?') && remove('ledger', l.id)}>মুছুন</button>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2"><ZakatCalculator /><BasicCalculator /></div>
    </Container>
  );
}
