// Supabase সংযোগ না থাকলে (ডেমো মোডে) এই নমুনা তথ্য দেখানো হয়
import { TableName } from '../types';

const today = new Date().toISOString().slice(0, 10);

export const SEED: Partial<Record<TableName, any[]>> = {
  settings: [
    {
      id: 'main',
      name_bn: 'মানবসেবা ফাউন্ডেশন',
      name_en: 'Manobseba Foundation',
      tagline_bn: 'মানবতার কল্যাণে নিবেদিত',
      logo_url: '',
      cover_photo_url: '',
      hotline: '01XXXXXXXXX',
      bkash_number: '01XXXXXXXXX',
      nagad_number: '01XXXXXXXXX',
      bank_name: 'ব্যাংকের নাম',
      bank_account_number: '0000000000',
    },
  ],
  projects: [
    { id: 'p1', title_bn: 'বন্যার্তদের জন্য ত্রাণ', category: 'ত্রাণ', description_bn: 'বন্যাকবলিত পরিবারগুলোর জন্য খাবার, পানি ও ওষুধ বিতরণ।', target_amount: 500000, raised_amount: 120000, donor_count: 48, status: 'ongoing', location_bn: 'সিলেট', coordinator: 'সমন্বয়ক' },
    { id: 'p2', title_bn: 'শীতবস্ত্র বিতরণ', category: 'শীত', description_bn: 'অসহায় মানুষের মাঝে কম্বল ও গরম কাপড় বিতরণ।', target_amount: 200000, raised_amount: 200000, donor_count: 90, status: 'completed', location_bn: 'রংপুর', coordinator: 'সমন্বয়ক' },
  ],
  notices: [
    { id: 'n1', title_bn: 'স্বাগতম', category: 'other', content_bn: 'মানবসেবা ফাউন্ডেশনের ওয়েবসাইটে আপনাকে স্বাগতম।', date: today, is_urgent: false },
    { id: 'n2', title_bn: 'মাসিক সভা', category: 'meeting', content_bn: 'এই মাসের সভা শুক্রবার বিকাল ৪টায়।', date: today, is_urgent: false },
  ],
  ledger: [{ id: 'l1', type: 'income', title_bn: 'প্রারম্ভিক তহবিল', amount: 10000, date: today }],
  media_links: [{ id: 'm1', title_bn: 'আমাদের ফেসবুক পেজ', kind: 'facebook', url: 'https://facebook.com' }],
  members: [{ id: 'mb1', name_bn: 'নমুনা সভাপতি', designation_bn: 'সভাপতি', district: 'ঢাকা' }],
  blood_donors: [{ id: 'b1', name_bn: 'নমুনা দাতা', blood_group: 'O+', district: 'ঢাকা', phone: '01XXXXXXXXX' }],
};
