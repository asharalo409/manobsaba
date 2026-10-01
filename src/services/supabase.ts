import { createClient } from '@supabase/supabase-js';
import { TableName } from '../types';
import { SEED } from './seed';

const url: string = import.meta.env.VITE_SUPABASE_URL || '';
const key: string = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// .env এ URL ও Key দেওয়া থাকলে true হবে, না থাকলে ডেমো মোড (ব্রাউজারে সেভ হয়)
export const isSupabaseConfigured: boolean = Boolean(url && key && url.startsWith('http'));
export const supabase = isSupabaseConfigured ? createClient(url, key) : null;

// ---------- ডেমো মোডের (localStorage) সাহায্যকারী ----------
const lsKey = (t: string) => `mf_${t}`;

function lsWrite(t: string, rows: any[]) {
  try {
    localStorage.setItem(lsKey(t), JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

function lsRead(t: TableName): any[] {
  try {
    const raw = localStorage.getItem(lsKey(t));
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const seed = (SEED[t] || []).map((r, i) => ({ created_at: new Date(Date.now() - i * 1000).toISOString(), ...r }));
  lsWrite(t, seed);
  return seed;
}

// ---------- ডাটাবেজ ফাংশন ----------
export async function dbList(t: TableName, ascending = false): Promise<any[]> {
  if (supabase) {
    const { data, error } = await supabase.from(t).select('*').order('created_at', { ascending });
    if (error) {
      console.error(t, error.message);
      return [];
    }
    return data || [];
  }
  const rows = lsRead(t);
  return [...rows].sort((a, b) => (a.created_at > b.created_at ? 1 : -1) * (ascending ? 1 : -1));
}

// নতুন তথ্য যোগ (সবাই পারবে যেখানে অনুমতি আছে)
export async function dbInsert(t: TableName, row: Record<string, any>): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.from(t).insert(row);
    if (error) console.error(t, error.message);
    return !error;
  }
  lsWrite(t, [...lsRead(t), { created_at: new Date().toISOString(), ...row }]);
  return true;
}

// তৈরি বা আপডেট (শুধু অ্যাডমিন)
export async function dbSave(t: TableName, row: Record<string, any>): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.from(t).upsert(row);
    if (error) console.error(t, error.message);
    return !error;
  }
  const rows = lsRead(t);
  const i = rows.findIndex((r) => r.id === row.id);
  if (i >= 0) rows[i] = { ...rows[i], ...row };
  else rows.push({ created_at: new Date().toISOString(), ...row });
  lsWrite(t, rows);
  return true;
}

export async function dbUpdate(t: TableName, id: string, patch: Record<string, any>): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.from(t).update(patch).eq('id', id);
    if (error) console.error(t, error.message);
    return !error;
  }
  lsWrite(t, lsRead(t).map((r) => (r.id === id ? { ...r, ...patch } : r)));
  return true;
}

export async function dbDelete(t: TableName, id: string): Promise<boolean> {
  if (supabase) {
    const { error } = await supabase.from(t).delete().eq('id', id);
    if (error) console.error(t, error.message);
    return !error;
  }
  lsWrite(t, lsRead(t).filter((r) => r.id !== id));
  return true;
}

// ---------- অ্যাডমিন লগইন ----------
export async function signIn(email: string, password: string): Promise<string | null> {
  if (!supabase) return password === 'demo123' ? null : 'ডেমো মোডে পাসওয়ার্ড হলো: demo123';
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? 'ইমেইল বা পাসওয়ার্ড ভুল' : null;
}

export async function signOut(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
}

export async function hasSession(): Promise<boolean> {
  if (!supabase) return false;
  const { data } = await supabase.auth.getSession();
  return Boolean(data.session);
}

export function onAuthChange(cb: (loggedIn: boolean) => void): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(Boolean(session)));
  return () => data.subscription.unsubscribe();
}
