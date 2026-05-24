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
```

También hay un archivo `supabase/schema.sql` en el repositorio con el mismo contenido.

¡Listo! Tu proyecto está configurado con Supabase.
