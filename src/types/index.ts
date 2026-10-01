export interface Settings {
  id: string;
  name_bn: string;
  name_en: string;
  tagline_bn: string;
  logo_url?: string | null;
  cover_photo_url?: string | null;
  hotline: string;
  bkash_number: string;
  nagad_number: string;
  bank_name: string;
  bank_account_number: string;
}

export interface Project {
  id: string;
  title_bn: string;
  category: string;
  description_bn: string;
  target_amount: number;
  raised_amount: number;
  donor_count: number;
  status: 'ongoing' | 'completed';
  location_bn: string;
  image_url?: string | null;
  coordinator?: string | null;
  created_at?: string;
}

export interface Donation {
  id: string;
  receipt_no: string;
  donor_name: string;
  donor_phone: string;
  amount: number;
  project_id?: string | null;
  project_title: string;
  payment_method: 'bkash' | 'nagad' | 'bank';
  trx_id: string;
  date: string;
  time: string;
  status: 'pending' | 'verified' | 'rejected';
  created_at?: string;
}

export type NoticeCategory = 'sports' | 'food' | 'donation' | 'urgent' | 'blood' | 'meeting' | 'other';

export interface Notice {
  id: string;
  title_bn: string;
  category: NoticeCategory;
  content_bn: string;
  date: string;
  is_urgent: boolean;
  created_at?: string;
}

export interface BloodDonor {
  id: string;
  name_bn: string;
  blood_group: string;
  district: string;
  phone: string;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  sender_name: string;
  message: string;
  channel: string;
  created_at?: string;
}

export interface Complaint {
  id: string;
  tracking_no: string;
  subject: string;
  details: string;
  contact?: string | null;
  status: 'pending' | 'processing' | 'resolved';
  date: string;
  created_at?: string;
}

export interface LedgerEntry {
  id: string;
  type: 'income' | 'expense';
  title_bn: string;
  amount: number;
  date: string;
  created_at?: string;
}

export interface MediaLink {
  id: string;
  title_bn: string;
  kind: 'facebook' | 'youtube' | 'audio' | 'video';
  url: string;
  created_at?: string;
}

export interface Member {
  id: string;
  name_bn: string;
  designation_bn: string;
  district?: string | null;
  created_at?: string;
}

export interface Tables {
  settings: Settings[];
  projects: Project[];
  donations: Donation[];
  notices: Notice[];
  blood_donors: BloodDonor[];
  chat_messages: ChatMessage[];
  complaints: Complaint[];
  ledger: LedgerEntry[];
  media_links: MediaLink[];
  members: Member[];
}

export type TableName = keyof Tables;
