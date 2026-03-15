import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: 'XORS Wireframes',
  description: 'UI examples and components',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
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
