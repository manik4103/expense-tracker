-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── Reference Tables ────────────────────────────────────────────

create table public.business_units (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  description text,
  color       text,
  icon        text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.sub_categories (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name        text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(category_id, name)
);

create table public.recipients (
  id          uuid primary key default gen_random_uuid(),
  name        text not null unique,
  type        text check (type in ('supplier', 'agent', 'utility', 'individual', 'other')),
  phone       text,
  notes       text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── User Profiles ───────────────────────────────────────────────

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null,
  role        text not null default 'staff' check (role in ('admin', 'staff')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── Expenses (fact table) ────────────────────────────────────────

create table public.expenses (
  id               uuid primary key default gen_random_uuid(),
  expense_date     date not null,
  category_id      uuid not null references public.categories(id) on delete restrict,
  sub_category_id  uuid references public.sub_categories(id) on delete set null,
  business_unit_id uuid references public.business_units(id) on delete set null,
  recipient_id     uuid references public.recipients(id) on delete set null,
  amount           numeric(12, 2) not null check (amount > 0),
  notes            text,
  entered_by       uuid not null references public.profiles(id) on delete restrict,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index expenses_expense_date_idx     on public.expenses(expense_date desc);
create index expenses_category_id_idx      on public.expenses(category_id);
create index expenses_business_unit_id_idx on public.expenses(business_unit_id);
create index expenses_entered_by_idx       on public.expenses(entered_by);
create index expenses_recipient_id_idx     on public.expenses(recipient_id);

-- ─── Auto-create profile on signup ───────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'staff'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Row Level Security ───────────────────────────────────────────

alter table public.profiles        enable row level security;
alter table public.business_units  enable row level security;
alter table public.categories      enable row level security;
alter table public.sub_categories  enable row level security;
alter table public.recipients      enable row level security;
alter table public.expenses        enable row level security;

-- profiles
create policy "Users view own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Admin views all profiles"
  on public.profiles for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

create policy "Users update own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Admin manages profiles"
  on public.profiles for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- reference tables: all authenticated can read, only admin can write
create policy "Read business_units"   on public.business_units  for select to authenticated using (true);
create policy "Admin business_units"  on public.business_units  for all    to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'));
create policy "Read categories"       on public.categories       for select to authenticated using (true);
create policy "Admin categories"      on public.categories       for all    to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'));
create policy "Read sub_categories"   on public.sub_categories   for select to authenticated using (true);
create policy "Admin sub_categories"  on public.sub_categories   for all    to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'));
create policy "Read recipients"       on public.recipients       for select to authenticated using (true);
create policy "Admin recipients"      on public.recipients       for all    to authenticated using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'));

-- expenses
create policy "Staff view own expenses"
  on public.expenses for select to authenticated
  using (entered_by = (select auth.uid()));

create policy "Admin view all expenses"
  on public.expenses for select to authenticated
  using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'));

create policy "Insert own expenses"
  on public.expenses for insert to authenticated
  with check (entered_by = (select auth.uid()));

create policy "Staff update own expenses"
  on public.expenses for update to authenticated
  using (entered_by = (select auth.uid())) with check (entered_by = (select auth.uid()));

create policy "Admin update all expenses"
  on public.expenses for update to authenticated
  using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'));

create policy "Admin delete expenses"
  on public.expenses for delete to authenticated
  using (exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'));
