import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Assistente Construtor de Prompts',
  description: 'Construa prompts complexos de forma interativa e intuitiva',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
