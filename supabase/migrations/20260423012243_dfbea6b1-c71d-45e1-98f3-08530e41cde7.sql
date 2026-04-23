-- ========== Bildirim tercihleri ==========
create table public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notify_new_post boolean not null default true,
  notify_followed_author boolean not null default true,
  notify_comments boolean not null default true,
  notify_system boolean not null default true,
  email_digest boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.notification_preferences enable row level security;

create policy "Users read own notification prefs"
on public.notification_preferences for select to authenticated
using (auth.uid() = user_id);
create policy "Users insert own notification prefs"
on public.notification_preferences for insert to authenticated
with check (auth.uid() = user_id);
create policy "Users update own notification prefs"
on public.notification_preferences for update to authenticated
using (auth.uid() = user_id);

create trigger notification_prefs_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

-- ========== İçerik tercihleri (kategoriler) ==========
create table public.content_preferences (
  user_id uuid not null references auth.users(id) on delete cascade,
  category_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, category_slug)
);
alter table public.content_preferences enable row level security;

create policy "Users read own content prefs"
on public.content_preferences for select to authenticated
using (auth.uid() = user_id);
create policy "Users insert own content prefs"
on public.content_preferences for insert to authenticated
with check (auth.uid() = user_id);
create policy "Users delete own content prefs"
on public.content_preferences for delete to authenticated
using (auth.uid() = user_id);

-- ========== Takip edilen yazarlar ==========
create table public.author_follows (
  user_id uuid not null references auth.users(id) on delete cascade,
  author_slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, author_slug)
);
alter table public.author_follows enable row level security;

create policy "Users read own follows"
on public.author_follows for select to authenticated
using (auth.uid() = user_id);
create policy "Users insert own follows"
on public.author_follows for insert to authenticated
with check (auth.uid() = user_id);
create policy "Users delete own follows"
on public.author_follows for delete to authenticated
using (auth.uid() = user_id);

-- ========== Okuma listeleri ==========
create table public.reading_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.reading_lists enable row level security;

create unique index reading_lists_one_default_per_user
on public.reading_lists (user_id) where is_default = true;

create policy "Users read own lists"
on public.reading_lists for select to authenticated
using (auth.uid() = user_id);
create policy "Users insert own lists"
on public.reading_lists for insert to authenticated
with check (auth.uid() = user_id);
create policy "Users update own lists"
on public.reading_lists for update to authenticated
using (auth.uid() = user_id);
create policy "Users delete own non-default lists"
on public.reading_lists for delete to authenticated
using (auth.uid() = user_id and is_default = false);

create trigger reading_lists_updated_at
before update on public.reading_lists
for each row execute function public.set_updated_at();

-- ========== Liste içindeki yazılar ==========
create table public.reading_list_items (
  list_id uuid not null references public.reading_lists(id) on delete cascade,
  article_slug text not null,
  added_at timestamptz not null default now(),
  primary key (list_id, article_slug)
);
alter table public.reading_list_items enable row level security;

-- Yardımcı: bu liste benim mi?
create or replace function public.is_my_list(_list_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.reading_lists
    where id = _list_id and user_id = auth.uid()
  )
$$;

create policy "Users read own list items"
on public.reading_list_items for select to authenticated
using (public.is_my_list(list_id));
create policy "Users insert own list items"
on public.reading_list_items for insert to authenticated
with check (public.is_my_list(list_id));
create policy "Users delete own list items"
on public.reading_list_items for delete to authenticated
using (public.is_my_list(list_id));

-- ========== Tamamlanan yazılar ==========
create table public.completed_articles (
  user_id uuid not null references auth.users(id) on delete cascade,
  article_slug text not null,
  read_minutes int not null default 0,
  completed_at timestamptz not null default now(),
  primary key (user_id, article_slug)
);
alter table public.completed_articles enable row level security;

create policy "Users read own completed"
on public.completed_articles for select to authenticated
using (auth.uid() = user_id);
create policy "Users insert own completed"
on public.completed_articles for insert to authenticated
with check (auth.uid() = user_id);
create policy "Users delete own completed"
on public.completed_articles for delete to authenticated
using (auth.uid() = user_id);

create index completed_articles_user_date_idx
on public.completed_articles (user_id, completed_at desc);

-- ========== Yeni kullanıcı kurulumunu genişlet ==========
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );

  insert into public.notification_preferences (user_id) values (new.id);

  insert into public.reading_lists (user_id, name, is_default)
  values (new.id, 'Kaydettiklerim', true);

  return new;
end;
$$;

-- Mevcut kullanıcılar için trigger'ı yeniden bağla
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ========== Streak hesabı ==========
create or replace function public.get_user_reading_stats(_user_id uuid)
returns table (
  total_completed int,
  total_minutes int,
  current_streak int,
  last_completed_at timestamptz
)
language plpgsql stable security definer
set search_path = public
as $$
declare
  _today date := (now() at time zone 'UTC')::date;
  _streak int := 0;
  _check_date date;
  _has_record boolean;
begin
  select coalesce(count(*), 0)::int,
         coalesce(sum(read_minutes), 0)::int,
         max(completed_at)
    into total_completed, total_minutes, last_completed_at
  from public.completed_articles
  where user_id = _user_id;

  -- Streak: bugünden geriye doğru, kesinti olmadan kaç gün var
  _check_date := _today;
  loop
    select exists (
      select 1 from public.completed_articles
      where user_id = _user_id
        and (completed_at at time zone 'UTC')::date = _check_date
    ) into _has_record;

    if _has_record then
      _streak := _streak + 1;
      _check_date := _check_date - 1;
    else
      -- Sadece bugünde boşluk varsa, dünden başlayarak deneyelim
      if _check_date = _today then
        _check_date := _check_date - 1;
      else
        exit;
      end if;
    end if;

    if _streak > 3650 then exit; end if; -- güvenlik
  end loop;

  current_streak := _streak;
  return next;
end;
$$;