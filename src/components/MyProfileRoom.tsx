import { useApp } from '../context/AppContext';
import { formatDate, money } from '../utils/dateUtils';
import { Container, Empty, PageHeader, btnGhost } from './ui';

export function MyProfileRoom() {
  const { myReceipts, showReceipt } = useApp();
  return (
    <Container>
      <PageHeader icon="🧾" title="আমার রসিদ" desc="এই ফোন/ব্রাউজার থেকে আপনার দেওয়া অনুদানের রসিদ। ব্রাউজারের ডাটা মুছলে এগুলোও মুছে যাবে।" />
      {myReceipts.length === 0 && <Empty text="আপনি এখনো কোনো অনুদান দেননি।" />}
      <div className="space-y-3">
        {myReceipts.map((r) => (
          <div key={r.id} className="bg-white border rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold">{r.receipt_no}</div>
              <div className="text-sm text-stone-500">{formatDate(r.date)} • {r.project_title}</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-emerald-800">{money(r.amount)}</div>
              <button className={btnGhost + ' mt-1 text-sm'} onClick={() => showReceipt(r)}>রসিদ দেখুন</button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
} 
