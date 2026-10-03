-- Rallyo — messages de la page « Contact et aide »
-- Principe : n'importe qui peut ENVOYER un message, mais personne ne peut le LIRE via l'API publique.
-- Lecture : tableau de bord Supabase (Table Editor, schéma « rallyo ») ou connexion serveur.
--
-- La table est dans « rallyo » (non exposé) ; l'envoi passe par la fonction public.rallyo_contact_submit.
-- La clé publique (anon) étant visible de tous, la route /api/contact peut être contournée : la fonction
-- refait donc elle-même la validation et applique une limite de débit côté base de données.

create table rallyo.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 2 and 80),
  contact     text not null check (char_length(contact) between 5 and 120),
  topic       text not null check (topic in ('cagnotte','billetterie','paiement','compte','signalement','autre')),
  message     text not null check (char_length(message) between 10 and 2000),
  status      text not null default 'new' check (status in ('new','in_progress','resolved','spam'))
);

create index contact_messages_created_idx on rallyo.contact_messages (created_at desc);
create index contact_messages_status_idx  on rallyo.contact_messages (status, created_at desc);

alter table rallyo.contact_messages enable row level security;
-- Volontairement AUCUNE politique et AUCUN droit pour anon / authenticated.
revoke all on rallyo.contact_messages from public, anon, authenticated;

create or replace function public.rallyo_contact_submit(
  p_name    text,
  p_contact text,
  p_topic   text,
  p_message text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name    text := btrim(coalesce(p_name, ''));
  v_contact text := btrim(coalesce(p_contact, ''));
  v_message text := btrim(coalesce(p_message, ''));
begin
  if char_length(v_name) not between 2 and 80
     or char_length(v_contact) not between 5 and 120
     or char_length(v_message) not between 10 and 2000
     or coalesce(p_topic, '') not in ('cagnotte','billetterie','paiement','compte','signalement','autre')
  then
    raise exception 'invalid_input' using errcode = 'P0001';
  end if;

  -- Limite de débit : 100 messages / 10 min pour tout le site, 5 / 10 min pour un même contact.
  if (select count(*) from rallyo.contact_messages
        where created_at > now() - interval '10 minutes') >= 100
     or (select count(*) from rallyo.contact_messages
        where lower(contact) = lower(v_contact) and created_at > now() - interval '10 minutes') >= 5
  then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into rallyo.contact_messages (name, contact, topic, message)
  values (v_name, v_contact, p_topic, v_message);
end;
$$;

revoke all on function public.rallyo_contact_submit(text, text, text, text) from public;
grant execute on function public.rallyo_contact_submit(text, text, text, text) to anon, authenticated;
