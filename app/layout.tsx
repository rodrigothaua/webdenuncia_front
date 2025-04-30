import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Web Denúncia Anônima',
  description: 'Aplicação de denúncia anônima criada front-end com Next.js e Back-end com Laravel',
  generator: 'Rodrigo thauã',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
