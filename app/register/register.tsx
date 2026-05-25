'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const RED = '#cc0000'
const RED_DARK = '#990000'
const RED_DEEP = '#770000'
const BG = '#141414'
const SURFACE = '#1f1f1f'
const BORDER = '#333333'
const TEXT = '#e8e8e8'
const TEXT_MUTED = '#aaaaaa'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#2a2a2a',
  border: `1px solid ${BORDER}`,
  borderRadius: '3px',
  color: TEXT,
  fontSize: '13px',
  padding: '10px 12px',
  outline: 'none',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
}

const primaryBtnStyle: React.CSSProperties = {
  width: '100%',
  background: `linear-gradient(to bottom, ${RED}, ${RED_DARK})`,
  border: `1px solid ${RED_DEEP}`,
  borderRadius: '3px',
  color: '#fff',
  fontSize: '13px',
  fontWeight: 'bold',
  padding: '10px 0',
  cursor: 'pointer',
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  letterSpacing: '0.04em',
}

function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      alert(error.message)
      return
    }
    // Si la autenticación creó un usuario, inserta un perfil en la tabla `users`
    const userId = (data as any)?.user?.id
    if (userId) {
      const { error: insertError } = await supabase.from('usuarios').insert([{ id: userId, correo: email }])
      if (insertError) {
        console.warn('No se pudo insertar usuario en la tabla usuarios:', insertError.message)
      }
    }

    alert('Usuario registrado correctamente')
    router.push('/login')
  }

  const fieldBorder = (name: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focusedField === name ? RED : BORDER,
    boxShadow: focusedField === name ? `0 0 0 1px ${RED_DARK}` : 'none',
  })

  return (
    <div
      style={{
        background: BG,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: '4px',
          width: '340px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            background: `linear-gradient(to bottom, ${RED_DARK}, ${RED_DEEP})`,
            padding: '0 10px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            borderBottom: `1px solid ${RED_DEEP}`,
          }}
        >
          {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
            <div
              key={i}
              style={{
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: c,
              }}
            />
          ))}
          <span
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '11px',
              marginLeft: 'auto',
              marginRight: 'auto',
              letterSpacing: '0.02em',
            }}
          >
            Netflix — Crear cuenta
          </span>
        </div>

        <div style={{ textAlign: 'center', padding: '28px 0 10px' }}>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontWeight: 'bold',
              fontSize: '30px',
              color: RED,
              letterSpacing: '4px',
              textShadow: `1px 1px 0 ${RED_DEEP}`,
              display: 'inline-block',
              border: `2px solid ${RED}`,
              padding: '2px 10px',
            }}
          >
            NETFLIX
          </div>
          <p style={{ color: TEXT_MUTED, fontSize: '11px', marginTop: '10px' }}>
            Películas y series sin límites
          </p>
        </div>

        <form onSubmit={handleRegister} style={{ padding: '16px 28px 24px' }}>
          <div style={{ marginBottom: '12px' }}>
            <label
              style={{
                display: 'block',
                color: TEXT_MUTED,
                fontSize: '10px',
                marginBottom: '5px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="usuario@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              style={fieldBorder('email')}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                color: TEXT_MUTED,
                fontSize: '10px',
                marginBottom: '5px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
              style={fieldBorder('password')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...primaryBtnStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
        </form>

        <div
          style={{
            borderTop: `1px solid ${BORDER}`,
            padding: '12px 28px',
            display: 'flex',
            justifyContent: 'center',
            background: '#181818',
          }}
        >
          <span style={{ color: TEXT_MUTED, fontSize: '11px' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" style={{ color: RED, textDecoration: 'none', fontWeight: 'bold' }}>
              Ir al login
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
