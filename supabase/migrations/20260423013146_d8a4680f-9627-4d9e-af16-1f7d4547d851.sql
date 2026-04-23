
create table public.tag_preferences (
  user_id uuid not null,
  tag_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, tag_slug)
);

alter table public.tag_preferences enable row level security;

create policy "Users read own tag prefs"
  on public.tag_preferences for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users insert own tag prefs"
  on public.tag_preferences for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users delete own tag prefs"
  on public.tag_preferences for delete
  to authenticated
  using (auth.uid() = user_id);
