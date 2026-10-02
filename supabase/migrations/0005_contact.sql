-- Rallyo — messages de la page « Contact et aide »
-- Principe : n'importe qui peut ENVOYER un message (la route serveur /api/contact valide et filtre),
-- mais personne ne peut les LIRE via l'API publique. Lecture : tableau de bord Supabase ou clé service_role.

create table public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 80),
  contact     text not null check (char_length(contact) between 5 and 120),
  topic       text not null check (topic in ('cagnotte','billetterie','paiement','compte','signalement','autre')),
  message     text not null check (char_length(message) between 10 and 2000),
  status      text not null default 'new' check (status in ('new','in_progress','resolved','spam'))
);

create index contact_messages_created_idx on public.contact_messages (created_at desc);
create index contact_messages_status_idx  on public.contact_messages (status, created_at desc);

alter table public.contact_messages enable row level security;

-- Droits minimaux : insertion uniquement pour les rôles publics.
revoke all on public.contact_messages from anon, authenticated;
grant insert on public.contact_messages to anon, authenticated;

create policy "contact : envoi public"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (status = 'new');

-- Volontairement AUCUNE politique select / update / delete.
