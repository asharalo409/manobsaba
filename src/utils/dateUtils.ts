// বাংলা সংখ্যা, বাংলা (বঙ্গাব্দ), হিজরি ও ইংরেজি তারিখ কনভার্টার

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
export const toBn = (v: string | number): string => String(v).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

export const money = (n: number): string => '৳' + toBn(Number(n || 0).toLocaleString('en-IN'));

export const BN_MONTHS = ['বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন', 'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'];

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

// বাংলাদেশের সংশোধিত বাংলা পঞ্জিকা (১৪ এপ্রিল নববর্ষ)
export function toBanglaDate(d: Date) {
  const y = d.getFullYear();
  const newYearThisYear = new Date(y, 3, 14);
  const startYear = d >= newYearThisYear ? y : y - 1;
  const banglaYear = startYear - 593;
  const diff = Math.floor(
    (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(startYear, 3, 14)) / 86400000
  );
  const lens = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, isLeap(startYear + 1) ? 30 : 29, 30];
  let m = 0;
  let r = diff;
  while (m < 11 && r >= lens[m]) {
    r -= lens[m];
    m++;
  }
  return { day: r + 1, month: BN_MONTHS[m], year: banglaYear };
}

export function banglaDateText(d: Date): string {
  const b = toBanglaDate(d);
  return `${toBn(b.day)} ${b.month} ${toBn(b.year)} বঙ্গাব্দ`;
}

export function hijriDateText(d: Date): string {
  try {
    return new Intl.DateTimeFormat('bn-BD-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(d) + ' হিজরি';
  } catch {
    return '—';
  }
}

export function englishDateText(d: Date): string {
  return d.toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export const todayISO = (): string => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};

export const nowTime = (): string => new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });

export const uid = (): string => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
};
