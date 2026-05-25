-- Esquema Supabase para MVP

-- Usuarios básicos
create table if not exists usuarios (
  id uuid primary key default gen_random_uuid(),
  correo text unique,
  rol text default 'usuario'
);

-- Historial de visualización
create table if not exists historial_visualizacion (
  id serial primary key,
  usuario_id uuid not null references usuarios(id),
  titulo_pelicula text not null,
  fecha_visualizacion timestamptz default now(),
  calificacion numeric(2,1),
  notas text
);

-- Películas o series favoritas
create table if not exists favoritos (
  id serial primary key,
  usuario_id uuid not null references usuarios(id),
  titulo_pelicula text not null,
  fecha_agregado timestamptz default now(),
  unique (usuario_id, titulo_pelicula)
);
