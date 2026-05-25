import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Trio – Tu plataforma de streaming'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#cc0000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 160,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: 20,
            textShadow: '4px 4px 0 #880000',
            lineHeight: 1,
          }}
        >
          TRIO
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: '#ffcccc',
            marginTop: 24,
            letterSpacing: 6,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 400,
          }}
        >
          Tu plataforma de streaming
        </div>

        {/* Decorative bar */}
        <div
          style={{
            width: 120,
            height: 4,
            background: '#ffffff',
            marginTop: 32,
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  )
}
