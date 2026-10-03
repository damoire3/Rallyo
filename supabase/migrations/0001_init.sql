-- Rallyo — schéma initial (Supabase / PostgreSQL)
--
-- ISOLATION : ce projet Supabase est PARTAGÉ avec d'autres applications (portfolio : blog_posts, projects,
-- reviews, site_settings). Rallyo ne touche jamais à leurs tables.
--   * Les TABLES de Rallyo vivent dans le schéma « rallyo », qui n'est PAS exposé par l'API :
--     aucun réglage « Exposed schemas » à faire, et personne ne peut lire/modifier ces tables avec la clé publique.
--   * Le site y accède uniquement par de petites fonctions SECURITY DEFINER préfixées « rallyo_ » placées dans
--     « public » (migrations 0002 à 0005), qui ne renvoient que des données publiques.
-- Montants en FCFA stockés en entiers (pas de décimales : le XOF n'a pas de centimes).
-- gen_random_uuid() est natif (PostgreSQL 13+) : aucune extension à installer.

create schema if not exists rallyo;
revoke all on schema rallyo from public, anon, authenticated;

-- ---------- Profils (liés à auth.users) ----------
create table rallyo.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Cagnottes ----------
create type rallyo.campaign_status as enum ('draft', 'active', 'completed', 'closed');

create table rallyo.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references rallyo.profiles(id) on delete cascade,
  slug text not null unique,
  title text not null check (char_length(title) between 5 and 120),
  description text,
  category text not null,
  cover_url text,
  goal_amount integer not null check (goal_amount > 0),
  raised_amount integer not null default 0 check (raised_amount >= 0),
  status rallyo.campaign_status not null default 'draft',
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create type rallyo.payment_status as enum ('pending', 'succeeded', 'failed', 'refunded');

create table rallyo.contributions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references rallyo.campaigns(id) on delete cascade,
  user_id uuid references rallyo.profiles(id) on delete set null,
  donor_name text,
  is_anonymous boolean not null default false,
  amount integer not null check (amount >= 100),
  provider text not null,              -- ex: fedapay, kkiapay, cinetpay
  provider_ref text unique,            -- référence transaction du prestataire
  status rallyo.payment_status not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- Évènements & billets ----------
create table rallyo.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid not null references rallyo.profiles(id) on delete cascade,
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

create type rallyo.ticket_status as enum ('valid', 'used', 'cancelled', 'refunded');

create table rallyo.tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references rallyo.events(id) on delete cascade,
  buyer_id uuid references rallyo.profiles(id) on delete set null,
  holder_name text not null,
  code text not null unique,           -- ex: RLY-8827-XQ21 (encodé dans le QR)
  amount_paid integer not null check (amount_paid >= 0),
  provider text,
  provider_ref text unique,
  status rallyo.ticket_status not null default 'valid',
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index on rallyo.campaigns (status, created_at desc);
create index on rallyo.contributions (campaign_id, status);
create index on rallyo.events (is_published, starts_at);
create index on rallyo.tickets (event_id, status);

-- ---------- Sécurité (Row Level Security) ----------
-- Défense en profondeur : le schéma n'est pas exposé et aucun droit n'est donné à anon / authenticated.
-- Si un jour le schéma était exposé par erreur, ces règles limiteraient quand même l'accès.
alter table rallyo.profiles      enable row level security;
alter table rallyo.campaigns     enable row level security;
alter table rallyo.contributions enable row level security;
alter table rallyo.events        enable row level security;
alter table rallyo.tickets       enable row level security;

-- CORRECTION par rapport à la première version : un profil (nom, téléphone) n'est lisible que par son propriétaire.
-- Le nom affiché d'un organisateur est renvoyé par les fonctions publiques (0002 et 0003), pas par la table.
create policy "voir son profil" on rallyo.profiles for select using (auth.uid() = id);
create policy "profil modifiable par son propriétaire" on rallyo.profiles for update using (auth.uid() = id);

create policy "cagnottes actives publiques" on rallyo.campaigns for select
  using (status in ('active', 'completed') or owner_id = auth.uid());
create policy "créer sa cagnotte" on rallyo.campaigns for insert with check (owner_id = auth.uid());
create policy "modifier sa cagnotte" on rallyo.campaigns for update using (owner_id = auth.uid());

create policy "contributions confirmées lisibles" on rallyo.contributions for select
  using (status = 'succeeded' or user_id = auth.uid());
-- Les insertions/mises à jour de contributions passent par le serveur (webhook de paiement).

create policy "évènements publiés publics" on rallyo.events for select
  using (is_published or organizer_id = auth.uid());
create policy "créer son évènement" on rallyo.events for insert with check (organizer_id = auth.uid());
create policy "modifier son évènement" on rallyo.events for update using (organizer_id = auth.uid());

create policy "voir ses billets" on rallyo.tickets for select
  using (buyer_id = auth.uid()
      or exists (select 1 from rallyo.events e where e.id = event_id and e.organizer_id = auth.uid()));
-- L'émission et la validation des billets passent aussi par le serveur.

-- Aucun droit direct pour les rôles publics (même si Supabase en accordait par défaut).
revoke all on all tables in schema rallyo from public, anon, authenticated;
