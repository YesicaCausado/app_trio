import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ''

// Lazy singleton — only created when both values are available,
// preventing build-time crashes during static prerendering.
let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are missing.')
    // Return a no-op placeholder so pages can still render statically
    return createClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  _client = createClient(supabaseUrl, supabaseAnonKey)
  return _client
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getClient() as any)[prop]
  },
})
