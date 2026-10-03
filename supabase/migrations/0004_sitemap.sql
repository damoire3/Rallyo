-- Rallyo — 0004 : liste des pages publiques pour le sitemap.xml
-- Fonction dans « public » (préfixe rallyo_), tables dans « rallyo » (non exposé). Voir 0001.
-- Mêmes règles de visibilité que 0003 (cagnottes active/completed, évènements publiés).
-- SECURITY DEFINER : ne renvoie que id, type et date de création.

create or replace function public.rallyo_sitemap_entries(max_items int default 5000)
returns table (
  kind       text,          -- 'campaign' | 'event'
  id         uuid,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  select * from (
    select 'campaign'::text as kind, c.id, c.created_at
    from rallyo.campaigns c
    where c.status in ('active', 'completed')
    union all
    select 'event'::text, e.id, e.created_at
    from rallyo.events e
    where e.is_published
  ) x
  order by x.created_at desc
  limit greatest(1, least(max_items, 5000));
$$;

revoke all on function public.rallyo_sitemap_entries(int) from public;
grant execute on function public.rallyo_sitemap_entries(int) to anon, authenticated;
