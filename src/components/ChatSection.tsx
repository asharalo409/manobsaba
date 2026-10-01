import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { uid } from '../utils/dateUtils';
import { Container, PageHeader, btnDanger, btnPrimary, inputCls } from './ui';

const CHANNELS: Record<string, string> = { general: '💬 সাধারণ আলোচনা', help: '🆘 সাহায্য চাই' };

export function ChatSection() {
  const { data, isAdmin, add, remove, reload } = useApp();
  const [channel, setChannel] = useState('general');
  const [name, setName] = useState(localStorage.getItem('mf_chat_name') || '');
  const [text, setText] = useState('');
  const bottom = useRef<HTMLDivElement>(null);

  // প্রতি ৫ সেকেন্ডে নতুন মেসেজ আনা হয়
  useEffect(() => {
    const t = setInterval(() => reload('chat_messages'), 5000);
    return () => clearInterval(t);
  }, [reload]);

  const list = data.chat_messages.filter((m) => m.channel === channel).slice(-100);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [list.length, channel]);

  const send = async () => {
    if (!text.trim()) return;
    if (!name.trim()) return alert('আগে আপনার নাম লিখুন');
    localStorage.setItem('mf_chat_name', name.trim());
    const ok = await add('chat_messages', { id: uid(), sender_name: name.trim(), message: text.trim().slice(0, 500), channel });
    if (ok) setText('');
  };

  return (
    <Container>
      <PageHeader icon="💬" title="চ্যাট" desc="এটি সবার জন্য খোলা। ব্যক্তিগত তথ্য (ফোন, পাসওয়ার্ড) এখানে লিখবেন না।" />
      <div className="flex gap-2 mb-3">
        {Object.entries(CHANNELS).map(([k, v]) => (
          <button key={k} onClick={() => setChannel(k)} className={`px-3 py-1.5 rounded-full text-sm border ${channel === k ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white'}`}>{v}</button>
        ))}
      </div>
      <div className="bg-white border rounded-xl h-[55vh] overflow-y-auto p-3 space-y-2">
        {list.length === 0 && <p className="text-center text-stone-400 mt-10">এখনো কোনো মেসেজ নেই। প্রথম মেসেজটি আপনিই দিন।</p>}
        {list.map((m) => (
          <div key={m.id} className="bg-stone-100 rounded-xl px-3 py-2 text-sm">
            <div className="flex justify-between gap-2">
              <span className="font-semibold text-emerald-800">{m.sender_name}</span>
              {isAdmin && <button className={btnDanger} onClick={() => remove('chat_messages', m.id)}>মুছুন</button>}
            </div>
            <div className="whitespace-pre-line break-words">{m.message}</div>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <div className="flex gap-2 mt-3 flex-wrap">
        <input className={inputCls + ' sm:w-40'} placeholder="আপনার নাম" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={inputCls + ' flex-1 min-w-[180px]'} placeholder="মেসেজ লিখুন..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
        <button className={btnPrimary} onClick={send}>পাঠান</button>
      </div>
    </Container>
  );
}
