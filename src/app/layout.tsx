import type { Metadata } from 'next'
import './globals.scss'

export const metadata: Metadata = {
  title: 'things \u2014 xors',
  description: 'games, products, and experiments. restoring faith in human capability and craft.',
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
