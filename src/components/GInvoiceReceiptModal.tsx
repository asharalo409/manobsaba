import { useApp } from '../context/AppContext';
import { money, formatDate } from '../utils/dateUtils';
import { Modal, btnGhost, btnPrimary } from './ui';

const STATUS: Record<string, string> = { pending: '⏳ যাচাই অপেক্ষমাণ', verified: '✅ যাচাইকৃত', rejected: '❌ বাতিল' };
const METHOD: Record<string, string> = { bkash: 'বিকাশ', nagad: 'নগদ', bank: 'ব্যাংক' };

export function InvoiceReceiptModal() {
  const { receipt, showReceipt, settings } = useApp();
  if (!receipt) return null;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(receipt.receipt_no)}`;
  const Row = ({ k, v }: { k: string; v: string }) => (
    <div className="flex justify-between gap-4 py-1.5 border-b border-stone-100 text-sm">
      <span className="text-stone-500">{k}</span>
      <span className="font-medium text-right">{v}</span>
    </div>
  );
  return (
    <Modal title="🧾 মানি রিসিট" onClose={() => showReceipt(null)}>
      <div id="printable-receipt" className="p-2">
        <div className="text-center mb-3">
          <div className="text-xl font-bold text-emerald-900">{settings.name_bn}</div>
          <div className="text-xs text-stone-500">অনুদান প্রাপ্তি রসিদ</div>
        </div>
        <Row k="রসিদ নং" v={receipt.receipt_no} />
        <Row k="তারিখ" v={`${formatDate(receipt.date)}, ${receipt.time}`} />
        <Row k="দাতার নাম" v={receipt.donor_name} />
        <Row k="ফোন" v={receipt.donor_phone} />
        <Row k="খাত" v={receipt.project_title} />
        <Row k="মাধ্যম" v={METHOD[receipt.payment_method]} />
        <Row k="TrxID" v={receipt.trx_id} />
        <Row k="অবস্থা" v={STATUS[receipt.status]} />
        <div className="flex items-center justify-between mt-4">
          <div className="text-2xl font-bold text-emerald-800">{money(receipt.amount)}</div>
          <img src={qr} alt="QR" width={90} height={90} />
        </div>
        <p className="text-xs text-stone-500 mt-3 text-center">আপনার দানের জন্য আন্তরিক ধন্যবাদ। আল্লাহ কবুল করুন।</p>
      </div>
      <div className="flex gap-2 mt-4">
        <button className={btnPrimary + ' flex-1'} onClick={() => window.print()}>🖨 প্রিন্ট করুন</button>
        <button className={btnGhost} onClick={() => showReceipt(null)}>বন্ধ</button>
      </div>
    </Modal>
  );
}
