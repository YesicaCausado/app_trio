# Integración de Supabase

## Pasos para completar la integración:

1. **Obtener la URL de tu proyecto Supabase:**
   - Ve a https://supabase.com/dashboard
   - Selecciona tu proyecto
   - En "Settings" → "API", copia la URL del proyecto

2. **Actualizar `.env.local`:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Zptc9-gOC09dNTQrDU-2ZQ_LcgOKj0Z
   ```

3. **Usar Supabase en tus componentes:**

   ```typescript
   'use client'
   import { useSupabase } from '@/lib/useSupabase'

   export default function MyComponent() {
     const { client, loading } = useSupabase()

     // Usar client para operaciones CRUD
     // Ejemplo:
     // const { data, error } = await client.from('table_name').select('*')
   }
   ```

4. **Ejemplo de operaciones comunes:**

   ```typescript
   // Obtener datos
   const { data } = await client.from('tabla').select('*')

   // Insertar
   const { data, error } = await client.from('tabla').insert([{ columna: valor }])

   // Actualizar
   const { data } = await client.from('tabla').update({ columna: valor }).eq('id', 1)

   // Eliminar
   const { data } = await client.from('tabla').delete().eq('id', 1)
   ```

5. **Autenticación (opcional):**
   Para agregar autenticación, instala además:
   ```bash
   npm install @supabase/auth-helpers-nextjs
   ```

## Esquema SQL recomendado

Aplica estas sentencias en la pestaña SQL de Supabase para crear las tablas mínimas del MVP:

```sql
-- Usuarios básicos
-- Usuarios básicos
create table if not exists usuarios (
   id uuid primary key default gen_random_uuid(),
   correo text unique,
   rol text default 'usuario'
);

-- Perfil extendido del usuario
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
   unique(usuario_id, titulo_pelicula)
);

-- Preferencias del usuario
-- Preferencias del usuario
create table if not exists user_settings (
   id uuid primary key references usuarios(id),
   locale text default 'es',
   email_notifications boolean default false,
   dark_mode boolean default true,
   updated_at timestamptz default now()
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
```

También hay un archivo `supabase/schema.sql` en el repositorio con el mismo contenido.

¡Listo! Tu proyecto está configurado con Supabase.
