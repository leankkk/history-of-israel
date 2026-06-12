import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Génesis: La Nación · 1948',
  description: 'Construye el Estado de Israel desde 1948 hasta 2026.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}