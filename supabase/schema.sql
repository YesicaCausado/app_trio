-- Supabase schema para MVP

-- Usuarios básicos
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  role text default 'user'
);

-- Rides (viajes)
create table if not exists rides (
  id serial primary key,
  user_id uuid references users(id),
  origin text,
  destination text,
  status text default 'requested',
  inserted_at timestamptz default now()
);
