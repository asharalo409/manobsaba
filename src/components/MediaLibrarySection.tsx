import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MediaLink } from '../types';
import { uid } from '../utils/dateUtils';
import { Container, Empty, Field, PageHeader, btnDanger, btnPrimary, inputCls } from './ui';

const KIND: Record<string, string> = { facebook: '📘 ফেসবুক', youtube: '▶️ ইউটিউব', audio: '🎧 অডিও', video: '🎬 ভিডিও' };

function youtubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function Item({ m }: { m: MediaLink }) {
  if (m.kind === 'youtube') {
    const id = youtubeId(m.url);
    if (id) return <iframe className="w-full aspect-video rounded-lg" src={`https://www.youtube.com/embed/${id}`} title={m.title_bn} allowFullScreen />;
  }
  if (m.kind === 'audio') return <audio controls className="w-full" src={m.url} />;
  if (m.kind === 'video') return <video controls className="w-full rounded-lg" src={m.url} />;
  return <a href={m.url} target="_blank" rel="noreferrer" className="inline-block text-emerald-700 underline break-all">{m.url}</a>;
}

export function MediaLibrarySection() {
  const { data, isAdmin, add, remove } = useApp();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [kind, setKind] = useState<MediaLink['kind']>('youtube');

  const submit = async () => {
    if (!title.trim() || !url.trim()) return alert('নাম ও লিংক দিন');
    const ok = await add('media_links', { id: uid(), title_bn: title, kind, url: url.trim() });
    if (ok) { setTitle(''); setUrl(''); } else alert('যোগ হয়নি। অ্যাডমিন লগইন দেখুন।');
  };

  return (
    <Container>
      <PageHeader icon="🎬" title="মিডিয়া লাইব্রেরি" desc="ফেসবুক, ইউটিউব, অডিও ও ভিডিও" />
      {isAdmin && (
        <div className="bg-white border rounded-xl p-4 mb-5">
          <h3 className="font-bold mb-2">নতুন মিডিয়া যোগ করুন</h3>
          <Field label="নাম"><input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="ধরন">
            <select className={inputCls} value={kind} onChange={(e) => setKind(e.target.value as MediaLink['kind'])}>
              {Object.entries(KIND).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </Field>
          <Field label="লিংক"><input className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
          <button className={btnPrimary} onClick={submit}>যোগ করুন</button>
        </div>
      )}
      {data.media_links.length === 0 && <Empty text="এখনো কোনো মিডিয়া নেই।" />}
      <div className="grid gap-4 md:grid-cols-2">
        {data.media_links.map((m) => (
          <div key={m.id} className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div><div className="text-xs text-stone-500">{KIND[m.kind]}</div><div className="font-semibold">{m.title_bn}</div></div>
              {isAdmin && <button className={btnDanger} onClick={() => confirm('মুছবেন?') && remove('media_links', m.id)}>মুছুন</button>}
            </div>
            <Item m={m} />
          </div>
        ))}
      </div>
    </Container>
  );
}
