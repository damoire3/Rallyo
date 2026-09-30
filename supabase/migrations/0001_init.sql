-- Rallyo — schéma initial (Supabase / PostgreSQL)
-- Montants en FCFA stockés en entiers (pas de décimales : le XOF n'a pas de centimes).

create extension if not exists "pgcrypto";

-- ---------- Profils (liés à auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Cagnottes ----------
create type campaign_status as enum ('draft', 'active', 'completed', 'closed');

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  title text not null check (char_length(title) between 5 and 120),
  description text,
  category text not null,
  cover_url text,
  goal_amount integer not null check (goal_amount > 0),
  raised_amount integer not null default 0 check (raised_amount >= 0),
  status campaign_status not null default 'draft',
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create type payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');

create table public.contributions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  donor_name text,
  is_anonymous boolean not null default false,
  amount integer not null check (amount >= 100),
  provider text not null,              -- ex: fedapay, kkiapay, cinetpay
  provider_ref text unique,            -- référence transaction du prestataire
  status payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- Évènements & billets ----------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  title text not null check (char_length(title) between 5 and 120),
  description text,
  category text not null,
  cover_url text,
  venue text not null,
  starts_at timestamptz not null,
  ticket_price integer not null check (ticket_price >= 0),
  capacity integer not null check (capacity > 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create type ticket_status as enum ('valid', 'used', 'cancelled', 'refunded');

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  buyer_id uuid references public.profiles(id) on delete set null,
  holder_name text not null,
  code text not null unique,           -- ex: RLY-8827-XQ21 (encodé dans le QR)
  amount_paid integer not null check (amount_paid >= 0),
  provider text,
  provider_ref text unique,
  status ticket_status not null default 'valid',
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index on public.campaigns (status, created_at desc);
create index on public.contributions (campaign_id, status);
create index on public.events (is_published, starts_at);
create index on public.tickets (event_id, status);

-- ---------- Sécurité (Row Level Security) ----------
alter table public.profiles      enable row level security;
alter table public.campaigns     enable row level security;
alter table public.contributions enable row level security;
alter table public.events        enable row level security;
alter table public.tickets       enable row level security;

create policy "profiles lisibles par tous" on public.profiles for select using (true);
create policy "profil modifiable par son propriétaire" on public.profiles for update using (auth.uid() = id);

create policy "cagnottes actives publiques" on public.campaigns for select
  using (status in ('active', 'completed') or owner_id = auth.uid());
create policy "créer sa cagnotte" on public.campaigns for insert with check (owner_id = auth.uid());
create policy "modifier sa cagnotte" on public.campaigns for update using (owner_id = auth.uid());

create policy "contributions confirmées lisibles" on public.contributions for select
  using (status = 'succeeded' or user_id = auth.uid());
-- Les insertions/mises à jour de contributions passent par le serveur (clé service_role + webhook de paiement).

create policy "évènements publiés publics" on public.events for select
  using (is_published or organizer_id = auth.uid());
create policy "créer son évènement" on public.events for insert with check (organizer_id = auth.uid());
create policy "modifier son évènement" on public.events for update using (organizer_id = auth.uid());

create policy "voir ses billets" on public.tickets for select
  using (buyer_id = auth.uid()
      or exists (select 1 from public.events e where e.id = event_id and e.organizer_id = auth.uid()));
-- L'émission et la validation des billets passent aussi par le serveur.
