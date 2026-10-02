-- Rallyo — 0002 : vitrine de la landing (défilé « Ça se passe chez nous »)
-- Renvoie au plus 13 évènements / cagnottes EN COURS, triés par popularité.
-- SECURITY DEFINER : les billets ne sont pas lisibles publiquement (RLS), on n'expose ici que des agrégats.
--
-- Popularité = 10 x (billets vendus ou contributions confirmées)
--            + avancement en % (jauge de la cagnotte, ou taux de remplissage de l'évènement)
--            + bonus de fraîcheur (30 points le jour de la création, 0 après 30 jours)

create or replace function public.showcase_popular(max_items int default 13)
returns table (
  kind          text,      -- 'campaign' | 'event'
  id            uuid,
  slug          text,
  title         text,
  category      text,
  subtitle      text,      -- organisateur (cagnotte) ou lieu (évènement)
  cover_url     text,
  progress_pct  int,       -- cagnotte uniquement
  ticket_price  int,       -- évènement uniquement (FCFA)
  tickets_left  int,       -- évènement uniquement
  popularity    numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with camp as (
    select
      'campaign'::text                                              as kind,
      c.id, c.slug, c.title, c.category,
      p.full_name                                                   as subtitle,
      c.cover_url,
      least(100, floor(c.raised_amount * 100.0 / c.goal_amount))::int as progress_pct,
      null::int                                                     as ticket_price,
      null::int                                                     as tickets_left,
      (count(k.id) * 10
        + least(100, c.raised_amount * 100.0 / c.goal_amount)
        + greatest(0, 30 - extract(day from now() - c.created_at)::numeric))::numeric as popularity
    from public.campaigns c
    join public.profiles p on p.id = c.owner_id
    left join public.contributions k on k.campaign_id = c.id and k.status = 'succeeded'
    where c.status = 'active'
      and (c.ends_at is null or c.ends_at > now())
    group by c.id, p.full_name
  ),
  evt as (
    select
      'event'::text                                                 as kind,
      e.id, e.slug, e.title, e.category,
      e.venue                                                       as subtitle,
      e.cover_url,
      null::int                                                     as progress_pct,
      e.ticket_price,
      greatest(0, e.capacity - count(t.id))::int                    as tickets_left,
      (count(t.id) * 10
        + least(100, count(t.id) * 100.0 / e.capacity)
        + greatest(0, 30 - extract(day from now() - e.created_at)::numeric))::numeric as popularity
    from public.events e
    left join public.tickets t on t.event_id = e.id and t.status in ('valid', 'used')
    where e.is_published
      and e.starts_at >= now() - interval '6 hours'   -- à venir ou tout juste commencé
    group by e.id
  )
  select * from (select * from camp union all select * from evt) x
  order by x.popularity desc, x.title
  limit greatest(1, least(max_items, 13));
$$;

revoke all on function public.showcase_popular(int) from public;
grant execute on function public.showcase_popular(int) to anon, authenticated;
