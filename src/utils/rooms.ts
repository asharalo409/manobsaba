export const ROOMS = [
  { id: 'home', icon: '🏠', label: 'হোম', desc: 'মূল পাতা' },
  { id: 'projects', icon: '🤝', label: 'প্রজেক্ট ও অনুদান', desc: 'চলমান কাজ দেখুন ও অনুদান দিন' },
  { id: 'notices', icon: '📢', label: 'নোটিশ বোর্ড', desc: 'খেলা, খাওয়া, সভা ও জরুরি ঘোষণা' },
  { id: 'calendar', icon: '📅', label: 'ক্যালেন্ডার', desc: 'বাংলা, হিজরি ও ইংরেজি তারিখ' },
  { id: 'blood', icon: '🩸', label: 'রক্তদান', desc: 'রক্তদাতা খুঁজুন বা তালিকায় যোগ দিন' },
  { id: 'finance', icon: '💰', label: 'হিসাব ও টুলস', desc: 'আয়-ব্যয়ের খাতা, যাকাত ক্যালকুলেটর' },
  { id: 'media', icon: '🎬', label: 'মিডিয়া', desc: 'ফেসবুক, ইউটিউব, অডিও ও ভিডিও' },
  { id: 'chat', icon: '💬', label: 'চ্যাট', desc: 'সবার জন্য খোলা আলোচনা' },
  { id: 'complaints', icon: '📝', label: 'অভিযোগ ও পরামর্শ', desc: 'আপনার মতামত জানান' },
  { id: 'members', icon: '👥', label: 'সদস্য', desc: 'কর্মকর্তা ও সদস্যদের তালিকা' },
  { id: 'profile', icon: '🧾', label: 'আমার রসিদ', desc: 'আপনার দেওয়া অনুদানের রসিদ' },
];

export const NOTICE_CATS: Record<string, string> = {
  urgent: '🚨 জরুরি',
  blood: '🩸 রক্ত',
  donation: '💝 দান',
  meeting: '🗓 সভা',
  food: '🍲 খাওয়া',
  sports: '⚽ খেলা',
  other: '📌 অন্যান্য',
};

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
