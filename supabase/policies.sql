-- Ejecuta este archivo en el SQL editor de Supabase (no se aplicará desde aquí).
-- Políticas RLS necesarias para que los usuarios autenticados puedan upsert/insert/select/modify sus propios datos.

-- === usuarios ===
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_insert_usuarios ON public.usuarios
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY allow_update_usuarios ON public.usuarios
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY allow_select_usuarios ON public.usuarios
  FOR SELECT
  USING (auth.uid() = id);

-- === favoritos ===
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_insert_favoritos ON public.favoritos
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY allow_select_favoritos ON public.favoritos
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY allow_modify_favoritos ON public.favoritos
  FOR UPDATE, DELETE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);

-- === historial_visualizacion ===
ALTER TABLE public.historial_visualizacion ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_insert_historial ON public.historial_visualizacion
  FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY allow_select_historial ON public.historial_visualizacion
  FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY allow_modify_historial ON public.historial_visualizacion
  FOR UPDATE, DELETE
  USING (auth.uid() = usuario_id)
  WITH CHECK (auth.uid() = usuario_id);
