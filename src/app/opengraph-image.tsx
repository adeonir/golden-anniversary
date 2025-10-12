import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

const content = {
  names: 'Iria e Ari',
  title: 'Bodas de Ouro',
  subtitle: 'Celebrando 50 anos de amor e união. Uma jornada de vida compartilhada em família.',
  dates: ['08 de novembro de 1975', '08 de novembro de 2025'],
}

export const alt = 'Iria e Ari - Bodas de Ouro - Celebrando 50 anos de amor'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const interFont = await readFile(join(process.cwd(), 'public/fonts/Inter-Regular.woff'))
  const playfairFont = await readFile(join(process.cwd(), 'public/fonts/PlayfairDisplay-Medium.woff'))
  const monteCarloFont = await readFile(join(process.cwd(), 'public/fonts/MonteCarlo-Regular.woff'))

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #fdf8e8 0%, #f5e6c3 100%)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          maxWidth: '1000px',
        }}
      >
        <div
          style={{
            fontFamily: 'Monte Carlo',
            fontSize: '204px',
            fontWeight: 400,
            color: '#ab7224',
            lineHeight: 0.8,
            textAlign: 'center',
          }}
        >
          {content.names}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginTop: '-16px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '3px',
              background: '#e9c883',
            }}
          />
          <div
            style={{
              fontSize: '48px',
              color: '#e9c883',
            }}
          >
            ❤
          </div>
          <div
            style={{
              width: '80px',
              height: '3px',
              background: '#e9c883',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              fontFamily: 'Playfair Display',
              fontSize: '64px',
              fontWeight: 600,
              color: '#3f3f46',
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            {content.title}
          </div>

          <div
            style={{
              fontFamily: 'Inter',
              fontSize: '28px',
              fontWeight: 400,
              color: '#52525c',
              textAlign: 'center',
              lineHeight: 1.4,
              maxWidth: '800px',
            }}
          >
            {content.subtitle}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '32px',
              marginTop: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#e9c883',
                }}
              />
              <div
                style={{
                  fontFamily: 'Inter',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#52525c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {content.dates[0]}
              </div>
            </div>

            <div
              style={{
                width: '48px',
                height: '2px',
                background: '#d1d5db',
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#e9c883',
                }}
              />
              <div
                style={{
                  fontFamily: 'Inter',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#52525c',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {content.dates[1]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interFont,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Playfair Display',
          data: playfairFont,
          style: 'normal',
          weight: 600,
        },
        {
          name: 'Monte Carlo',
          data: monteCarloFont,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  )
}
