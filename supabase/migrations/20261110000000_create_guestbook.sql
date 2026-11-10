create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  username text not null,
  avatar_url text,
  content text not null,
  created_at timestamptz not null default now(),
  constraint messages_content_length check (char_length(content) between 1 and 1000)
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);

create or replace function public.stamp_message_author()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  author_id uuid := auth.uid();
  identity jsonb;
begin
  if author_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select i.identity_data
    into identity
    from auth.identities i
   where i.user_id = author_id
     and i.provider = 'github'
   order by i.last_sign_in_at desc nulls last
   limit 1;

  if identity is null then
    raise exception 'A GitHub account is required to post' using errcode = '42501';
  end if;

  new.user_id := author_id;
  new.username := coalesce(
    nullif(btrim(identity ->> 'user_name'), ''),
    nullif(btrim(identity ->> 'preferred_username'), ''),
    nullif(btrim(identity ->> 'name'), ''),
    'GitHub User'
  );
  new.avatar_url := nullif(btrim(identity ->> 'avatar_url'), '');
  new.content := regexp_replace(new.content, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists messages_stamp_author on public.messages;
create trigger messages_stamp_author
  before insert on public.messages
  for each row execute function public.stamp_message_author();

alter table public.messages enable row level security;

drop policy if exists "Messages are publicly readable" on public.messages;
create policy "Messages are publicly readable"
  on public.messages for select
  to anon, authenticated
  using (true);

drop policy if exists "Signed-in users can post as themselves" on public.messages;
create policy "Signed-in users can post as themselves"
  on public.messages for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on table public.messages from anon, authenticated;
grant select on table public.messages to anon, authenticated;
grant insert (content) on table public.messages to authenticated;

do $$
begin
  if not exists (
    select 1
      from pg_publication_tables
     where pubname = 'supabase_realtime'
       and schemaname = 'public'
       and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;
