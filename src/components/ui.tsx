import React from 'react';

export const inputCls =
  'w-full border border-stone-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500';
export const btnPrimary =
  'bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg px-4 py-2 transition disabled:opacity-50';
export const btnAccent =
  'bg-amber-500 hover:bg-amber-600 text-stone-900 font-semibold rounded-lg px-4 py-2 transition';
export const btnGhost = 'border border-stone-300 hover:bg-stone-100 rounded-lg px-4 py-2 transition';
export const btnDanger = 'bg-red-50 text-red-700 hover:bg-red-100 rounded-lg px-3 py-1 text-sm';

export function Container({ children }: { children: React.ReactNode }) {
  return <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>;
}

export function PageHeader({ icon, title, desc }: { icon: string; title: string; desc?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold text-emerald-900">
        <span className="mr-2">{icon}</span>
        {title}
      </h2>
      {desc && <p className="text-stone-500 mt-1">{desc}</p>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <span className="block text-sm font-medium text-stone-700 mb-1">{label}</span>
      {children}
    </label>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="text-center text-stone-500 border border-dashed border-stone-300 rounded-xl py-10">{text}</div>;
}

export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 sm:p-4" onClick={onClose}>
      <div
        className={`bg-white w-full ${wide ? 'sm:max-w-2xl' : 'sm:max-w-lg'} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-5 py-3 flex items-center justify-between">
          <h3 className="font-bold text-lg">{title}</h3>
          <button onClick={onClose} className="text-2xl leading-none text-stone-500 px-2" aria-label="বন্ধ করুন">
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
