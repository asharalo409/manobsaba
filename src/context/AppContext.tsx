import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Donation, Project, Settings, TableName, Tables } from '../types';
import { dbDelete, dbInsert, dbList, dbSave, dbUpdate, hasSession, isSupabaseConfigured, onAuthChange, signIn, signOut } from '../services/supabase';
import { todayISO, uid } from '../utils/dateUtils';

const TABLES: TableName[] = ['settings', 'projects', 'donations', 'notices', 'blood_donors', 'chat_messages', 'complaints', 'ledger', 'media_links', 'members'];

const EMPTY = Object.fromEntries(TABLES.map((t) => [t, []])) as unknown as Tables;

const DEFAULT_SETTINGS: Settings = {
  id: 'main',
  name_bn: 'মানবসেবা ফাউন্ডেশন',
  name_en: 'Manobseba Foundation',
  tagline_bn: 'মানবতার কল্যাণে নিবেদিত',
  hotline: '01XXXXXXXXX',
  bkash_number: '01XXXXXXXXX',
  nagad_number: '01XXXXXXXXX',
  bank_name: 'ব্যাংকের নাম',
  bank_account_number: '0000000000',
};

interface AppCtx {
  data: Tables;
  settings: Settings;
  loading: boolean;
  isAdmin: boolean;
  demoMode: boolean;
  reload: (t: TableName) => Promise<void>;
  add: (t: TableName, row: Record<string, any>) => Promise<boolean>;
  save: (t: TableName, row: Record<string, any>) => Promise<boolean>;
  remove: (t: TableName, id: string) => Promise<boolean>;
  update: (t: TableName, id: string, patch: Record<string, any>) => Promise<boolean>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  // মডাল নিয়ন্ত্রণ
  donationModal: { projectId?: string } | null;
  openDonation: (projectId?: string) => void;
  closeDonation: () => void;
  receipt: Donation | null;
  showReceipt: (d: Donation | null) => void;
  showLogin: boolean;
  setShowLogin: (v: boolean) => void;
  showSettings: boolean;
  setShowSettings: (v: boolean) => void;
  // অনুদান
  submitDonation: (d: Donation) => Promise<boolean>;
  verifyDonation: (d: Donation) => Promise<void>;
  rejectDonation: (d: Donation) => Promise<void>;
  myReceipts: Donation[];
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp must be used inside AppProvider');
  return c;
}

const MY_KEY = 'mf_my_receipts';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Tables>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [donationModal, setDonationModal] = useState<{ projectId?: string } | null>(null);
  const [receipt, showReceipt] = useState<Donation | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [myReceipts, setMyReceipts] = useState<Donation[]>([]);

  const reload = useCallback(async (t: TableName) => {
    const rows = await dbList(t, t === 'chat_messages');
    setData((d) => ({ ...d, [t]: rows }) as Tables);
  }, []);

  const reloadAll = useCallback(async () => {
    await Promise.all(TABLES.map((t) => reload(t)));
  }, [reload]);

  // লগইন অবস্থা ঠিক করা
  useEffect(() => {
    if (isSupabaseConfigured) {
      hasSession().then(setIsAdmin);
      return onAuthChange(setIsAdmin);
    }
    setIsAdmin(sessionStorage.getItem('mf_demo_admin') === '1');
  }, []);

  // অ্যাডমিন হলে অনুদান/অভিযোগ দেখার জন্য আবার লোড
  useEffect(() => {
    reloadAll().then(() => setLoading(false));
  }, [isAdmin, reloadAll]);

  useEffect(() => {
    try {
      setMyReceipts(JSON.parse(localStorage.getItem(MY_KEY) || '[]'));
    } catch {
      setMyReceipts([]);
    }
  }, []);

  const add: AppCtx['add'] = async (t, row) => {
    const ok = await dbInsert(t, row);
    await reload(t);
    return ok;
  };
  const save: AppCtx['save'] = async (t, row) => {
    const ok = await dbSave(t, row);
    await reload(t);
    return ok;
  };
  const remove: AppCtx['remove'] = async (t, id) => {
    const ok = await dbDelete(t, id);
    await reload(t);
    return ok;
  };
  const update: AppCtx['update'] = async (t, id, patch) => {
    const ok = await dbUpdate(t, id, patch);
    await reload(t);
    return ok;
  };

  const login: AppCtx['login'] = async (email, password) => {
    const err = await signIn(email, password);
    if (!err) {
      if (!isSupabaseConfigured) {
        sessionStorage.setItem('mf_demo_admin', '1');
        setIsAdmin(true);
      }
      setShowLogin(false);
    }
    return err;
  };

  const logout = async () => {
    await signOut();
    sessionStorage.removeItem('mf_demo_admin');
    setIsAdmin(false);
  };

  const submitDonation = async (d: Donation) => {
    const ok = await dbInsert('donations', d);
    if (ok) {
      const next = [d, ...myReceipts];
      setMyReceipts(next);
      localStorage.setItem(MY_KEY, JSON.stringify(next));
      if (isAdmin) await reload('donations');
    }
    return ok;
  };

  // অ্যাডমিন টাকা পাওয়া নিশ্চিত করলে: অনুদান verified + প্রজেক্টের জমা বাড়ে + খাতায় আয় যোগ হয়
  const verifyDonation = async (d: Donation) => {
    await dbUpdate('donations', d.id, { status: 'verified' });
    if (d.project_id) {
      const p = data.projects.find((x: Project) => x.id === d.project_id);
      if (p) {
        await dbUpdate('projects', p.id, {
          raised_amount: Number(p.raised_amount) + Number(d.amount),
          donor_count: Number(p.donor_count) + 1,
        });
      }
    }
    await dbInsert('ledger', { id: uid(), type: 'income', title_bn: `অনুদান - ${d.donor_name} (${d.receipt_no})`, amount: d.amount, date: todayISO() });
    await Promise.all([reload('donations'), reload('projects'), reload('ledger')]);
  };

  const rejectDonation = async (d: Donation) => {
    await dbUpdate('donations', d.id, { status: 'rejected' });
    await reload('donations');
  };

  const value: AppCtx = {
    data,
    settings: data.settings[0] || DEFAULT_SETTINGS,
    loading,
    isAdmin,
    demoMode: !isSupabaseConfigured,
    reload,
    add,
    save,
    remove,
    update,
    login,
    logout,
    donationModal,
    openDonation: (projectId) => setDonationModal({ projectId }),
    closeDonation: () => setDonationModal(null),
    receipt,
    showReceipt,
    showLogin,
    setShowLogin,
    showSettings,
    setShowSettings,
    submitDonation,
    verifyDonation,
    rejectDonation,
    myReceipts,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
