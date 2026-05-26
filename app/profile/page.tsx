'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [createdAt, setCreatedAt] = useState<string | null>(null)
  const [historial, setHistorial] = useState<string[]>([])
  const [favoritos, setFavoritos] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) { router.push('/login'); return }

      const user = session.user
      setEmail(user.email ?? null)
      setUserId(user.id)
      setCreatedAt(user.created_at ?? null)

      const [{ data: hist }, { data: favs }] = await Promise.all([
        supabase
          .from('historial_visualizacion')
          .select('titulo_pelicula, visto_en')
          .eq('usuario_id', user.id)
          .order('visto_en', { ascending: false })
          .limit(10),
        supabase
          .from('favoritos')
          .select('titulo_pelicula')
          .eq('usuario_id', user.id)
          .limit(20),
      ])

      setHistorial(hist?.map((h: any) => h.titulo_pelicula) ?? [])
      setFavoritos(favs?.map((f: any) => f.titulo_pelicula) ?? [])
      setLoading(false)
    }
    load()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const displayName = email?.split('@')[0] ?? 'Usuario'
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 13 }}>

      {/* Top Bar */}
      <div style={{ background: '#cc0000', padding: '6px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <div
          onClick={() => router.push('/home')}
          style={{ fontFamily: "'Georgia', serif", fontWeight: 'bold', fontSize: 26, color: '#fff', letterSpacing: 3, border: '2px solid #fff', padding: '1px 6px', cursor: 'pointer' }}
        >
          NETFLIX
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#fff', fontSize: 12, flexWrap: 'wrap' }}>
          <span
            onClick={() => router.push('/home')}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            ← Volver al inicio
          </span>
          <span style={{ color: '#ffaaaa' }}>|</span>
          <span onClick={handleLogout} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
            Cerrar sesión
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: '32px auto', padding: '0 16px' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>Cargando perfil…</div>
        ) : (
          <>
            {/* Profile card */}
            <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}>

              {/* Header */}
              <div style={{ background: 'linear-gradient(to bottom, #4a6fa5, #2d4f7c)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Avatar */}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: '#cc0000', border: '3px solid #fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 'bold', color: '#fff', fontFamily: 'Georgia, serif',
                  flexShrink: 0,
                }}>
                  {displayName[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{displayName}</div>
                  <div style={{ color: '#aac8f0', fontSize: 12, marginTop: 2 }}>Miembro desde {memberSince}</div>
                </div>
              </div>

              {/* Info rows */}
              <div style={{ padding: '16px 20px' }}>
                <InfoRow label="Correo electrónico" value={email ?? '—'} />
                <InfoRow label="ID de cuenta" value={userId ?? '—'} mono />
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              <StatCard label="Películas vistas" value={historial.length} color="#2d4f7c" />
              <StatCard label="Favoritos" value={favoritos.length} color="#cc0000" />
            </div>

            {/* Historial */}
            {historial.length > 0 && (
              <Section title="Historial reciente">
                {historial.map((t, i) => (
                  <ListItem key={i} index={i + 1} text={t} />
                ))}
              </Section>
            )}

            {/* Favoritos */}
            {favoritos.length > 0 && (
              <Section title="Mis favoritos">
                {favoritos.map((t, i) => (
                  <ListItem key={i} index={i + 1} text={t} />
                ))}
              </Section>
            )}

            {/* Logout button */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%', padding: '10px 0', marginTop: 8,
                background: 'linear-gradient(to bottom, #cc0000, #990000)',
                border: '1px solid #770000', borderRadius: 3,
                color: '#fff', fontSize: 13, fontWeight: 'bold', cursor: 'pointer',
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ── Small components ─────────────────────────────────────────────────────

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid #eee', flexWrap: 'wrap' }}>
      <span style={{ color: '#666', minWidth: 160, flexShrink: 0 }}>{label}:</span>
      <span style={{ color: '#333', fontFamily: mono ? 'monospace' : 'inherit', fontSize: mono ? 11 : 13, wordBreak: 'break-all' }}>
        {value}
      </span>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      flex: 1, minWidth: 120, background: '#fff', border: '1px solid #ccc',
      borderRadius: 4, padding: '14px 20px', textAlign: 'center',
      borderTop: `4px solid ${color}`,
    }}>
      <div style={{ fontSize: 32, fontWeight: 'bold', color }}>{value}</div>
      <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>{label}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(to bottom, #4a6fa5, #2d4f7c)', color: '#fff', fontWeight: 'bold', fontSize: 13, padding: '6px 14px' }}>
        {title}
      </div>
      <div style={{ padding: '8px 14px' }}>{children}</div>
    </div>
  )
}

function ListItem({ index, text }: { index: number; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid #f0f0f0', alignItems: 'flex-start' }}>
      <span style={{ color: '#999', minWidth: 20, textAlign: 'right', flexShrink: 0 }}>{index}.</span>
      <span style={{ color: '#336699' }}>{text}</span>
    </div>
  )
}
