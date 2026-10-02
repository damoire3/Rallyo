-- Rallyo — 0004 : liste des pages publiques pour le sitemap.xml
-- Mêmes règles de visibilité que 0003 (cagnottes active/completed, évènements publiés).
-- SECURITY DEFINER : ne renvoie que id, type et date de création.

create or replace function public.sitemap_entries(max_items int default 5000)
returns table (
  kind       text,          -- 'campaign' | 'event'
  id         uuid,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select * from (
    select 'campaign'::text as kind, c.id, c.created_at
    from public.campaigns c
    where c.status in ('active', 'completed')
    union all
    select 'event'::text, e.id, e.created_at
    from public.events e
    where e.is_published
  ) x
  order by x.created_at desc
  limit greatest(1, least(max_items, 5000));
$$;

revoke all on function public.sitemap_entries(int) from public;
grant execute on function public.sitemap_entries(int) to anon, authenticated;
