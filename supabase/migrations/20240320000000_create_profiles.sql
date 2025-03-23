-- プロフィールテーブルの作成
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  extroversion integer default 0,
  openness integer default 0,
  conscientiousness integer default 0,
  optimism integer default 0,
  independence integer default 0
);

-- RLSの有効化
alter table public.profiles enable row level security;

-- プロフィールの参照ポリシー
create policy "プロフィールは誰でも参照可能"
  on public.profiles for select
  using (true);

-- プロフィールの作成ポリシー
create policy "認証済みユーザーは自分のプロフィールを作成可能"
  on public.profiles for insert
  with check (auth.uid() = id);

-- プロフィールの更新ポリシー
create policy "認証済みユーザーは任意のプロフィールを更新可能"
  on public.profiles for update
  using (auth.role() = 'authenticated');

-- プロフィールの削除ポリシー
create policy "ユーザーは自分のプロフィールのみ削除可能"
  on public.profiles for delete
  using (auth.uid() = id);

-- トリガーの作成
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- トリガーの設定
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 