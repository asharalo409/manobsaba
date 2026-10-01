-- =====================================================
-- মানবসেবা ফাউন্ডেশন - Supabase ডাটাবেজ
-- Supabase > SQL Editor > New query তে পুরোটা পেস্ট করে Run চাপুন
-- (আবার Run করলেও সমস্যা নেই)
-- =====================================================

create table if not exists settings (
  id text primary key default 'main',
  name_bn text not null default 'মানবসেবা ফাউন্ডেশন',
  name_en text not null default 'Manobseba Foundation',
  tagline_bn text not null default 'মানবতার কল্যাণে নিবেদিত',
  logo_url text,
  cover_photo_url text,
  hotline text not null default '01XXXXXXXXX',
  bkash_number text not null default '01XXXXXXXXX',
  nagad_number text not null default '01XXXXXXXXX',
  bank_name text not null default 'ব্যাংকের নাম',
  bank_account_number text not null default '0000000000',
  created_at timestamptz default now()
);

create table if not exists projects (
  id text primary key,
  title_bn text not null,
  category text not null default 'সাধারণ',
  description_bn text not null default '',
  target_amount numeric not null default 0,
  raised_amount numeric not null default 0,
  donor_count integer not null default 0,
  status text not null default 'ongoing',
  location_bn text not null default '',
  image_url text,
  coordinator text,
  created_at timestamptz default now()
);

create table if not exists donations (
  id text primary key,
  receipt_no text not null unique,
  donor_name text not null,
  donor_phone text not null,
  amount numeric not null,
  project_id text,
  project_title text not null,
  payment_method text not null,
  trx_id text not null,
  date text not null,
  time text not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists notices (
  id text primary key,
  title_bn text not null,
  category text not null default 'other',
  content_bn text not null,
  date text not null,
  is_urgent boolean default false,
  created_at timestamptz default now()
);

create table if not exists blood_donors (
  id text primary key,
  name_bn text not null,
  blood_group text not null,
  district text not null,
  phone text not null,
  created_at timestamptz default now()
);

create table if not exists chat_messages (
  id text primary key,
  sender_name text not null,
  message text not null,
  channel text not null default 'general',
  created_at timestamptz default now()
);

create table if not exists complaints (
  id text primary key,
  tracking_no text not null unique,
  subject text not null,
  details text not null,
  contact text,
  status text not null default 'pending',
  date text not null,
  created_at timestamptz default now()
);

create table if not exists ledger (
  id text primary key,
  type text not null,
  title_bn text not null,
  amount numeric not null,
  date text not null,
  created_at timestamptz default now()
);

create table if not exists media_links (
  id text primary key,
  title_bn text not null,
  kind text not null,
  url text not null,
  created_at timestamptz default now()
);

create table if not exists members (
  id text primary key,
  name_bn text not null,
  designation_bn text not null,
  district text,
  created_at timestamptz default now()
);

-- ---------- নিরাপত্তা (Row Level Security) ----------
-- নিয়ম: সবাই দেখতে পারবে (কিছু টেবিল), সবাই শুধু নতুন তথ্য যোগ করতে পারবে (কিছু টেবিলে),
-- আর এডিট/মোছা/অনুদান দেখা শুধু লগইন করা অ্যাডমিন পারবে।

do $$
declare t text;
begin
  foreach t in array array['settings','projects','donations','notices','blood_donors','chat_messages','complaints','ledger','media_links','members']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "admin all" on %I', t);
    execute format('create policy "admin all" on %I for all to authenticated using (true) with check (true)', t);
  end loop;

  -- সবাই পড়তে পারবে
  foreach t in array array['settings','projects','notices','blood_donors','chat_messages','ledger','media_links','members']
  loop
    execute format('drop policy if exists "public read" on %I', t);
    execute format('create policy "public read" on %I for select to anon, authenticated using (true)', t);
  end loop;
end $$;

-- সবাই শুধু যোগ করতে পারবে
drop policy if exists "public add" on blood_donors;
create policy "public add" on blood_donors for insert to anon with check (true);

drop policy if exists "public add" on chat_messages;
create policy "public add" on chat_messages for insert to anon with check (char_length(message) <= 500);

drop policy if exists "public add" on complaints;
create policy "public add" on complaints for insert to anon with check (status = 'pending');

drop policy if exists "public add" on donations;
create policy "public add" on donations for insert to anon with check (status = 'pending');

-- ---------- শুরুর তথ্য ----------
insert into settings (id) values ('main') on conflict (id) do nothing;

insert into projects (id, title_bn, category, description_bn, target_amount, raised_amount, donor_count, status, location_bn, coordinator) values
 ('p1','বন্যার্তদের জন্য ত্রাণ','ত্রাণ','বন্যাকবলিত পরিবারগুলোর জন্য খাবার, পানি ও ওষুধ বিতরণ।',500000,120000,48,'ongoing','সিলেট','সমন্বয়ক'),
 ('p2','শীতবস্ত্র বিতরণ','শীত','অসহায় মানুষের মাঝে কম্বল ও গরম কাপড় বিতরণ।',200000,200000,90,'completed','রংপুর','সমন্বয়ক')
on conflict (id) do nothing;

insert into notices (id, title_bn, category, content_bn, date, is_urgent) values
 ('n1','স্বাগতম','other','মানবসেবা ফাউন্ডেশনের ওয়েবসাইটে আপনাকে স্বাগতম।', to_char(now(),'YYYY-MM-DD'), false)
on conflict (id) do nothing;
