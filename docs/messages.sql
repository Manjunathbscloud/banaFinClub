-- Run this in Supabase SQL Editor.
-- Creates the group chat messages table and RLS policies.

create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  body        text not null check (char_length(body) > 0 and char_length(body) <= 1000),
  created_at  timestamptz not null default now()
);

alter table public.messages enable row level security;

-- All active members can read messages
create policy "members_read_messages"
  on public.messages for select
  using (auth.uid() is not null);

-- Active members can insert their own messages
create policy "members_insert_own_message"
  on public.messages for insert
  with check (profile_id = (
    select id from public.profiles where auth_user_id = auth.uid() limit 1
  ));

-- Index for fast chronological fetch
create index if not exists messages_created_at_idx on public.messages(created_at asc);

-- Enable realtime for this table
alter publication supabase_realtime add table public.messages;
