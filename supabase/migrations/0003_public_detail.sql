-- Rallyo — 0003 : lecture publique d'une cagnotte / d'un évènement (pages de détail et paiement)
-- Fonctions dans « public » (préfixe rallyo_), tables dans « rallyo » (non exposé). Voir 0001.
-- SECURITY DEFINER : donne les agrégats (nombre de soutiens, billets restants) sans ouvrir la lecture
-- des tables `contributions` et `tickets`. Mêmes règles de visibilité que les politiques RLS de 0001.

create or replace function public.rallyo_campaign_public(p_id uuid)
returns table (
  id            uuid,
  title         text,
  category      text,
  goal_amount   int,
  raised_amount int,
  supporters    int,
  ends_at       timestamptz,
  owner_name    text,
  cover_url     text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id, c.title, c.category, c.goal_amount, c.raised_amount,
    (select count(*) from rallyo.contributions k
       where k.campaign_id = c.id and k.status = 'succeeded')::int,
    c.ends_at, p.full_name, c.cover_url
  from rallyo.campaigns c
  join rallyo.profiles p on p.id = c.owner_id
  where c.id = p_id
    and c.status in ('active', 'completed');
$$;

create or replace function public.rallyo_event_public(p_id uuid)
returns table (
  id           uuid,
  title        text,
  category     text,
  venue        text,
  starts_at    timestamptz,
  ticket_price int,
  capacity     int,
  tickets_left int,
  cover_url    text
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    e.id, e.title, e.category, e.venue, e.starts_at, e.ticket_price, e.capacity,
    greatest(0, e.capacity - (select count(*) from rallyo.tickets t
       where t.event_id = e.id and t.status in ('valid', 'used')))::int,
    e.cover_url
  from rallyo.events e
  where e.id = p_id
    and e.is_published;
$$;

revoke all on function public.rallyo_campaign_public(uuid) from public;
revoke all on function public.rallyo_event_public(uuid) from public;
grant execute on function public.rallyo_campaign_public(uuid) to anon, authenticated;
grant execute on function public.rallyo_event_public(uuid) to anon, authenticated;
